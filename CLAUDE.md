# CLAUDE.md - Khangtsen

This file provides context for Claude (AI assistant) when working on this codebase.

> **IMPORTANT: You have direct database access!**
> Always run SQL migrations directly using `psql` - never ask the user to run SQL manually.
> psql path: `/opt/homebrew/opt/libpq/bin/psql`

> **IMPORTANT: Push changes immediately!**
> This is a GitHub Pages site - changes only go live after pushing.
> Always `git push` as soon as changes are ready.

## Project Overview

Khangtsen is a community/organization management platform. It manages members, contacts, events, documents, finances, and communications.

**Tech Stack:**
- Frontend: Vanilla HTML/CSS/JavaScript (no framework)
- Backend: Supabase (PostgreSQL + Storage + Auth)
- Hosting: GitHub Pages (static site)

## Supabase Details

- Project Ref: `axnongwefdafwflekysk`
- URL: `https://axnongwefdafwflekysk.supabase.co`
- Anon key is in `shared/supabase.js`

### Direct Database Access (for Claude)

```bash
/opt/homebrew/opt/libpq/bin/psql "postgresql://postgres.axnongwefdafwflekysk:canmUq-tuvvet-4ticza@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres" -c "SQL HERE"
```

### Database Schema

**Core tables** (all have RLS enabled, `updated_at` auto-trigger):
- `members` — community members (id, full_name, email, phone, photo_url, role, status, notes, metadata)
- `contacts` — external people: donors, partners, vendors (id, full_name, email, phone, organization, contact_type, status, notes, metadata)
- `events` — gatherings, ceremonies, meetings (id, title, description, event_type, location, start_date, end_date, status, created_by)
- `documents` — records, agreements, forms (id, title, description, file_url, file_type, document_type, uploaded_by, related_member, related_contact, status)
- `transactions` — financial records (id, amount, currency, transaction_type, description, member_id, contact_id, status, payment_method, external_id)
- `messages` — SMS/email logs (id, channel, direction, from_address, to_address, subject, body, status, member_id, contact_id, external_id)
- `settings` — key-value config store (id, key, value, description)

**Service config tables:**
- `telnyx_config` — SMS integration
- `square_config` — payment processing
- `signwell_config` — e-signatures

### Storage Buckets

- `photos` — public bucket, 5MB limit, images only (jpeg/png/webp/gif)
- `documents` — private bucket, 10MB limit, docs (pdf/jpeg/png/docx/txt)

### RLS Policies

- Members & Events: public read for active/upcoming, authenticated full access
- Contacts, Documents, Transactions, Messages: authenticated only
- Settings: public read, authenticated write
- Service configs: authenticated only
- Storage: photos public read / auth write; documents auth only

## External Services

### Email (Resend)
- API key stored as Supabase secret: `RESEND_API_KEY`

### SMS (Telnyx)
- Config in `telnyx_config` table
- Edge functions: `send-sms`, `telnyx-webhook` (deploy with `--no-verify-jwt`)

### Payments (Square)
- Config in `square_config` table
- Edge function: `process-square-payment`

### E-Signatures (SignWell)
- Config in `signwell_config` table
- Edge function: `signwell-webhook` (deploy with `--no-verify-jwt`)

## Conventions

1. Use toast notifications, not alert()
2. Filter archived items client-side
3. Don't expose personal info in public views
4. Client-side image compression for files > 500KB
