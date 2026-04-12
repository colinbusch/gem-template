# GEM Client Deployment Checklist

Follow these steps **top to bottom** for every new client site.
All steps are required unless marked optional.

---

## 1. Clone & install

```bash
git clone <gem-template-repo> <client-slug>
cd <client-slug>
npm install
```

---

## 2. Edit `src/lib/config.ts` — the only file you need for most clients

Search and fill every value in this file. Checklist:

### BRAND

- [ ] `name` — full legal business name (e.g. `Müller Elektro GmbH`)
- [ ] `shortName` — short name shown in navbar (e.g. `Müller`)
- [ ] `trade` — trade descriptor in copper after logo (e.g. `Elektro`, `Maler`, `Sanitär`)
- [ ] `tagline` — one-line hero subline (keep under 120 chars)
- [ ] `schemaType` — JSON-LD type:
  - Plumber · Electrician · Painter · RoofingContractor · HVACBusiness · GeneralContractor
- [ ] `url` — canonical URL with https, no trailing slash (e.g. `https://www.mueller-elektro.de`)
- [ ] `foundingYear` — year as string (e.g. `'2012'`)

### CONTACT

- [ ] `phone` — display format (e.g. `+49 221 123 456`)
- [ ] `phoneHref` — href-safe format (e.g. `+4922112345678`)
- [ ] `whatsapp` — digits only, no + (e.g. `4917612345678`)
- [ ] `email`

### ADDRESS

- [ ] `street`, `city`, `district`, `zip`, `country`
- [ ] `lat` + `lng` — get from Google Maps: right-click location → "Koordinaten kopieren"

### PROOF

- [ ] `rating` — e.g. `'4.8'`
- [ ] `reviewCount` — e.g. `'87'`
- [ ] `projectCount` — e.g. `'900+'`
- [ ] `yearsActive` — e.g. `'12+'`

### HOURS

- [ ] Update `HOURS` array to match client's actual opening times

### SERVICES (6 cards)

- [ ] Replace icon imports at top of file with relevant Lucide icons for the trade
- [ ] Update title + description for each of the 6 service objects

### USPS (3 cards)

- [ ] Update `stat`, `label`, `body` copy — use real numbers from the client

### PARTNERS

- [ ] Replace with client's actual brand partners (or remove if none)

### PROBLEM_TYPES

- [ ] Adapt dropdown options to match the trade (e.g. for electrician: "Sicherungskasten", "Außenbeleuchtung", etc.)

### META

- [ ] Review `title` and `description` — fine-tune for local SEO

---

## 3. Set environment variables

```bash
cp .env.example .env.local
```

- [ ] `WHATSAPP_NUMBER` — digits only (e.g. `4917612345678`)
- [ ] (Optional) `RESEND_API_KEY` + `FROM_EMAIL` + `TO_EMAIL` — then uncomment the Resend block in `src/routes/+page.server.ts`

---

## 4. Fill legal pages

Search both legal files for `TODO` — there are ~6 operator-specific fields:

**`src/routes/impressum/+page.svelte`**

- [ ] Owner / Inhaber name (replace "Max Mustermann")
- [ ] Registergericht + HRB number
- [ ] Umsatzsteuer-ID
- [ ] Zuständige Handwerkskammer + Bundesland

**`src/routes/datenschutz/+page.svelte`**

- [ ] Owner / Geschäftsführer name (replace "Max Mustermann")
- [ ] Supervisory authority (Aufsichtsbehörde) for the client's Bundesland

> Tip: search for `TODO` in both files — every placeholder is marked.

---

## 5. Drop in assets

| File                  | Notes                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| `static/favicon.svg`  | Replace the placeholder wrench SVG with the client's logo mark         |
| `static/og-image.jpg` | 1200 × 630 px — used for social share previews. Design in Figma/Canva. |

---

## 6. Test locally

```bash
npm run dev
```

Work through this checklist in the browser:

- [ ] Homepage loads — all 5 sections visible (Hero → Services → Why Us → Form → Partners)
- [ ] Fill in the quote form → click "Anfrage senden" → success state appears → "WhatsApp öffnen" button works → pre-filled message contains Name, Problem, and Phone
- [ ] Submit with empty phone → inline German error message appears, no redirect
- [ ] `/impressum` loads — no "TODO" or "Max Mustermann" visible
- [ ] `/datenschutz` loads — no "TODO" or placeholder text visible
- [ ] Mobile: navbar hamburger opens/closes, CTA works
- [ ] View page source → find `<script type="application/ld+json">` → verify `name`, `telephone`, `address` match the client
- [ ] Favicon appears in browser tab

---

## 7. Build & type-check

```bash
npm run check   # must exit 0 errors, 0 warnings
npm run build   # output → ./build/
```

---

## 8. Deploy to Coolify (Hetzner)

1. Push the repo to GitHub / Gitea
2. In Coolify: **New Resource → Application → Git**
3. Build command: `npm run build`
4. Start command: `node build/index.js`
5. Set environment variables in Coolify dashboard (same as `.env.local`)
6. Set domain + enable Let's Encrypt SSL
7. Deploy → verify live URL

---

## DNS handover (for clients on Strato / IONOS / 1&1)

> We never cancel their existing hosting contract.

1. Note the current A-Record IP (screenshot for client records)
2. Add new A-Record pointing to Hetzner VPS IP
3. Set TTL to 300 (5 min) before switching
4. After propagation (~15 min): verify site is live on new server
5. Reset TTL to 3600
6. Email client: "Ihre neue Website ist live. Ihre alten E-Mails funktionieren weiterhin unverändert."
