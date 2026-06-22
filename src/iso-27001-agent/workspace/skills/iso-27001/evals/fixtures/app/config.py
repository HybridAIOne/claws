# Synthetic fixture — config with one risk and one safe pattern. Not real.
# Exercises: hardcoded-secret RISK (the literal) vs skipIf (the env line).

# RISK: a secret hardcoded as a literal (synthetic value) — should be flagged.
DB_PASSWORD = "fixture-not-a-real-secret-123"

# SAFE: pulled from the environment — should be skipped by skipIf.
API_KEY = os.environ.get("API_KEY")
