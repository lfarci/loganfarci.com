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

resource "azurerm_dns_cname_record" "this" {
  name                = local.subdomain
  zone_name           = azurerm_dns_zone.this.name
  resource_group_name = azurerm_resource_group.this.name
  ttl                 = 3600
  record              = azurerm_static_web_app.this.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "this" {
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "${local.subdomain}.${var.static_web_app_custom_domain}"
  validation_type = "cname-delegation"

  depends_on = [azurerm_dns_cname_record.this]
}