# Authentication Troubleshooting

## Password reset not arriving

1. Check the spam/junk folder.
2. Confirm the email address matches the one on the account (typos are common).
3. Reset emails can take up to 5 minutes. Ask the user to wait and retry once.
4. If still not arriving, the account may be using SSO — check if their organization uses single sign-on.

## MFA not working

1. Verify the user's device clock is accurate — TOTP codes are time-sensitive.
2. If using an authenticator app, have them remove and re-add the account.
3. If locked out entirely, they can use a backup recovery code (provided at MFA setup).
4. If no recovery codes are available, escalate to support@acmecloud.example.com with the user's account ID for manual identity verification.

## SSO login failing

1. Confirm the user is accessing the correct SSO login URL for their organization.
2. Check if the organization's identity provider (IdP) is experiencing an outage.
3. Try an incognito/private browser window to rule out cached session issues.
4. If the error mentions "SAML response invalid," the organization's IT admin needs to check the IdP certificate and assertion consumer URL.
