# Wellbeing Admin Pages Status – 2025-11-17

## Summary
- **Issue:** `/admin/question_well_beings` returned HTTP 500 because Ransack 4 requires `ransackable_associations` to be allowlisted. The filter sidebar tried to build `category` and `answer_well_beings` filters and crashed.
- **Fix:** Added `self.ransackable_associations` to `QuestionWellBeing`, allowlisting the needed associations. `/admin/user_answer_results` already worked after adding attributes to `ransackable_attributes` earlier.
- **Deployment:** Built and deployed `niyaacr1758276383.azurecr.io/niya-admin:wellbeing-fixes-v12` (revision `niya-admin-app-india--0000126`). Container healthy and running with `RAILS_LOG_TO_STDOUT=true`, `RAILS_LOG_LEVEL=debug` for easier troubleshooting.

## Verification Checklist
1. Visit `/admin/question_well_beings` – page should render without 500.
2. Create/update a sample Question Well Being record (category + answers) and confirm it appears in the index.
3. Visit `/admin/user_answer_results`, create/update a record, and confirm filters/listing still work.
4. After entering a few questions/answers, ensure the user-facing flows pull the expected data (manual API test or mobile app check).

## Logs
- Rails logs now include detailed stack traces (via controller `rescue_from`) and are streamed to stdout for Azure Container Apps (`RAILS_LOG_TO_STDOUT=true`, `RAILS_LOG_LEVEL=debug`). Use:
  ```powershell
  az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --follow false --tail 300
  ```
  Run with `--follow true` while reproducing an issue to capture live errors.

## Next Manual Steps
1. **Data entry:** Add/update the new wellbeing questions and answers through ActiveAdmin.
2. **End-to-end test:** Run the wellbeing questionnaire in QA or staging mobile app to be sure answers flow correctly.
3. **Monitoring:** Keep log stream open during testing; capture any new errors.
4. **Cleanup:** Once verified, consider lowering log level back to `info` to reduce noise.

## Files Touched in this iteration
- `app/models/question_well_being.rb` – added `ransackable_associations` allowlist.
- `app/admin/question_well_beings.rb`, `app/admin/user_answer_results.rb` – logging + error handling (previous iteration, now deployed as part of v12).

## Image Reference
- Registry: `niyaacr1758276383.azurecr.io`
- Tag: `niya-admin:wellbeing-fixes-v12`
- Revision: `niya-admin-app-india--0000126`

