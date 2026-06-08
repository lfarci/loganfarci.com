#!/usr/bin/env bash
set -euo pipefail

require_value() {
  local name="$1"
  local value="$2"

  if [[ -z "$value" ]]; then
    echo "::error::$name input is required."
    exit 1
  fi
}

require_value "github-token" "${GH_TOKEN:-}"
require_value "repository" "${REPOSITORY:-}"
require_value "issue-number" "${ISSUE_NUMBER:-}"
require_value "commit-sha" "${COMMIT_SHA:-}"
require_value "comment-marker" "${COMMENT_MARKER:-}"

if [[ -z "${PREVIEW_URL:-}" ]]; then
  echo "::error::Azure Static Web Apps did not return a preview URL."
  exit 1
fi

if [[ "$PREVIEW_URL" == http://* || "$PREVIEW_URL" == https://* ]]; then
  normalized_preview_url="$PREVIEW_URL"
else
  normalized_preview_url="https://$PREVIEW_URL"
fi

body="$(printf '%s\n### Azure Static Web Apps preview\n\nPreview URL: %s\n\nUpdated for commit %s.' \
  "$COMMENT_MARKER" \
  "$normalized_preview_url" \
  "$COMMIT_SHA")"

existing_comment_id="$(
  gh api --paginate --slurp "repos/$REPOSITORY/issues/$ISSUE_NUMBER/comments" |
    jq -r --arg marker "$COMMENT_MARKER" \
      '[.[][] | select(.user.type == "Bot" and (.body | contains($marker))) | .id][0] // empty'
)"

if [[ -n "$existing_comment_id" ]]; then
  gh api \
    --method PATCH \
    "repos/$REPOSITORY/issues/comments/$existing_comment_id" \
    -f body="$body" \
    >/dev/null
else
  gh api \
    --method POST \
    "repos/$REPOSITORY/issues/$ISSUE_NUMBER/comments" \
    -f body="$body" \
    >/dev/null
fi
