# Certification synchronization automation

The certification synchronization workflow refreshes generated certification content from the
public profile sources in [`content/data/certification-sources.json`](../content/data/certification-sources.json).
It runs the same local command documented for manual refreshes:

```bash
cd src
npm run sync:certifications
```

The workflow never runs during normal application builds. It is limited to generated
certification output:

- `content/data/certifications.json`
- `src/public/images/certifications/*.avif`

If the sync command cannot read a source profile, is rate-limited, cannot read credential metadata,
or cannot download or convert a badge image, the workflow fails and does not create a pull request.
If the command succeeds but produces no generated changes, the workflow exits without committing or
opening a pull request.

## Running manually

1. Open **Actions** in GitHub.
2. Select **Sync Certifications**.
3. Choose **Run workflow** on `main`.
4. Inspect the run summary and logs.

Manual dispatches are always allowed. Use a manual run to validate the automation before enabling
monthly scheduled execution.

## Pull request behavior

When generated output changes, the workflow commits it to a run-scoped
`auto/synchronize-certifications-<run_id>` branch and creates a pull request against the repository
default branch.
Re-running the same workflow run keeps the same `run_id`, forces that branch back to the latest
default branch, regenerates the content, and updates the existing open pull request instead of
opening a duplicate for the rerun.

Review the pull request like any other content update. The automation does not merge it.

## Disabling or re-enabling the monthly schedule

The workflow runs monthly at 06:00 UTC on the first day of each month.

To pause the schedule, disable the **Sync Certifications** workflow from the Actions tab. Re-enable
the workflow from the same page when monthly synchronization should resume.

## Retrying failures

Open the failed workflow run, inspect the failing step, and re-run the job when the source outage or
rate limit has cleared. If the failure is caused by an unexpected generated path, inspect the sync
tool locally before retrying because the workflow intentionally refuses to commit out-of-scope files.
