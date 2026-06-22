# Synthetic fixture — Terraform with encryption + identity. Not real.
# Exercises: Terraform (path) + encryption-at-rest + MFA/SSO evidence.
resource "aws_s3_bucket" "data" {
  bucket = "example-data"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_key_id        = aws_kms_key.data.arn
    }
  }
}

# Identity provider with MFA enforced via an OIDC/SSO integration.
resource "aws_iam_account_password_policy" "strict" {
  minimum_password_length = 14
}
