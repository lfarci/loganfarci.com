#!/bin/bash

source "scripts/library.sh"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --environment) github_environment="$2"; shift ;;
        --subscription) subscription_id="$2"; shift ;;
        --group) resource_group_name="$2"; shift ;;
        --debug) set -x; shift ;;
        *) error_exit "Unknown parameter passed: $1" ;;
    esac
    shift
done

[[ -z "$github_environment" ]] && error_exit "--environment is required."

ensure_azure_authenticated

git_repository_remote_url=$(git config --get remote.origin.url)
github_organisation_name=$(basename "$(dirname "$git_repository_remote_url")")
github_repository_name=$(basename -s .git "$git_repository_remote_url")
github_repository_full_name="$github_organisation_name/$github_repository_name"
github_environment_lowercase=$(echo "$github_environment" | tr '[:upper:]' '[:lower:]')
service_principal_name="gha-$github_environment_lowercase-sp"
federated_credential_name="gha-$github_environment_lowercase-oidc"
key_vault_name="kv$(echo -n "${github_repository_full_name}-${github_environment}" | sha256sum | cut -c1-8)"

echo "Step 1: Deleting Federated Identity Credential..."
app_id=$(az ad app list --filter "displayName eq '$service_principal_name'" --query "[].appId" -o tsv | tr -d '\r')
if [[ -n "$app_id" ]]; then
    existing_federated_credential_id=$(az ad app federated-credential list --id "$app_id" --query "[?name=='$federated_credential_name'].id" -o tsv | tr -d '\r')
    if [[ -n "$existing_federated_credential_id" ]]; then
        az ad app federated-credential delete --id "$app_id" --federated-credential-id "$existing_federated_credential_id" || error_exit "Failed to delete federated identity credential."
        echo "Federated Identity Credential deleted: $federated_credential_name"
    else
        echo "Federated Identity Credential does not exist: $federated_credential_name"
    fi
else
    echo "App Registration does not exist: $service_principal_name"
fi
echo

echo "Step 2: Deleting Service Principal..."
if [[ -n "$app_id" ]]; then
    az ad sp delete --id "$app_id" || error_exit "Failed to delete Service Principal."
    echo "Service Principal deleted: $service_principal_name"
else
    echo "Service Principal does not exist: $service_principal_name"
fi
echo

echo "Step 3: Deleting App Registration..."
if [[ -n "$app_id" ]]; then
    az ad app delete --id "$app_id" || error_exit "Failed to delete App Registration."
    echo "App Registration deleted: $service_principal_name"
else
    echo "App Registration does not exist: $service_principal_name"
fi
echo

echo "Step 4: Deleting Key Vault..."
if az keyvault show --name "$key_vault_name" --resource-group "$resource_group_name" > /dev/null 2>&1; then
    az keyvault delete --name "$key_vault_name" || error_exit "Failed to delete Key Vault."
    az keyvault purge --name "$key_vault_name" --no-wait || error_exit "Failed to purge Key Vault."
    echo "Key Vault deleted: $key_vault_name"
else
    echo "Key Vault does not exist: $key_vault_name"
fi
echo