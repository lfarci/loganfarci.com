#!/bin/bash

set -e

echo "Checking if resource group $RESOURCE_GROUP exists..."
if ! az group show --name $RESOURCE_GROUP &>/dev/null; then
    echo "Creating resource group named $RESOURCE_GROUP..."
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo "Resource group $RESOURCE_GROUP already exists."
fi

echo "Checking if storage account $STORAGE_ACCOUNT_NAME exists..."
if ! az storage account show --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "Creating storage account..."
    az storage account create --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --sku Standard_LRS
else
    echo "Storage account $STORAGE_ACCOUNT_NAME already exists."
fi

echo "Retrieving storage account key..."
STORAGE_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

echo "Checking if blob container $CONTAINER_NAME exists..."
if ! az storage container show --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY &>/dev/null; then
    echo "Creating blob container..."
    az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY
else
    echo "Blob container $CONTAINER_NAME already exists."
fi

echo "Storage account and container setup completed successfully."