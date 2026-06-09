variable "subscription_id" {
  description = "The Azure subscription ID where resources will be deployed."
  type        = string
}

variable "workload_name" {
  description = "A non-empty string used to describe the workload running on the deployed infrastructure."
  type        = string
  default     = "loganfarci"
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

variable "application_insights_daily_cap_gb" {
  description = "Daily ingestion cap in GB for Application Insights. Keeps usage well under the 5 GB/month free tier."
  type        = number
  default     = 0.1
}