# Firestore security rollout

## Prerequisites

- Node.js 22.18 or later in the Node 22 series, pnpm 10, and Java 21 or later on PATH for the emulator.
- Run `pnpm install --frozen-lockfile`.
- The production Telegram authentication endpoint must work, and its Firebase project must match the client project. Confirm an actual Telegram launch signs in with a Firebase UID matching the Telegram user ID.
- Save the currently published Firestore rules from Firebase Console before deploying. CLI deployment replaces the published rules, including Console edits.

## 1. Read-only production audit

```sh
pnpm audit:memberships --project-id=watchlist-1f961
```

The script reads `users` and `watchlists` in a read-only transaction. It never changes data. It loads `.env.local`, then `.env`, preserving existing shell variables. It uses `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`, or Application Default Credentials. The explicit project argument must match the configured project. Production reads may incur Firestore read charges.

Exit codes: 0 = no issues, 1 = inconsistencies found, 2 = runtime failure. Configuration errors also fail before contacting Firestore. Counts are printed by default. Add `--details` to print document paths for local investigation; these identify users and must not be committed or shared publicly.

Review these issues before deployment:

- `numeric_user_id`: a positive numeric ID matches its document ID but needs conversion to a string. Use the backed-up normalization workflow below after fixing the writer.
- `invalid_user_id` / `invalid_member_id`: malformed or mismatched IDs; investigate rather than guessing.
- `missing_watchlist`: a user references a document that does not exist. Decide whether to restore the list from a backup or remove the stale reference.
- `reference_without_membership`: a user references a list whose `userIds` does not include them. Do not automatically add membership: that grants access. Determine intended ownership first.
- `membership_without_reference`: an existing member lacks the reverse reference. Membership is authoritative for access in the new client; review the discrepancy before repair.
- Missing users, malformed arrays, duplicates, or legacy `usersIds`: inspect and reconcile separately.

Any repairs need a reviewed plan and a data backup. Rerun the audit afterward. An audit passing is not evidence that historically permissive rules were never abused; confirm intended ownership for suspicious records.

### Audit checkpoint: 2026-11-07

Project `watchlist-1f961`: 180 user documents, 19 watchlists, 101 findings:

- 91 `numeric_user_id` findings (each number matches its document ID when converted to a string).
- 8 `missing_watchlist` references.
- 2 `reference_without_membership` relationships.

These are issue counts, not necessarily distinct affected-user counts. The initial audit made no changes.

### Authorized reference cleanup: 2026-11-07

Removed the 8 missing-list references and 2 non-member references from 4 users in one transaction. No watchlist documents, items, memberships, or user IDs were changed. The follow-up audit found 180 users, 19 watchlists, and only the 91 numeric user IDs remaining.

The private backup is `.firestore-backups/reference-repair-2026-11-07.json` (ignored by Git, file permissions 0600). It contains the exact before/after reference arrays and record versions. For recovery, review those original references against current data before restoring anything; do not overwrite subsequent user changes or automatically grant list membership.

The reusable cleanup workflow is:

```sh
# Generate a new private plan/backup; this does not write to Firestore.
pnpm repair:references --project-id=watchlist-1f961 --plan=.firestore-backups/NEW-PLAN.json
# Review the exact removals before applying. The transaction rejects stale/edited plans.
pnpm repair:references --project-id=watchlist-1f961 --plan=.firestore-backups/NEW-PLAN.json --apply
pnpm audit:memberships --project-id=watchlist-1f961
```

### Authorized ID normalization: 2026-11-07

The legacy writer was the bot backend. Its updated Admin implementation writes canonical string IDs and was deployed and confirmed working before this migration. The Mini App authentication endpoint already writes string IDs.

Converted the remaining 91 numeric `userId` fields to matching strings in one transaction. Document IDs, watchlist references, memberships, and list items were unchanged. The follow-up read-only audit found 180 users, 19 watchlists, and **zero issues**.

The private backup is `.firestore-backups/numeric-user-ids-2026-11-07.json` (ignored by Git, permissions 0600). It records the exact before/after values and document versions. Previously published rules were separately saved to `.firestore-backups/published-rules-2026-11-07.json`; saving them does not publish new rules.

The reusable normalization workflow is:

```sh
# Generate a new private plan/backup without writing to Firestore.
pnpm normalize:user-ids --project-id=watchlist-1f961 --plan=.firestore-backups/NEW-ID-PLAN.json
# Review the plan. Only safe numeric IDs matching their document IDs are eligible.
pnpm normalize:user-ids --project-id=watchlist-1f961 --plan=.firestore-backups/NEW-ID-PLAN.json --apply
pnpm audit:memberships --project-id=watchlist-1f961
```

