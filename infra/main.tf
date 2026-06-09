resource "azurerm_resource_group" "this" {
  name     = local.resource_group_name
  location = var.location
}

resource "azurerm_static_web_app" "this" {
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_tier            = var.static_web_app_sku_tier
}

resource "azurerm_dns_zone" "this" {
  name                = var.static_web_app_custom_domain
  resource_group_name = azurerm_resource_group.this.name
}

resource "azurerm_log_analytics_workspace" "this" {
  name                = local.log_analytics_workspace_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "this" {
  name                 = local.application_insights_name
  resource_group_name  = azurerm_resource_group.this.name
  location             = azurerm_resource_group.this.location
  workspace_id         = azurerm_log_analytics_workspace.this.id
  application_type     = "web"
  daily_data_cap_in_gb = var.application_insights_daily_cap_gb
}

resource "azurerm_consumption_budget_resource_group" "this" {
  count             = length(var.budget_alert_emails) > 0 ? 1 : 0
  name              = "${var.workload_name}-budget"
  resource_group_id = azurerm_resource_group.this.id

  amount     = var.monthly_budget_amount_eur
  time_grain = "Monthly"

  time_period {
    # Azure requires a start date on the first of a month, not in the past.
    # Pinning to a fixed past month is fine; Azure rolls the budget forward
    # monthly based on time_grain.
    start_date = "2026-01-01T00:00:00Z"
  }

  notification {
    enabled        = true
    threshold      = 80
    operator       = "GreaterThan"
    threshold_type = "Actual"
    contact_emails = var.budget_alert_emails
  }

  notification {
    enabled        = true
    threshold      = 100
    operator       = "GreaterThan"
    threshold_type = "Forecasted"
    contact_emails = var.budget_alert_emails
  }
}