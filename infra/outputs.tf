output "resource_group_name" {
  description = "The name of the resource group."
  value       = azurerm_resource_group.this.name
}

output "static_web_app_name" {
  description = "The name of the static web app."
  value       = azurerm_static_web_app.this.name
}

output "static_web_app_host_name" {
  description = "The URL of the static web app."
  value       = azurerm_static_web_app.this.default_host_name
}

output "dns_zone_name" {
  description = "The name of the DNS zone."
  value       = azurerm_dns_zone.this.name
}

output "dns_zone_name_servers" {
  description = "The name servers for the DNS zone."
  value       = azurerm_dns_zone.this.name_servers
}