# Diglo Supabase setup

This app uses your Supabase project directly. It does **not** replace it with
Replit's database. Never enter a Supabase service-role key in a `VITE_` variable:
Vite variables are visible to visitors.

## Required connection

1. In this project's Secrets, set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` using your Supabase project URL and its public
   anon/publishable key.
2. Run `supabase/setup.sql` in that Supabase project's SQL Editor. It creates
   the tables, restricted submission/tracking functions and row-level policies.
   If you already have tables of those names, compare the schema before running;
   `CREATE TABLE IF NOT EXISTS` does not migrate existing columns.
3. Create the staff account in Supabase Auth. Assign **app metadata** `role: admin`
   using trusted Supabase administration (not user-editable user metadata).
   Sign out and back in after changing the role. There is no public admin signup.
4. Restart the web preview after changing environment variables.

## Non-secret business configuration

- `VITE_WHATSAPP_NUMBER`: full international number, e.g. country code followed by
  number, without a leading zero. No real business number has been supplied.
- `VITE_PREMIUM_PAPER_PER_ITEM`: premium paper surcharge per item, in UGX.
- `VITE_UPCOUNTRY_DELIVERY_UGX`: confirmed flat upcountry delivery charge in UGX.
- `VITE_SITE_URL`: approved public origin for canonical URLs and a complete sitemap.
  Leave unset in this preview-only project. Do not use a guessed public domain.

Without confirmed surcharges the calculator shows “to confirm”, not free delivery
or paper. The 10% quantity saving applies to the print/service base for quantities
of at least 500. Paper and delivery are added afterward.

## Data and permissions

- Public visitors can submit leads through an idempotent function. They cannot
  read the leads table, modify statuses or access admin data.
- Public tracking returns only reference, service, current stage and update time.
  Exact code or phone is required. Customer names, phones, messages and payment
  statuses are never returned by the public tracking function.
- Authenticated accounts without server-controlled `app_metadata.role=admin`
  have no table access.
- A lead is not an order. An administrator creates an order from a lead and
  explicitly advances its production stage. No fake orders are seeded.
- Failed submissions are stored on the visitor's device for a maximum of seven
  days, then retried on startup, reconnect, and manually. They are not labelled
  “sent” until Supabase confirms receipt. Browser data clearing loses this queue.
- Browser retry requires the page to be open. It is not a background server job.

## Live verification still required after connection

Create a test quote; confirm it appears in `diglo_leads` and the WhatsApp message
targets the correct business. Sign in as the authorised admin, create an order,
advance its stage, and look it up by reference and phone. Test a non-existent
reference. Verify an unauthorised authenticated account cannot read either table.

No deployment is configured or performed by these instructions.
