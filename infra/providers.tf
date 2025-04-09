terraform {
  required_version = ">= 1.10.0"

  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.26.0"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}
