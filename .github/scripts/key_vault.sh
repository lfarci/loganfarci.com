#!/bin/bash

# Check if DESTROY is set to true
if [ "$DESTROY" == "true" ]; then
    echo "DESTROY is set to true. Deleting Key Vault $KEY_VAULT_NAME..."
    az keyvault delete --name "$KEY_VAULT_NAME" --resource-group "$RESOURCE_GROUP_NAME"
    if [ $? -eq 0 ]; then
        echo "Key Vault $KEY_VAULT_NAME deleted successfully."
    else
        echo "Failed to delete Key Vault $KEY_VAULT_NAME."
        exit 1
    fi
    exit 0
fi

echo "Checking if Key Vault $KEY_VAULT_NAME exists..."
EXISTING_VAULT=$(az keyvault show --name "$KEY_VAULT_NAME" --resource-group "$RESOURCE_GROUP_NAME" --query "name" -o tsv 2>/dev/null)

if [ "$EXISTING_VAULT" == "$KEY_VAULT_NAME" ]; then
    echo "Key Vault $KEY_VAULT_NAME already exists. Skipping creation."
    exit 0
fi

echo "Creating Azure Key Vault $KEY_VAULT_NAME in resource group $RESOURCE_GROUP_NAME at location $LOCATION..."
az keyvault create --name "$KEY_VAULT_NAME" --resource-group "$RESOURCE_GROUP_NAME" --location "$LOCATION"

if [ $? -eq 0 ]; then
    echo "Key Vault $KEY_VAULT_NAME created successfully."
else
    echo "Failed to create Key Vault $KEY_VAULT_NAME."
    exit 1
fi
