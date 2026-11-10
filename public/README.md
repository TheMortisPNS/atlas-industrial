# Atlas Inc. INDUSTRIAL

> Συντήρηση & Υποστήριξη Βιομηχανικού Εξοπλισμού

Progressive Web App για διαχείριση υπηρεσιών συντήρησης βιομηχανικού εξοπλισμού.

**Tech Stack:** Plain HTML, CSS, JavaScript (ES Modules) — Κανένα framework.

## Demo

- **Email:** `demo@atlas.gr`
- **Password:** `Demo1234!`
- **ΑΦΜ:** `094259216`

## Χαρακτηριστικά

- 🏠 4 κύριες οθόνες: Home, Services, Map, Request
- 🛠️ 3 υπηρεσίες με accordion cards
- 🗺️ Leaflet χάρτης με 4 κέντρα εξυπηρέτησης
- 📦 14 ανταλλακτικά με αναζήτηση, φίλτρα & wishlist
- 🔐 Auth: Register, Login, Forgot Password
- 🌍 i18n: Ελληνικά / English
- 🌙 Dark / Light theme
- 📱 PWA: offline, installable
- ♿ Accessible (WCAG AA)

## Supabase Setup

1. Δημιουργήστε project στο [supabase.com](https://supabase.com)
2. Ανοίξτε SQL Editor → επικολλήστε το `supabase/schema.sql`
3. Settings → Auth: Enable email confirmations (ή απενεργοποιήστε για γρήγορο test)
4. Settings → Auth → Email Templates: χρησιμοποιήστε `{{.Token}}` για OTP (600s)
5. Δημιουργήστε demo user: `demo@atlas.gr` / `Demo1234!` με metadata `{"full_name":"Demo User","vat":"094259216"}`
6. Αντιγράψτε URL + anon key στο `js/config.js`
7. Settings → Auth → Redirect URLs: προσθέστε `https://your-domain.com`

## Deploy

### Vercel

1. Import GitHub repo
2. Framework Preset: **Other**
3. Output Directory: `.` (root)
4. Deploy

### GitHub Pages

1. Settings → Pages → Source: `main` branch, `/ (root)`
2. Save — το site θα είναι στο `https://username.github.io/atlas-industrial`

## PWA Install

- **Android/Desktop:** Κλικ στο "Install" banner ή Ρυθμίσεις → Εγκατάσταση εφαρμογής
- **iOS Safari:** Share → Add to Home Screen

## Security Note

- Το anon key είναι public (ασφαλές στο client)
- Όλα τα δεδομένα προστατεύονται με RLS policies
- Τα δεδομένα είναι ενδεικτικά / εκπαιδευτικά
- Το form αιτήματος ΔΕΝ στέλνει δεδομένα πουθενά (προσομοίωση)

## Requirement-to-Implementation Mapping

| Requirement | Implementation | File(s) |
|---|---|---|
| SPA Hash Routing | Hash-based router | `js/router.js` |
| 4 Core Screens | Home, Services, Map, Request | `js/app.js` |
| Accordion Services | 3 expandable cards | `js/app.js`, `css/components.css` |
| Support Request Form | Validated form + success modal | `js/form.js`, `js/app.js` |
| Leaflet Map | 4 markers, popups, dark tiles | `js/map.js` |
| Spare Parts + Search | 14 parts, filter, search | `js/parts.js` |
| Wishlist | Heart button, persist, counter | `js/app.js`, `js/db.js` |
| Auth (Supabase/Demo) | Register, Login, Forgot PW | `js/auth.js`, `js/db.js` |
| ΑΦΜ Validation | Checksum algorithm | `js/auth.js` |
| i18n GR/EN | Full dictionary, t() function | `js/i18n.js` |
| Dark/Light Theme | CSS custom properties | `css/tokens.css`, `js/store.js` |
| PWA | SW, manifest, install prompt | `sw.js`, `manifest.json`, `js/pwa.js` |
| Offline | Cache-first + offline.html | `sw.js`, `offline.html` |
| Mobile Bottom Nav | 5 tabs, fixed | `css/layout.css`, `js/app.js` |
| Desktop Sidebar | Fixed 240px sidebar | `css/layout.css`, `js/app.js` |
| Supabase Schema | profiles + wishlist + RLS | `supabase/schema.sql` |
| Accessibility | Labels, ARIA, focus, contrast | All files |
| Settings Page | Name, PW, theme, lang, delete | `js/app.js` |

## Test Scenarios

### S1: Navigation & Layout
1. Open app → Home screen visible
2. Tap each nav item → correct screen loads
3. Browser back/forward works
4. Resize to desktop → sidebar appears, bottom nav hides

### S2: Auth Flow
1. Tap Login → login form appears
2. Click "Use demo account" → fields fill
3. Submit → logged in, redirect to home
4. Register new account with valid ΑΦΜ → auto-login
5. Invalid ΑΦΜ → error shown
6. Forgot password flow → 3 steps complete

### S3: Core Features
1. Services → 3 accordions expand/collapse
2. Map → 4 markers visible, popups work
3. Request form → validation on blur, success modal
4. Parts → search filters, category chips work
5. Heart button → adds/removes from wishlist
6. Wishlist → shows saved items

### S4: PWA & Preferences
1. Theme toggle → dark/light switches
2. Language toggle → GR/EN switches
3. Preferences persist on reload
4. App works offline (cached pages)
5. Install prompt appears (if supported)

## License

MIT — Educational project.
