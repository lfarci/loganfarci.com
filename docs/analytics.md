# Analytics

The site uses **Azure Application Insights** in cookieless mode to track basic
activity (page views, sessions, referrers, geography, devices). No cookies are
set, so no consent banner is required under GDPR.

## How it works

- The instrumentation resource is provisioned by Terraform in `infra/`
  (`azurerm_application_insights`, workspace-based, with a daily ingestion cap
  via `application_insights_daily_cap_gb` to stay safely within the free tier).
- Its connection string is exposed as a Terraform output and written to Azure
  Key Vault by `.github/workflows/azure-resources.yml` as
  `ApplicationInsightsConnectionString`.
- The SWA deploy workflow reads the secret from Key Vault and injects it at
  build time as `VITE_APPINSIGHTS_CONNECTION_STRING`.
- The client SDK is initialized in `src/src/core/appInsights.ts` via the
  `<Analytics />` component mounted in `App.tsx`. Initialization is gated on
  `import.meta.env.PROD` and the presence of the connection string, so dev
  builds never send telemetry.

## Disabling analytics

Leave `VITE_APPINSIGHTS_CONNECTION_STRING` unset (the default in local dev),
or delete the `ApplicationInsightsConnectionString` Key Vault secret to stop
production telemetry on the next deploy.

## Viewing the dashboard

*Azure Portal &rarr; Application Insights &rarr; Usage*.

## Cost safety

Two guardrails protect against unexpected Azure spend:

- **Application Insights daily cap** (`application_insights_daily_cap_gb`,
  default `0.1` GB/day) hard-stops ingestion once the cap is hit, well under
  the 5 GB/month free tier.
- **Resource group budget alert** (`azurerm_consumption_budget_resource_group`)
  emails the addresses in `budget_alert_emails` when actual spend crosses 80%
  or when forecasted spend crosses 100% of `monthly_budget_amount_eur` (default
  5 EUR). The resource is created only when `budget_alert_emails` is non-empty,
  so it defaults to disabled. To enable it, provide a comma-separated list in
  the `budget_alert_emails` input when running the `Manage Azure Resources`
  workflow manually (e.g. `you@example.com,ops@example.com`).
