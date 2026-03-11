# Sync Troubleshooting

## Data not updating

1. Check the sync status page at Settings > Integrations > Sync Status.
2. If the last sync timestamp is recent, the issue may be a display cache — ask the user to hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).
3. If the last sync is stale (more than 1 hour old), ask the user to click "Sync Now" to trigger a manual sync.

## Partial sync (some records missing)

1. Check if the missing records were created after the last sync ran.
2. Verify the sync filter isn't excluding them — Settings > Integrations > Sync Filters.
3. Records with validation errors are skipped. Check Settings > Integrations > Sync Errors for details.

## Sync stuck in progress

1. If a sync has been running for more than 30 minutes, it may be stuck.
2. Ask the user to cancel the sync (Settings > Integrations > Cancel Sync) and trigger a new one.
3. If it gets stuck again, recommend contacting support@acmecloud.example.com — this may indicate a data issue that needs investigation.
