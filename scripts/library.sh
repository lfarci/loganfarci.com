#!/bin/bash

# Function to print error messages and exit the script
# Arguments:
#   $1 - The error message to display
function error_exit() {
    echo "Error: $1"
    exit 1
}

# Function to check if a command exists in the system
# Arguments:
#   $1 - The name of the command to check
function command_exists() {
    command -v "$1" > /dev/null 2>&1
}

# Function to ensure the user is authenticated with Azure CLI
# Exits the script if the user is not authenticated
function ensure_azure_authenticated() {
    if ! az account show > /dev/null 2>&1; then
        error_exit "You are not authenticated with Azure CLI. Please run 'az login' to authenticate."
    fi
}

# Function to retrieve the subscription ID and tenant ID from the Azure CLI context
# Sets the global variables `subscription_id` and `tenant_id`
# Exits the script if the subscription ID cannot be retrieved
function get_subscription_and_tenant_ids() {
    subscription_id=$(az account show --query "id" -o tsv | tr -d '\r')
    tenant_id=$(az account show --query "tenantId" -o tsv | tr -d '\r')
    if [[ -z "$subscription_id" ]]; then
        error_exit "Unable to retrieve subscription ID from the current Azure CLI context. Try passing it with --subscription."
    fi
}

# Function to ensure the current directory is a Git repository
# Exits the script if the directory is not a Git repository
function ensure_git_repository() {
    if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        error_exit "The current directory is not a Git repository."
    fi
}

# Function to create or retrieve an Azure app registration
# Arguments:
#   $1 - The display name of the app registration
# Returns:
#   The App ID of the app registration
function get_or_create_app_registration() {
    local app_name="$1"
    existing_app_id=$(az ad app list --filter "displayName eq '$app_name'" --query "[].appId" -o tsv)
    if [[ -n "$existing_app_id" ]]; then
        echo "$existing_app_id" | tr -d '\r'
    else
        local app_id=$(az ad app create --display-name "$app_name" --query "appId" -o tsv | tr -d '\r')
        if [[ -z "$app_id" ]]; then
            error_exit "App registration creation failed. No App ID returned."
        fi
        echo "$app_id"
    fi
}

# Function to create or ensure the existence of a service principal for an app
# Arguments:
#   $1 - The App ID of the app registration
function ensure_service_principal() {
    local app_id="$1"
    existing_sp=$(az ad sp show --id "$app_id" --query "id" -o tsv)
    if [[ -n "$existing_sp" ]]; then
        echo "Service Principal already exists for App ID: $app_id"
    else
        echo "Creating Service Principal for the app..."
        az ad sp create --id "$app_id"
    fi
}

# Function to create or ensure the existence of a role assignment for a service principal
# Arguments:
#   $1 - The App ID of the service principal
#   $2 - The role to assign (e.g., "Contributor")
#   $3 - The scope of the role assignment (e.g., subscription ID)
function ensure_role_assignment() {
    local app_id="$1"
    local role="$2"
    local scope="$3"
    existing_role_assignment=$(az role assignment list --assignee "$app_id" --scope "$scope" --query "[?roleDefinitionName=='$role']" -o tsv)
    if [[ -n "$existing_role_assignment" ]]; then
        echo "Role assignment already exists for App ID: $app_id with role: $role"
    else
        echo "Assigning role to the Service Principal..."
        az role assignment create --assignee "$app_id" --role "$role" --scope "$scope"
    fi
}

# Function to create or ensure the existence of a federated identity credential for an app
# Arguments:
#   $1 - The App ID of the app registration
#   $2 - The name of the federated identity credential
#   $3 - The full name of the GitHub repository (e.g., "org/repo")
#   $4 - The GitHub Actions environment name
function ensure_federated_identity_credential() {
    local app_id="$1"
    local credential_name="$2"
    local repository_full_name="$3"
    local environment="$4"
    existing_federated_credential=$(az ad app federated-credential list --id "$app_id" --query "[?name=='$credential_name']" -o tsv)
    if [[ -n "$existing_federated_credential" ]]; then
        echo "Federated identity credential already exists for App ID: $app_id with name: $credential_name"
    else
        echo "Creating federated identity credential..."
        az ad app federated-credential create --id "$app_id" \
            --parameters '{
                "name": "'"$credential_name"'",
                "issuer": "https://token.actions.githubusercontent.com",
                "subject": "repo:'"$repository_full_name"':environment:'"$environment"'",
                "audiences": ["api://AzureADTokenExchange"]
            }' || error_exit "Failed to create federated identity credential."
    fi
}