output "static_web_host_name" {
  description = "The URL of the static web app."
  value = azurerm_static_web_app.this.default_host_name
}