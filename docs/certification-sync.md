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
`auto/synchronize-certifications-<run_id>` branch and creates a pull request against `main`.
Re-running the same workflow run keeps the same `run_id`, forces that branch back to the latest
`main`, regenerates the content, and updates the existing open pull request instead of opening a
duplicate for the rerun.

Review the pull request like any other content update. The automation does not merge it.

## Enabling or disabling the monthly schedule

The workflow includes a monthly cron trigger for 06:00 UTC on the first day of each month, but the
scheduled job is gated by the repository variable `CERTIFICATION_SYNC_SCHEDULE_ENABLED`.

- To enable scheduled runs after a successful manual validation, set the repository variable to
  `true`.
- To disable scheduled runs, delete the variable or set it to any value other than `true`.
- Manual runs continue to work while the scheduled job is disabled.

## Retrying failures

Open the failed workflow run, inspect the failing step, and re-run the job when the source outage or
rate limit has cleared. If the failure is caused by an unexpected generated path, inspect the sync
tool locally before retrying because the workflow intentionally refuses to commit out-of-scope files.
