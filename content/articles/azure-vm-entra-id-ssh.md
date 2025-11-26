---
title: "Setup of Entra ID Authentication from a Self-Hosted Runner to a Linux VM"
description: "Automate Azure VM deployment with passwordless SSH authentication using Entra ID, Terraform, and GitHub Actions OIDC."
publishedAt: "2025-11-25"
featured: false
tags: ["Terraform", "GitHub Actions", "Azure"]
author: "Logan Farci"
coauthoredWithAgent: true
---

When deploying infrastructure at scale, you often need to automate VM provisioning and configuration. A common challenge arises when your GitHub Actions runner needs to SSH into newly provisioned VMs to set them up.

The traditional approach requires creating a dedicated automation user on each new VM, which means:

- Creating local accounts on every VM
- Configuring permissions for those accounts
- Generating and distributing SSH key pairs
- Securing private keys (Azure Key Vault, GitHub secrets, etc.)
- Managing key rotation

This manual user and key management quickly becomes untenable at scale.

## The Solution: Entra ID SSH with Service Principals

Rather than managing individual SSH keys for each automation user, you can leverage **Entra ID authentication for SSH**. This enables the GitHub Actions runner to authenticate to VMs using an Entra ID service principal, eliminating the need to pre-stage automation users.

Initially, the goal was to use the **managed identity assigned to the runner VM itself**. However, during implementation, it became clear that Entra ID SSH requires a **service principal** rather than a managed identity. While this adds an extra step, it unlocks powerful automation capabilities.

### Why Entra ID SSH?

- **Passwordless access** using Entra ID credentials
- **Centralized identity management** through Entra ID
- **RBAC integration** for granular access control
- **No manual key distribution** or rotation
- **Service principal automation** for unattended VM setup and configuration

### Automation Use Cases

Once Entra ID SSH is configured with a service principal, you can:

- **Configure freshly provisioned VMs** without pre-staging automation users
- **Run custom scripts** on remote VMs for post-deployment setup
- **Execute Ansible playbooks** from the runner for infrastructure automation
- **Perform maintenance tasks** without manual key management

This pattern is particularly valuable in CI/CD pipelines where runners need to quickly bootstrap new infrastructure with minimal pre-configuration.

## The Demo

This article walks through the automated setup process using the [lfarci/azssh-demo](https://github.com/lfarci/azssh-demo) repository. The demo provides a complete, working example of setting up Entra ID SSH authentication from a GitHub Actions runner to Azure VMs using Terraform and OIDC. The repository is not the cleanest codebase but it is definitely helpful for future reference.

## Prerequisites

Before starting, ensure you have:

- Azure CLI installed and authenticated (`az login`)
- GitHub CLI installed and authenticated (`gh auth login`)
- An Azure subscription with appropriate permissions
- A GitHub repository to deploy from

## The Setup Process

The `azssh-demo` repository provides automated bash scripts that handle the entire setup. Run them sequentially from the `scripts/` directory.

### 1. Setup Service Principal with OIDC

```bash
./00-setup-service-principal.sh
```

This script creates an Entra ID service principal configured for GitHub Actions OIDC authentication. It automatically:

- Creates the Entra ID application and service principal
- Configures federated credentials for GitHub OIDC
- Assigns Contributor and User Access Administrator roles
- Sets GitHub repository secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`)

The script prompts for the service principal name and federation subject (branch, PR, environment, or tag). OIDC federation eliminates the need for storing long-lived credentials in GitHub, while the service principal becomes the identity the runner uses to authenticate to VMs.

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

The deployed VM can serve as a self-hosted GitHub Actions runner. More importantly, the **service principal identity authenticated through the runner can SSH into other VMs** to perform automation tasks.

### Setting up the Runner

1. SSH into the VM: `az ssh vm -g <rg-name> -n <vm-name>`
2. Navigate to your repository Settings → Actions → Runners → New self-hosted runner
3. Follow the provided commands to install and configure the runner
4. Use the runner in workflows with `runs-on: self-hosted`

The repository includes a script to trigger SSH workflows that run on the self-hosted runner:

```bash
./08-trigger-ssh-workflow.sh
```

### Automating VM Setup from the Runner

Once the service principal is authenticated, you can use the runner to:

- **SSH to other VMs** using the service principal identity
- **Run provisioning scripts** on newly deployed VMs
- **Execute Ansible playbooks** for infrastructure automation
- **Perform configuration management** without pre-staging automation users

This pattern enables a fully automated infrastructure setup pipeline where the runner provisions new VMs and immediately configures them, all using Entra ID authentication managed through RBAC.

## Cleanup

Delete resources in reverse order:

```bash
./04-delete-virtual-machine.sh
./05-delete-storage.sh
./06-delete-service-principal.sh
```

Each script prompts for confirmation before deleting resources.

## Resources

- [`lfarci/azssh-demo`](https://github.com/lfarci/azssh-demo)
- [Sign in to a Linux virtual machine in Azure by using Microsoft Entra ID and OpenSSH](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-linux)
- [Configuring OpenID Connect in Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure)
