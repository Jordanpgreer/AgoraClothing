export type AdminTodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type AdminTodoSection = {
  id: string;
  title: string;
  items: AdminTodoItem[];
};

function item(id: string, text: string): AdminTodoItem {
  return { id, text, done: false };
}

export const DEFAULT_ADMIN_TODO_SECTIONS: AdminTodoSection[] = [
  {
    id: "brand-assets",
    title: "1. Brand Assets",
    items: [
      item("brand-wordmark", "Save public/logo/wordmark.png — AGORA serif text only, for places that want the wordmark without laurel"),
      item("brand-badge", "Save public/logo/badge.png — circular stamp version (the \"Stamp / Badge Version\" from your kit) — for cart confirmation, 404 page, packing inserts"),
      item("brand-gold-dark", "Save public/logo/gold-on-dark.png — pre-tinted gold for charcoal footer (better than CSS-filter version)"),
      item("brand-column", "Save public/logo/column.png — the Doric column alternate motif from your \"Lockup Alternative\" — useful as a quiet sub-mark"),
      item("brand-wreath-flank", "Save public/logo/wreath-flank.png — the \"Wordmark with Wreath\" lockup"),
      item("brand-lockup-alt", "Save public/logo/lockup-alternative.png — the column + AGORA lockup"),
      item("brand-favicon", "Save favicon.ico (32×32 + 16×16) and public/icon-512.png for PWA/iOS — currently using Next.js default"),
      item("brand-og-default", "Save public/og-default.png (1200×630) for default social share card — currently sites linking to your site show no image"),
      item("brand-og-template", "Save public/og-drop-template.psd or design system to generate per-drop OG images"),
      item("brand-apple-touch", "Save public/apple-touch-icon.png (180×180) for iOS home-screen"),
      item("brand-dark-favicon", "Save dark-mode favicon variant if you want a different one for dark browser themes"),
    ],
  },
  {
    id: "real-content-photography",
    title: "2. Real Content / Photography",
    items: [
      item("photo-hero", "Replace hero cover image — currently a stock Unsplash limestone-arch photo"),
      item("photo-products", "Replace all 8 product images with real flat-lay + on-body shots — currently all Unsplash placeholders. 3 shots per product: flat-lay, on-body front, detail. Same lighting/background for consistency"),
      item("photo-drops", "Replace drop cover images for all 4 drops (Foundation, Structure, Origins, Intro)"),
      item("photo-about", "Replace about page image — studio/atelier shot"),
      item("photo-newsletter", "Replace newsletter section background image"),
      item("photo-shop-hero", "Replace shop page hero background Unsplash image"),
      item("photo-editorial", "Replace shop editorial inserts (currently 2 Unsplash photos with stock captions)"),
    ],
  },
  {
    id: "real-content-copy",
    title: "2. Real Content / Copy",
    items: [
      item("copy-drop-stories", "Real drop names + stories — \"Foundation,\" \"Structure\" framing is good but the body copy is my fill"),
      item("copy-product-details", "Real product names, prices, fabrics, descriptions — all 8 products have placeholder copy"),
      item("copy-drop-date", "Real release date for Drop 02 (currently May 8, 2026 — likely needs updating)"),
      item("copy-palette", "Real palette hex codes matching actual fabric colors per drop"),
      item("copy-about", "Real about page copy — currently filler about \"Porto\" atelier"),
      item("copy-footer", "Real footer tagline in admin (currently filler)"),
      item("copy-drop-products", "Drop 02 — Structure has no products yet; add the actual pieces when shooting"),
    ],
  },
  {
    id: "commerce-stripe",
    title: "3. E-commerce / Stripe Integration",
    items: [
      item("stripe-account", "Create a Stripe account, get live + test API keys"),
      item("stripe-env", "Add STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET to env"),
      item("stripe-install", "Install stripe and @stripe/stripe-js packages"),
      item("stripe-checkout", "Replace cart drawer's \"Proceed to Checkout\" button with Stripe Checkout session creation: build app/api/checkout/route.ts that creates a Checkout Session from useCart items, then redirect to the Stripe-hosted checkout URL"),
      item("stripe-pages", "Build /checkout/success and /checkout/canceled pages with branded states"),
      item("stripe-webhook", "Implement Stripe webhook handler at app/api/webhooks/stripe/route.ts for checkout.session.completed to mark inventory as decremented, trigger order confirmation email, and store order record (in orders Postgres table)"),
      item("stripe-tax-shipping", "Configure tax (Stripe Tax) and shipping rates"),
      item("stripe-test-flow", "Test end-to-end with Stripe's test card flow"),
    ],
  },
  {
    id: "commerce-shopify",
    title: "3. E-commerce / Shopify Storefront Alternative",
    items: [
      item("shopify-decision", "Decide: Stripe (DIY) vs. Shopify Storefront (managed)"),
      item("shopify-storefront", "If Shopify: create store, mirror products, swap cart actions for Storefront API mutations"),
    ],
  },
  {
    id: "commerce-inventory",
    title: "3. E-commerce / Inventory",
    items: [
      item("inventory-table", "Create inventory table in Supabase keyed by (product_slug, size) with stock counts"),
      item("inventory-admin", "Wire admin to edit stock counts per product/size"),
      item("inventory-cart-block", "Block adding to cart when out of stock"),
      item("inventory-badges", "Show \"Last few\" / \"Sold out\" indicators based on real stock"),
      item("inventory-decrement", "Decrement stock atomically on Stripe webhook fire"),
    ],
  },
  {
    id: "commerce-orders",
    title: "3. E-commerce / Order Management",
    items: [
      item("orders-page", "Build /admin/orders page listing orders (date, customer, total, status)"),
      item("orders-detail", "Per-order detail page showing line items, shipping address, fulfillment status"),
      item("orders-status", "Manual status updates (paid → packed → shipped → delivered)"),
      item("orders-export", "CSV export of orders"),
    ],
  },
  {
    id: "email-sms",
    title: "4. Email / SMS",
    items: [
      item("email-provider", "Pick a provider — Klaviyo (best for fashion drops + SMS) or Resend (cleaner API, email only)"),
      item("email-newsletter", "Wire newsletter signup forms (3 places — countdown stripe, footer, dedicated section) to provider's API"),
      item("email-order-confirmation", "Order confirmation email template (sent via Stripe webhook on payment success)"),
      item("email-shipping", "Shipping notification email with tracking number"),
      item("email-drop-announcement", "Drop announcement email — admin can trigger from /admin/drops/[slug] with one button"),
      item("email-welcome", "Welcome email for newsletter subscribers (24-hour early access link to next drop, per the brand promise)"),
      item("sms-opt-in", "SMS opt-in flow with double-confirmation (legal requirement in US)"),
      item("email-unsubscribe", "Unsubscribe handling — wire to provider's preference center"),
    ],
  },
  {
    id: "auth-admin",
    title: "5. Auth & Multi-User Admin",
    items: [
      item("auth-supabase", "Replace single ADMIN_PASSWORD cookie with Supabase Auth magic links or Google sign-in"),
      item("auth-admin-users", "admin_users Supabase table with role (owner, editor)"),
      item("auth-middleware", "Update middleware.ts to check Supabase session instead of cookie"),
      item("auth-login-page", "Sign-in page replaces current /admin/login"),
      item("auth-audit-log", "Audit log: track who edited what, when (new audit_log table written from server actions)"),
    ],
  },
  {
    id: "production-deploy",
    title: "6. Production Deploy",
    items: [
      item("deploy-vercel", "Deploy to Vercel — import repo, add env vars (URL, service role key, bucket name, admin password)"),
      item("deploy-supabase-env", "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Production, Preview, Development scopes"),
      item("deploy-admin-password", "Set strong ADMIN_PASSWORD in production env (not the default agora-admin)"),
      item("deploy-domain", "Buy custom domain (e.g. agorastudio.com / wearagora.com)"),
      item("deploy-dns", "Configure DNS in Vercel — A/CNAME records, wait for SSL provisioning"),
      item("deploy-analytics", "Enable Vercel Analytics (free tier, one-line install)"),
      item("deploy-speed-insights", "Set up Vercel Speed Insights for real-user performance data"),
      item("deploy-supabase-check", "Verify Supabase production connection works from Vercel (not just localhost)"),
    ],
  },
  {
    id: "seo",
    title: "7. SEO & Discoverability",
    items: [
      item("seo-sitemap", "sitemap.xml — auto-generated from drops + products via app/sitemap.ts"),
      item("seo-robots", "robots.txt — allow crawling, point to sitemap"),
      item("seo-metadata", "Per-page metadata — currently most pages have generic titles. Need hero meta description with drop info, product pages with name, price, fabric in description, and drop pages with story snippet"),
      item("seo-og", "Open Graph images — generate per-drop and per-product OG images using next/og (app/og/[slug]/route.tsx)"),
      item("seo-schema", "Structured data (JSON-LD) — Product schema on product pages, Organization schema site-wide, BreadcrumbList on nested pages"),
      item("seo-twitter", "Twitter Card meta tags (twitter:card, twitter:image)"),
      item("seo-submit", "Submit sitemap to Google Search Console + Bing Webmaster Tools"),
      item("seo-verify", "Verify domain ownership in Google Analytics or Plausible"),
      item("seo-schema-test", "Schema markup test: validate on schema.org's tester before launch"),
    ],
  },
  {
    id: "missing-pages",
    title: "8. Pages Currently Missing",
    items: [
      item("pages-checkout", "/checkout/success and /checkout/canceled"),
      item("pages-account", "/account — order history, saved addresses, edit profile (post-Stripe)"),
      item("pages-journal", "/journal — long-form posts (linked in footer, doesn't exist yet)"),
      item("pages-contact", "/contact — link in footer, returns 404"),
      item("pages-care", "/care — garment care guide, linked in footer"),
      item("pages-shipping", "/shipping — shipping policy, linked in footer"),
      item("pages-returns", "/returns — returns policy, linked in footer"),
      item("pages-faq", "/faq — frequently asked questions, linked in footer"),
      item("pages-privacy", "/privacy — privacy policy [BLOCKER for launch — required by GDPR/CCPA]"),
      item("pages-terms", "/terms — terms of service [BLOCKER for launch]"),
      item("pages-accessibility", "/accessibility — accessibility statement"),
      item("pages-404", "Custom 404 page — currently default Next.js 404, doesn't match brand"),
      item("pages-500", "Custom 500 / error boundary page"),
      item("pages-lookbook", "Lookbook page per drop — editorial photo spread (linked from drop pages)"),
      item("pages-process", "Process / Atelier page — video or photo essay about how garments are made"),
      item("pages-press-kit", "Press kit page — for journalists/buyers, with downloadable assets"),
    ],
  },
  {
    id: "admin-tooling",
    title: "9. Admin Tooling Upgrades",
    items: [
      item("tooling-drop-order", "Drag-and-drop reordering of drops in /admin/drops (currently order is fixed by JSON sort)"),
      item("tooling-product-order", "Drag-and-drop reordering of products inside a drop"),
      item("tooling-image-order", "Drag-and-drop reordering of images within a product (currently arrow buttons)"),
      item("tooling-bulk-upload", "Bulk image upload — drop a folder, auto-create products from filenames"),
      item("tooling-cropping", "Image cropping — per-image focal-point picker so different aspect ratios crop intelligently"),
      item("tooling-live-preview", "Live preview pane alongside edit forms showing the homepage as you type"),
      item("tooling-history", "Revision history — site_content_history table that stores last 50 saves; one-click rollback"),
      item("tooling-draft-mode", "Draft mode — separate draft_data column so you can preview unpublished edits before publishing"),
      item("tooling-schedule-drop", "Schedule a drop release — set a future timestamp where status flips from upcoming → live automatically (Vercel Cron job)"),
      item("tooling-delete-confirm", "Delete confirmation improvements (currently uses browser confirm() — should be a proper modal)"),
      item("tooling-markdown", "Markdown support in story / description fields"),
      item("tooling-alt-text", "Image alt-text field per product image (currently empty alt)"),
    ],
  },
  {
    id: "storefront",
    title: "10. Storefront Functionality",
    items: [
      item("storefront-variants", "Variant selector — color/colorway swatches that swap product images and price"),
      item("storefront-recommendations", "\"You may also like\" carousel at the bottom of product pages (random other-drop pieces)"),
      item("storefront-recently-viewed", "Recently viewed — small horizontal strip in cart drawer (localStorage)"),
      item("storefront-wishlist", "Wishlist — heart icon on product cards, saved in localStorage with badge in nav"),
      item("storefront-search", "Real fuzzy search — expand Cmd+K to search product names, fabrics, colors with results page"),
      item("storefront-filter-persistence", "Filter persistence — filters on /shop reset on reload; persist via URL search params"),
      item("storefront-notify", "\"Notify me when restocked\" — even though you don't restock, \"notify when this category drops next\""),
      item("storefront-waitlist", "Waitlist with referral position — \"you're #47, share to move up\""),
      item("storefront-size-guide", "Size guide modal triggered from size selector with measurements per category"),
      item("storefront-gift-cards", "Gift cards (post-Stripe)"),
      item("storefront-discounts", "Discount codes (post-Stripe)"),
    ],
  },
  {
    id: "polish-accessibility",
    title: "11. Polish & Accessibility / Accessibility",
    items: [
      item("a11y-alt", "Real alt text on every product image (currently empty or generic)"),
      item("a11y-motion", "Reduced-motion media query — disable Ken Burns, parallax, breathing animations for users with prefers-reduced-motion"),
      item("a11y-keyboard", "Keyboard navigation pass — confirm cart drawer, Cmd+K palette, lightbox all trap focus correctly"),
      item("a11y-focus", "Visible focus rings — currently many buttons have no visible focus state (custom cursor hides them)"),
      item("a11y-contrast", "Color contrast audit — some text-charcoal/55 against bg-bone may fail WCAG AA"),
      item("a11y-skip-link", "Skip-to-content link at top of page"),
      item("a11y-labels", "Form labels — admin forms use <p className=\"label-sm\"> instead of real <label htmlFor> — screen readers can't associate"),
      item("a11y-aria", "ARIA on dynamic content — cart count, countdown, filter results"),
      item("a11y-screen-reader", "Tested with screen reader (VoiceOver or NVDA)"),
      item("a11y-lighthouse", "Lighthouse a11y score ≥ 95"),
    ],
  },
  {
    id: "polish-performance",
    title: "11. Polish & Accessibility / Performance",
    items: [
      item("perf-image-optimization", "Image optimization — Unsplash placeholders are 1800px wide; once swapped for real assets, run them through sharp for proper srcsets"),
      item("perf-blur", "Blur placeholders — placeholder=\"blur\" on every Image with base64 thumbnails"),
      item("perf-cursor", "Reduce custom cursor re-renders — currently every mousemove triggers a state update; throttle or use refs"),
      item("perf-lazy-load", "Lazy-load heavy below-fold sections (lookbook, archive)"),
      item("perf-bundle", "Bundle analyze — run @next/bundle-analyzer and trim anything > 50KB"),
      item("perf-cache", "Cache headers for /uploads/* and Supabase Storage CDN"),
      item("perf-lighthouse", "Lighthouse perf score ≥ 90 on mobile"),
    ],
  },
  {
    id: "polish-visual",
    title: "11. Polish & Accessibility / Visual Polish",
    items: [
      item("visual-loading-bar", "Page loading bar between routes (currently instant locally, slower in prod)"),
      item("visual-error-pages", "Custom error pages in Agora's voice"),
      item("visual-sound", "Sound files — drop public/sound/room-tone.mp3 and the toggle works (currently silent)"),
      item("visual-cursor", "Cursor \"Agora\" idle animation — laurel that draws when you idle 3s"),
      item("visual-print", "Print stylesheet so receipts/orders look right"),
      item("visual-email-templates", "Email templates designed in Agora's voice (post-provider integration)"),
    ],
  },
  {
    id: "mobile",
    title: "12. Mobile",
    items: [
      item("mobile-device-testing", "Real device testing — built responsive but never tested on iOS Safari / Android Chrome"),
      item("mobile-cart", "Bottom-sheet cart drawer on mobile instead of side drawer"),
      item("mobile-gallery", "Swipeable product image gallery on detail pages (currently click thumbnails)"),
      item("mobile-refresh", "Pull-to-refresh with branded laurel loader"),
      item("mobile-haptics", "Haptic feedback on key actions (iOS vibrate API)"),
      item("mobile-og", "Mobile-optimized OG images (different aspect ratio)"),
      item("mobile-share", "Share sheet integration on product pages (navigator.share)"),
      item("mobile-pwa", "PWA manifest so users can \"Add to Home Screen\""),
      item("mobile-splash", "Splash screen for PWA"),
      item("mobile-pay", "Apple Pay / Google Pay in Stripe Checkout (free, just enable)"),
    ],
  },
  {
    id: "legal",
    title: "13. Legal / Compliance",
    items: [
      item("legal-privacy", "Privacy Policy (real one — not boilerplate)"),
      item("legal-terms", "Terms of Service"),
      item("legal-cookie-banner", "Cookie consent banner if targeting EU/UK"),
      item("legal-gdpr-export", "GDPR data export endpoint (user can download their data)"),
      item("legal-gdpr-delete", "GDPR delete-my-account flow"),
      item("legal-ccpa", "CCPA \"Do not sell my info\" toggle (if shipping to California)"),
      item("legal-can-spam", "CAN-SPAM compliance on emails (physical address, unsubscribe link, accurate from name)"),
      item("legal-sales-tax", "Sales tax registration in states/regions where you have nexus"),
      item("legal-entity", "Business entity (LLC / Ltd) registered before accepting money"),
      item("legal-bank", "Business bank account linked to Stripe"),
      item("legal-ein", "EIN / Tax ID for Stripe payouts"),
    ],
  },
  {
    id: "analytics",
    title: "14. Analytics & Observability",
    items: [
      item("analytics-vercel", "Vercel Analytics (1-line, free)"),
      item("analytics-product", "Plausible or PostHog for deeper product analytics"),
      item("analytics-sentry", "Sentry for error tracking — server actions can fail silently right now"),
      item("analytics-stripe", "Stripe Dashboard monitoring for failed payments"),
      item("analytics-supabase", "Supabase logs review weekly for slow queries / RLS violations"),
      item("analytics-conversion", "Conversion tracking — drop view → product view → add to cart → checkout"),
    ],
  },
  {
    id: "backups",
    title: "15. Backups & Disaster Recovery",
    items: [
      item("backup-supabase", "Supabase auto-backup — verify enabled (free tier has 7-day daily backups)"),
      item("backup-export-script", "Manual export script — scripts/export-content.mjs that dumps site_content row to JSON"),
      item("backup-image-bucket", "Image bucket backup strategy — Supabase Storage doesn't snapshot; consider weekly mirror to S3"),
      item("backup-recovery-procedure", "Document recovery procedure — what to do if Supabase project is deleted"),
    ],
  },
  {
    id: "marketing",
    title: "16. Marketing-Adjacent",
    items: [
      item("marketing-influencer-list", "Influencer / press list with stock photos to send"),
      item("marketing-lookbook-pdf", "Lookbook PDF downloadable from press kit"),
      item("marketing-links-page", "Linktree-style profile link (or build a /links page in Agora's voice)"),
      item("marketing-instagram-link", "Instagram bio link pointing to current drop"),
      item("marketing-embed-cards", "Embed-ready product cards for journalists / blogs"),
      item("marketing-affiliate", "Affiliate program (post-launch consideration)"),
    ],
  },
];

export function cloneAdminTodoSections(
  sections: AdminTodoSection[] = DEFAULT_ADMIN_TODO_SECTIONS,
): AdminTodoSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((todo) => ({ ...todo })),
  }));
}
