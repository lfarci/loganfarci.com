---
title: "Setting Up Azure VMs with Entra ID SSH Authentication"
description: "Automate Azure VM deployment with passwordless SSH authentication using Entra ID, Terraform, and GitHub Actions OIDC."
publishedAt: "2025-11-25"
featured: true
tags: ["Azure", "SSH", "Entra ID", "Terraform", "GitHub Actions"]
author: "Logan Farci"
coauthoredWithAgent: true
---

Setting up Azure VMs with Entra ID SSH authentication enables passwordless, centrally managed access to your cloud infrastructure. This approach eliminates SSH key sprawl and integrates seamlessly with your organization's identity management. This article walks through the automated setup process using the [azssh-demo](https://github.com/lfarci/azssh-demo) repository.

## Why Entra ID SSH?

Traditional SSH authentication relies on manually managing public/private key pairs across teams and VMs. Entra ID SSH authentication offers:

- **Passwordless access** using your Azure credentials
- **Centralized identity management** through Entra ID
- **RBAC integration** for granular access control
- **No manual key distribution** or rotation

## Prerequisites

Before starting, ensure you have:

- Azure CLI installed and authenticated (`az login`)
- GitHub CLI installed and authenticated (`gh auth login`)
- An Azure subscription with appropriate permissions
- A GitHub repository to deploy from

## The Setup Process

The azssh-demo repository provides automated bash scripts that handle the entire setup. Run them sequentially from the `scripts/` directory.

### 1. Setup Service Principal with OIDC

```bash
./00-setup-service-principal.sh
```

This script creates an Entra ID service principal configured for GitHub Actions OIDC authentication. It automatically:

- Creates the Entra ID application and service principal
- Configures federated credentials for GitHub OIDC
- Assigns Contributor and User Access Administrator roles
- Sets GitHub repository secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`)

The script prompts for the service principal name and federation subject (branch, PR, environment, or tag). OIDC federation eliminates the need for storing long-lived credentials in GitHub.

### 2. Deploy Terraform State Storage

```bash
./01-deploy-storage.sh
```

Terraform requires remote state storage for team collaboration. This script triggers a GitHub Actions workflow that provisions:

- A resource group for Terraform state
- An Azure Storage Account
- A blob container for state files
- Optional RBAC assignments for admin users

The storage account is deployed with your chosen replication type (LRS, GRS, etc.).

### 3. Configure Terraform Backend Secrets

```bash
./02-configure-terraform-secrets.sh
```

This script configures GitHub repository secrets for the Terraform backend:

- `TF_BACKEND_RESOURCE_GROUP_NAME`
- `TF_BACKEND_STORAGE_ACCOUNT_NAME`
- `TF_BACKEND_CONTAINER_NAME`

These secrets allow GitHub Actions workflows to initialize Terraform with the remote state backend.

### 4. Deploy the VM Infrastructure

```bash
./03-deploy-virtual-machine.sh
```

The final deployment script triggers a GitHub Actions workflow that provisions:

- Resource group
- Virtual network and subnet
- Network security group (SSH on port 22)
- Ubuntu 22.04 LTS VM with public IP
- **AADSSHLoginForLinux extension** (enables Entra ID SSH)
- Azure Key Vault for SSH private key storage
- RBAC role assignments for VM access

The Terraform configuration deploys both public and private VMs, demonstrating different network configurations.

## Connecting to Your VM

Once deployed, connect using the Azure CLI:

```bash
az ssh vm -g <resource-group-name> -n <vm-name>
```

The `az ssh vm` command handles the authentication flow using your Azure credentials. No SSH key file needed.

Resource names follow the pattern: `rg-{workload-name}` and `vm-{workload-name}-runner-{location-code}`.

## Key Implementation Details

### The AADSSHLoginForLinux Extension

The Terraform configuration installs the Azure AD SSH extension on the VM:

```hcl
resource "azurerm_virtual_machine_extension" "aad_ssh" {
  name                 = "AADSSHLoginForLinux"
  virtual_machine_id   = azurerm_linux_virtual_machine.vm.id
  publisher            = "Microsoft.Azure.ActiveDirectory"
  type                 = "AADSSHLoginForLinux"
  type_handler_version = "1.0"
}
```

This extension integrates the VM with Entra ID, allowing Azure RBAC to control SSH access.

### RBAC Role Assignments

Access is controlled through Azure RBAC roles:

- **Virtual Machine Administrator Login**: Full sudo access
- **Virtual Machine User Login**: Standard user access

The Terraform configuration assigns these roles to specified admin users.

### GitHub Actions OIDC Flow

The GitHub Actions workflow authenticates to Azure using OIDC:

```yaml
- uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

No secrets are stored beyond the identity metadata needed for OIDC federation.

## Using the VM as a GitHub Runner

The deployed VM can serve as a self-hosted GitHub Actions runner:

1. SSH into the VM: `az ssh vm -g <rg-name> -n <vm-name>`
2. Navigate to your repository Settings → Actions → Runners → New self-hosted runner
3. Follow the provided commands to install and configure the runner
4. Use the runner in workflows with `runs-on: self-hosted`

The repository includes a script to trigger SSH workflows that run on the self-hosted runner:

```bash
./08-trigger-ssh-workflow.sh
```

## Cleanup

Delete resources in reverse order:

```bash
./04-delete-virtual-machine.sh
./05-delete-storage.sh
./06-delete-service-principal.sh
```

Each script prompts for confirmation before deleting resources.

## Resources

- [azssh-demo Repository](https://github.com/lfarci/azssh-demo)
- [Azure AD SSH Documentation](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-linux)
- [GitHub Actions OIDC with Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure)
