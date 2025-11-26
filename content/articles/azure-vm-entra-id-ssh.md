---
title: "Entra ID SSH Authentication for Azure Linux VMs"
description: "Configure passwordless SSH access to Azure Linux VMs using Entra ID accounts and RBAC, eliminating manual SSH key management."
publishedAt: "2025-11-25"
featured: false
tags: ["Terraform", "GitHub Actions", "Azure"]
author: "Logan Farci"
coauthoredWithAgent: true
---

When managing Azure infrastructure at scale, SSH key management becomes a bottleneck: creating local accounts on each VM, distributing keys securely, and rotating credentials. **Entra ID SSH authentication** eliminates this entirely by using Entra ID accounts (users or service principals) for VM access instead of SSH keys.

With Entra ID SSH, you control access through Azure RBAC rather than managing cryptographic keys. This works for both interactive user access and automation scenarios where service principals need unattended access.

## Why Entra ID SSH?

- **Passwordless access** for both users and service principals
- **Centralized access control** via Azure RBAC
- **No SSH key distribution or rotation** required
- **Audit-friendly** with full Azure logging
- **Works for both interactive and automation** scenarios

## How It Works

Entra ID SSH uses the `AADSSHLoginForLinux` VM extension to integrate VMs with Entra ID. When authenticating:

1. An Entra ID account (user or service principal) requests an SSH certificate
2. Azure validates the account's identity and RBAC permissions
3. An ephemeral SSH certificate is issued
4. The certificate grants access to the VM

This certificate-based approach means no SSH keys need to be pre-staged or distributed.

## Setup Overview

Setting up Entra ID SSH requires three core components:

1. **Entra ID account** (user or service principal) with appropriate Azure permissions
2. **AADSSHLoginForLinux extension** installed on the VM
3. **RBAC role assignments** granting SSH access

For a **complete Terraform implementation**, see the [`lfarci/azssh-demo`](https://github.com/lfarci/azssh-demo) repository, which includes all infrastructure code and bash scripts to automate the setup.

## Prerequisites

Before starting:

- Azure CLI installed and authenticated (`az login`)
- An Azure subscription with permissions to create VMs and role assignments
- A Linux VM (Ubuntu 22.04 LTS recommended) or willingness to deploy one

## Setting Up Authentication

**For Users:** Simply use your existing Entra ID account. No setup required.

**For Service Principals:** Create one for unattended automation:

```bash
az ad sp create-for-rbac --name "azssh-automation" --skip-assignment
```

Capture the output, which includes `appId` (client ID) and `tenant-id`. Store these securely for later use.

## Installing the Extension

On your Linux VM, install the Entra ID SSH extension:

```bash
az vm extension set \
  --resource-group <resource-group> \
  --vm-name <vm-name> \
  --publisher Microsoft.Azure.ActiveDirectory \
  --name AADSSHLoginForLinux \
  --version 1.0
```

The VM must have a **system-assigned managed identity** enabled:

```bash
az vm identity assign \
  --resource-group <resource-group> \
  --name <vm-name>
```

## Configuring RBAC Access

Grant SSH access via RBAC to a user or service principal:

```bash
az role assignment create \
  --role "Virtual Machine Administrator Login" \
  --assignee-object-id <user-or-sp-object-id> \
  --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group>
```

Use `Virtual Machine User Login` for non-administrator access instead.

## Connecting to the VM

**As a User:**

```bash
az login
az ssh vm -g <resource-group> -n <vm-name>
```

**As a Service Principal:**

```bash
az login --service-principal \
  -u <client-id> \
  -p <client-secret> \
  --tenant <tenant-id>

az ssh vm -g <resource-group> -n <vm-name>
```

The `az ssh vm` command generates an ephemeral SSH certificate and handles authentication automatically. No SSH key files needed.

## Automation Use Cases

Entra ID SSH is ideal for automation. Whether using a service principal or automation-capable user account:

- **SSH into multiple VMs** without managing keys
- **Run provisioning scripts** on newly deployed VMs
- **Execute infrastructure automation** via Ansible or other tools
- **Perform maintenance tasks** without key distribution

The key advantage: RBAC controls access, not cryptographic keys. When an account should no longer access VMs, simply remove its RBAC assignment.

## Resources

- [`lfarci/azssh-demo`](https://github.com/lfarci/azssh-demo)
- [Sign in to a Linux virtual machine in Azure by using Microsoft Entra ID and OpenSSH](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-linux)
- [Configuring OpenID Connect in Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure)
- [Enabling Entra ID Authentication on Linux Virtual Machines](https://www.marktinderholt.com/terraform/2025/04/04/entra-auth-azure-vm.html) - Mark Tinderholt (Terraform-focused guide)
- [Logging into an Azure Linux VM using an Azure AD account](https://www.jorgebernhardt.com/vm-sign-in-azure-ad-linux/) - Jorge Bernhardt (PowerShell and Azure CLI approaches)
