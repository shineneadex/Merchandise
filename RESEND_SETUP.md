# Resend setup — Expression Music merchandise

The storefront already calls `/api/place-order` at checkout. That Vercel serverless function uses the Resend REST API to send:
- an order notification to `hello@theexpressionmusic.com`, with the proof-of-payment file attached; and
- an order-received email to the customer.

The customer email explicitly says payment is awaiting verification; it does not claim that the bank transfer has cleared.

## 1. Verify a sending domain in Resend

1. Sign in at https://resend.com/domains.
2. Add `theexpressionmusic.com` (or a sending subdomain you control).
3. Copy the DNS records Resend shows into the DNS manager for that domain, exactly as provided.
4. Wait for Resend to mark the domain as verified.

DNS records are specific to your Resend account. Do not guess them or copy records from another domain/account.

## 2. Create a sending API key

1. Open https://resend.com/api-keys.
2. Create an API key with **Sending access**, restricted to the verified domain if available.
3. Copy it once and keep it private. Do not commit it to GitHub or paste it into chat.

## 3. Add environment variables in Vercel

In Vercel, open the merchandise project, then **Settings → Environment Variables**. Add both variables for **Production**, and also for **Preview** if you want preview deployments to send emails:

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | The private API key created in Resend |
| `ORDER_FROM_EMAIL` | `The Expression Music <hello@theexpressionmusic.com>` |

The sender address must belong to a domain verified in Resend. If you verify a sending subdomain instead, use an address on that subdomain.

Save the variables, then redeploy the project so the function receives them.

## 4. Test before accepting orders

Place a low-risk test order using your own email address and a harmless test proof image/PDF. Confirm:
- the team notification arrives at `hello@theexpressionmusic.com` with the attachment;
- the customer receives the order-received email;
- the email wording makes clear that payment is still awaiting manual verification.

If sending fails, open Resend's Emails/Logs page and check the error, and inspect the Vercel function logs for `/api/place-order`.

## Security notes

- Never expose `RESEND_API_KEY` in frontend code or a `VITE_*` variable.
- Do not mark orders as paid based only on the uploaded proof. Verify the transfer in the bank account first.
- Uploaded proof is sent as an email attachment; keep access to the receiving mailbox restricted.
