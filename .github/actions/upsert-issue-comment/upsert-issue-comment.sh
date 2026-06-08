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
require_value "body" "${COMMENT_BODY:-}"
require_value "comment-marker" "${COMMENT_MARKER:-}"

if [[ "$COMMENT_BODY" == *"$COMMENT_MARKER"* ]]; then
  rendered_comment_body="$COMMENT_BODY"
else
  rendered_comment_body="$(printf '%s\n%s' "$COMMENT_MARKER" "$COMMENT_BODY")"
fi

existing_comment_id="$(
  gh api --paginate --slurp "repos/$REPOSITORY/issues/$ISSUE_NUMBER/comments" |
    jq -r --arg marker "$COMMENT_MARKER" \
      '[.[][] | select(.body | contains($marker)) | .id][0] // empty'
)"

if [[ -n "$existing_comment_id" ]]; then
  gh api \
    --method PATCH \
    "repos/$REPOSITORY/issues/comments/$existing_comment_id" \
    -f body="$rendered_comment_body" \
    >/dev/null
else
  gh api \
    --method POST \
    "repos/$REPOSITORY/issues/$ISSUE_NUMBER/comments" \
    -f body="$rendered_comment_body" \
    >/dev/null
fi