The transaction rejects stale or edited plans and updates only `userId`. Never restore a whole user document over subsequent changes. Client rules cannot constrain a backend using Firebase Admin, so keep all writers consistent. A fresh pre-deployment audit is still required.

## 2. Local verification

```sh
pnpm test:audit
pnpm test:repairs
pnpm test:normalization
pnpm test:rules
pnpm typecheck
pnpm lint
```

`test:rules` starts the Firestore emulator on `127.0.0.1:8080` with project `demo-watchlist-rules`. Tests refuse to run without that emulator address. They clear only the demo database, simulate authenticated/unauthenticated clients, and exercise the same creation and retrieval functions used by the app. No production credentials or Firebase login are needed. The first run downloads the emulator.

## 3. Deploy the application first

The new client queries `watchlists` using `userIds array-contains <authenticated UID>` instead of trusting `users.watchlists`. This matches the membership read rule, works for users with no lists, and avoids the document-ID `in` query limit. Query cache keys include the authenticated UID.

Creation now atomically creates the list and appends its ID to the user's `watchlists`. Rules enforce both sides of that batch with `getAfter`. Old clients using two separate writes will be rejected after rules deployment. Deploy the application first and reopen the Telegram Mini App before checking creation.

The unused client user-creation hook is removed. `/api/auth/telegram` provisions missing users with Firebase Admin; Admin bypasses client rules and remains responsible for validating Telegram credentials.

## 4. Deploy rules after review

Do this only after the audit discrepancies are resolved, emulator tests pass, the updated app is live, and the previous rules have been saved:

```sh
pnpm exec firebase login
pnpm exec firebase deploy --only firestore:rules --project watchlist-1f961
```

No default production project or automatic deployment is configured. Merging the branch does not deploy rules. This command changes access policy, not stored documents.

### Production rollout checkpoint: 2026-11-07

- Application commit `ec1a729` was built with the production target and deployed to `watchlist-mini-app.vercel.app` as Vercel deployment `dpl_BshH7z4xWg7HZrzccrEScbMhL4A4`. This deployed the feature branch without merging `main`; merge the branch before subsequent production releases so the compatible client changes are retained.
- Both `/` and `/explore` returned HTTP 200, and `/api/auth/telegram` rejected invalid initialization data with HTTP 401. These smoke checks do not substitute for an authenticated Telegram session.
- A fresh production audit returned 180 users, 19 watchlists, and zero findings immediately before release.
- Published ruleset `86ca90f1-a10b-4102-8d02-495fc3dbe421` at 17:53 UTC using the Firebase Admin Security Rules API and the existing service-account credentials. The release was guarded by checking the previous rules against the private backup, then read back and verified byte-for-byte against `firestore.rules`.
- Anonymous reads of `users`, `watchlists`, and `watchlistInvites` each returned HTTP 403 with `PERMISSION_DENIED` after release.
- Local verification passed all 27 tests, TypeScript checks, and the production build. Lint has no errors and three pre-existing warnings.

Do not roll back to the old application without considering its incompatible two-write list creation flow. Test the full private/shared-list workflow through Telegram after reopening the Mini App.

## 5. Verify in Telegram

Use two accounts and verify private and shared lists load correctly, new list creation works, and members can add/remove/mark items. Emulator tests additionally verify that strangers cannot read a list, mutate membership, create another user's profile, or write unknown collections.

If a legitimate operation fails, capture the failed operation and permission error. Restore a previously reviewed rules file and redeploy it when necessary. Do not blindly restore permissive rules or disable authentication. Keep the prior rules and a known-good application version available before rollout.

## Policy and current limits

- Only a user can read their own user document; clients cannot enumerate, create, or delete profiles.
- The only profile mutation allowed is appending one unique reference alongside creation of a new list owned by that user. Existing references and other profile fields are preserved.
- New lists require only `name`, `userIds`, and `items`, a name of 1–100 characters, `[request.auth.uid]` membership, and empty items.
- Existing members can read lists and update only `items`. Clients cannot rename, delete, or change membership. Sharing is handled by the bot's validated Admin invitation workflow; `watchlistInvites` remains inaccessible to clients.
- All other client operations are denied, including subcollections.
- `items` must be an array, but rules do not validate every nested media object. A member can still submit malformed item data to their own/shared lists. Strong per-item schema validation requires a validated server write path or item subcollections; this checkpoint primarily enforces access boundaries. Firestore's document-size limit still applies.

References: [rules deployment](https://firebase.google.com/docs/rules/manage-deploy), [query rules](https://firebase.google.com/docs/firestore/security/rules-query), [atomic write validation](https://firebase.google.com/docs/firestore/security/rules-conditions), [emulator tests](https://firebase.google.com/docs/firestore/security/test-rules-emulator).
