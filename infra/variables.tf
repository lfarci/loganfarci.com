variable "subscription_id" {
    description = "The Azure subscription ID where resources will be deployed."
    type        = string
}

variable "workload_name" {
    description = "A non-empty string used to describe the workload running on the deployed infrastructure."
    type        = string
    default     = "lfarci"
}

variable "location" {
    description = "The Azure region where resources will be deployed."
    type        = string
    default     = "westeurope"
}

variable "static_web_app_sku_tier" {
    description = "The SKU tier for the Static Web App."
    type        = string
    default     = "Free"
}

variable "static_web_app_custom_domain" {
    description = "The custom domain for the Static Web App."
    type        = string
    default     = "loganfarci.com"
}