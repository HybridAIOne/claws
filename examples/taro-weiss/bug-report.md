# Bug Report

- Title: Form loses nested address state after validation retry
- Surface: `/settings/profile`
- Environment: production web app, Chrome 134
- Severity: high for enterprise admins during bulk setup
- Reported behavior: entering a street and postal code works initially, but after one invalid country code the nested address object resets.
- Expected behavior: invalid country input should keep the rest of the address intact.
- Repro hint: happens after the second submit attempt, not the first.
