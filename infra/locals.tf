locals {
  resource_group_name          = "${var.workload_name}-rg"
  static_web_app_name          = "${var.workload_name}-stapp"
  log_analytics_workspace_name = "${var.workload_name}-log"
  application_insights_name    = "${var.workload_name}-appi"
  subdomain                    = "www"
}