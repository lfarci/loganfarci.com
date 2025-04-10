#!/bin/bash

###############################################################################
#                                 Constants                                   #
###############################################################################

MAX_RETRIES=5
RETRY_DELAY=30

###############################################################################
#                                 Functions                                   #
###############################################################################

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

create_cname_record() {
    log "Creating CNAME record for $STATIC_WEB_APP_CUSTOM_DOMAIN pointing to $STATIC_WEB_APP_HOST_NAME."
    az network dns record-set cname set-record --resource-group "$RESOURCE_GROUP" --zone-name "$DNS_ZONE" --record-set-name "$DNS_CNAME_RECORD_NAME" --cname "$STATIC_WEB_APP_HOST_NAME"
}

link_STATIC_WEB_APP_CUSTOM_DOMAIN() {
    log "Linking custom domain $STATIC_WEB_APP_CUSTOM_DOMAIN to static web app $STATIC_WEB_APP_NAME."
    az staticwebapp hostname set --name "$STATIC_WEB_APP_NAME" --hostname "$STATIC_WEB_APP_CUSTOM_DOMAIN"
}

retry() {
    local n=0
    until [ $n -ge $MAX_RETRIES ]; do
        "$@" && return 0
        n=$((n + 1))
        log "Attempt $n failed. Retrying in $RETRY_DELAY seconds..."
        sleep $RETRY_DELAY
    done
    log "Command failed after $MAX_RETRIES attempts."
    return 1
}

###############################################################################
#                                    Main                                     #
###############################################################################

log "Starting custom domain setup."

retry create_cname_record
if [ $? -ne 0 ]; then
    log "Failed to create CNAME record. Exiting."
    exit 1
fi

log "Waiting for DNS propagation (optional). Sleeping for $RETRY_DELAY seconds."
sleep $RETRY_DELAY

retry link_STATIC_WEB_APP_CUSTOM_DOMAIN
if [ $? -ne 0 ]; then
    log "Failed to link custom domain. Exiting."
    exit 1
fi

log "Custom domain setup completed successfully."