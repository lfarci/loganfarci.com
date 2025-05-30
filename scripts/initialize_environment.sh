#!/bin/bash

source "scripts/library.sh"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --environment) github_environment="$2"; shift ;;
        --subscription) subscription_id="$2"; shift ;;
        --group) resource_group_name="$2"; shift ;;
        --location) location="$2"; shift ;;
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

# Set default location if not provided
if [[ -z "$location" ]]; then
    location="germanywestcentral"
    echo "Location not provided. Defaulting to: $location"
fi

# Set default resource group name if not provided
if [[ -z "$resource_group_name" ]]; then
    resource_group_name="management-rg"
    echo "Resource group name not provided. Defaulting to: $resource_group_name"
fi

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

echo "Step 5: Create Key Vault..."
echo "--------------------------------------------------------------------------------"
echo "Ensuring Resource Group..."
if az group show --name "$resource_group_name" > /dev/null 2>&1; then
    echo "Resource Group '$resource_group_name' already exists."
else
    echo "Creating Resource Group '$resource_group_name'..."
    az group create --name "$resource_group_name" --location "$location" || error_exit "Failed to create Resource Group '$resource_group_name'."
fi
echo "Resource Group ensured: $resource_group_name"
echo

key_vault_name="kv$(echo -n "${github_repository_full_name}-${github_environment}" | sha256sum | cut -c1-8)"

echo "Ensuring Key Vault..."
if az keyvault show --name "$key_vault_name" --resource-group "$resource_group_name" > /dev/null 2>&1; then
    echo "Key Vault '$key_vault_name' already exists."
else
    echo "Creating Key Vault '$key_vault_name'..."
    az keyvault create --name "$key_vault_name" --resource-group "$resource_group_name" --location "$location" || error_exit "Failed to create Key Vault '$key_vault_name'."
fi
echo "Key Vault ensured: $key_vault_name"
echo

echo "Step 4.1: Assigning Key Vault Secrets Officer role to the Service Principal..."
echo "--------------------------------------------------------------------------------"
key_vault_scope=$(az keyvault show --name "$key_vault_name" --query "id" -o tsv | tr -d '\r')
ensure_role_assignment "$app_id" "Key Vault Secrets Officer" "$key_vault_scope" || error_exit "Failed to assign Key Vault Secrets Officer role to Service Principal."
echo "Key Vault Secrets Officer role assigned to Service Principal: $app_id"
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
gh secret set AZURE_KEY_VAULT_NAME --body "$key_vault_name" --env "$github_environment" || error_exit "Failed to set AZURE_KEY_VAULT_NAME secret."

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