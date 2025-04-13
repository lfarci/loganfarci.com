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

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --environment) github_environment="$2"; shift ;;
        --subscription) subscription_id="$2"; shift ;;
        --debug) set -x; shift ;;
        *) error_exit "Unknown parameter passed: $1" ;;
    esac
    shift
done

# Validate required arguments
[[ -z "$github_environment" ]] && error_exit "--environment is required."

# Ensure prerequisites
ensure_azure_authenticated
ensure_git_repository

# Retrieve subscription and tenant IDs if not provided
[[ -z "$subscription_id" ]] && get_subscription_and_tenant_ids

# Normalize variables
github_environment_lowercase=$(echo "$github_environment" | tr '[:upper:]' '[:lower:]')
service_principal_name="gha-$github_environment_lowercase-sp"
role="Contributor"
scope="/subscriptions/$subscription_id"
federated_credential_name="gha-$github_environment_lowercase-oidc"
git_repository_remote_url=$(git config --get remote.origin.url)
github_organisation_name=$(basename "$(dirname "$git_repository_remote_url")")
github_repository_name=$(basename -s .git "$git_repository_remote_url")
github_repository_full_name="$github_organisation_name/$github_repository_name"

# Output repository and subscription details
echo "================================================================================"
echo "Create service principal for GitHub Actions"
echo "================================================================================"
echo "Context"
echo "--------------------------------------------------------------------------------"
echo "Repository: $github_repository_full_name"
echo "Subscription ID: $subscription_id"
echo "Tenant ID: $subscription_id"
echo

# Create or retrieve app registration
echo "--------------------------------------------------------------------------------"
echo "Step 1: Ensuring Azure App Registration..."
app_id=$(get_or_create_app_registration "$service_principal_name")
echo "App Registration ensured with App ID: $app_id"
echo

# Ensure service principal exists
echo "Step 2: Ensuring Service Principal..."
echo "--------------------------------------------------------------------------------"
ensure_service_principal "$app_id"
echo "Service Principal ensured for App ID: $app_id"
echo

# Ensure role assignment exists
echo "Step 3: Ensuring Role Assignment..."
echo "--------------------------------------------------------------------------------"
ensure_role_assignment "$app_id" "$role" "$scope"
echo "Role Assignment ensured for App ID: $app_id with role: $role and scope: $scope"
echo

# Ensure federated identity credential exists
echo "Step 4: Ensuring Federated Identity Credential..."
echo "--------------------------------------------------------------------------------"
ensure_federated_identity_credential "$app_id" "$federated_credential_name" "$github_repository_full_name" "$github_environment"
echo "Federated Identity Credential ensured for App ID: $app_id with name: $federated_credential_name"
echo

# Ensure the GitHub environment exists in the repository
echo "Step 5: Ensuring GitHub Environment..."
echo "--------------------------------------------------------------------------------"
if gh api repos/"$github_repository_full_name"/environments/"$github_environment" > /dev/null 2>&1; then
    echo "GitHub environment '$github_environment' already exists in repository '$github_repository_full_name'."
else
    echo "Creating GitHub environment '$github_environment' in repository '$github_repository_full_name'..."
    gh api --method PUT -H "Accept: application/vnd.github+json" repos/$github_repository_full_name/environments/$github_environment || error_exit "Failed to create GitHub environment '$github_environment'."
fi
echo "GitHub environment ensured: $github_environment"
echo

# Step 6: Setting secrets in the GitHub environment
echo "--------------------------------------------------------------------------------"
echo "Step 6: Setting Secrets in GitHub Environment..."
echo "--------------------------------------------------------------------------------"

gh secret set AZURE_CLIENT_ID --body "$app_id" --env "$github_environment" || error_exit "Failed to set AZURE_CLIENT_ID secret."
gh secret set AZURE_SUBSCRIPTION_ID --body "$subscription_id" --env "$github_environment" || error_exit "Failed to set AZURE_SUBSCRIPTION_ID secret."
gh secret set AZURE_TENANT_ID --body "$tenant_id" --env "$github_environment" || error_exit "Failed to set AZURE_TENANT_ID secret."

echo "Secrets successfully set in the GitHub environment: $github_environment"
echo

echo "================================================================================"
echo "GitHub Actions environment: $github_environment"
echo "--------------------------------------------------------------------------------"
echo
echo "Set the following secrets in the $github_environment environment:"
echo "- AZURE_CLIENT_ID: $app_id"
echo "- AZURE_SUBSCRIPTION_ID: $subscription_id"
echo "- AZURE_TENANT_ID: $tenant_id"
echo "================================================================================"