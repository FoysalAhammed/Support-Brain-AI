import type { ChunkPreview, DiscoveredPage } from "@/types/crawler";
import type { ExtractedSection, KnowledgeSourceType } from "@/types/knowledge";

export const websitePageCatalog: { title: string; path: string }[] = [
  { title: "Home", path: "/" },
  { title: "About Us", path: "/about" },
  { title: "Services", path: "/services" },
  { title: "Pricing", path: "/pricing" },
  { title: "FAQ", path: "/faq" },
  { title: "Contact", path: "/contact" },
  { title: "Terms of Service", path: "/terms" },
  { title: "Privacy Policy", path: "/privacy" },
  { title: "Products", path: "/products" },
  { title: "Blog", path: "/blog" },
  { title: "Shipping & Delivery", path: "/shipping" },
  { title: "Refund Policy", path: "/refund-policy" },
  { title: "Warranty", path: "/warranty" },
  { title: "Track Order", path: "/track-order" },
  { title: "Returns Portal", path: "/returns" },
  { title: "Membership", path: "/plus" },
  { title: "Wholesale", path: "/wholesale" },
  { title: "Assembly Guide", path: "/assembly" },
  { title: "Careers", path: "/careers" },
  { title: "Store Locator", path: "/stores" },
  { title: "Gift Cards", path: "/gift-cards" },
  { title: "Sustainability", path: "/sustainability" },
  { title: "Customer Reviews", path: "/reviews" },
  { title: "Size Guide", path: "/size-guide" },
  { title: "Press", path: "/press" },
  { title: "Accessibility", path: "/accessibility" },
  { title: "Cookie Policy", path: "/cookies" },
  { title: "Sitemap", path: "/sitemap" },
];

export const facebookSectionCatalog: { title: string; path: string }[] = [
  { title: "Business Information", path: "business" },
  { title: "About", path: "about" },
  { title: "Services", path: "services" },
  { title: "Contact", path: "contact" },
  { title: "Public Content", path: "posts" },
  { title: "FAQ", path: "faq" },
  { title: "Reviews", path: "reviews" },
  { title: "Page Information", path: "page-info" },
];

export const databaseTableCatalog: { title: string; path: string }[] = [
  { title: "Orders", path: "public.orders" },
  { title: "Order Items", path: "public.order_items" },
  { title: "Customers", path: "public.customers" },
  { title: "Product Catalog", path: "public.products" },
  { title: "Inventory", path: "public.inventory" },
  { title: "Payments", path: "public.payments" },
  { title: "Shipments", path: "public.shipments" },
  { title: "Subscriptions", path: "public.subscriptions" },
  { title: "Support Tickets", path: "public.support_tickets" },
  { title: "Product Reviews", path: "public.reviews" },
  { title: "Carts", path: "public.carts" },
  { title: "Addresses", path: "public.addresses" },
];

export const documentSectionCatalog: { title: string; path: string }[] = [
  { title: "Cover", path: "01-cover" },
  { title: "Warranty Terms", path: "02-warranty-terms" },
  { title: "Coverage Period", path: "03-coverage-period" },
  { title: "What Is Covered", path: "04-what-is-covered" },
  { title: "Exclusions", path: "05-exclusions" },
  { title: "Claim Process", path: "06-claim-process" },
  { title: "Returns Policy", path: "07-returns-policy" },
  { title: "Refund Timelines", path: "08-refunds" },
  { title: "Shipping Damage", path: "09-shipping-damage" },
  { title: "Contact & Escalation", path: "10-contact" },
];

export const pageContent: Record<string, string> = {
  Home: "Northwind Commerce designs and ships premium home and lifestyle essentials to more than 40 countries, backed by a 5-year craftsmanship guarantee, free carbon-neutral shipping over $75 and a 60-day return window.",
  "About Us":
    "Our company provides thoughtfully designed home and lifestyle products. Founded in 2014 in Portland, Oregon, we now serve over 380,000 customers with an in-house design studio and 42 regional fulfilment partners.",
  Services:
    "We provide free interior styling consultations, assembly assistance for large furniture, a trade programme for designers, extended warranty plans and a subscription service for consumable home products delivered quarterly.",
  Pricing:
    "Our plans include Northwind Plus at $9 per month or $89 per year with free two-day shipping and a 90-day return window, while standard accounts are always free with no membership required.",
  FAQ: "Customers can find answers on order tracking, changing a delivery address, cancelling an order, international duties, gift wrapping and assembly — each answer links directly to the relevant policy page.",
  Contact:
    "Reach our support team seven days a week, 8am–8pm Pacific Time, by live chat, email at support@northwind.com or phone. Most conversations receive a first reply within one hour.",
  "Terms of Service":
    "These terms describe acceptable use of our store, order acceptance, pricing and promotions, liability limits and dispute resolution for customers shopping with us.",
  "Privacy Policy":
    "We collect only the data needed to fulfil orders and improve your experience, never sell personal information, and honour deletion requests within 30 days.",
  Products:
    "Our catalogue spans seating, storage, lighting and soft furnishings, with each collection developed in-house using responsibly sourced materials.",
  Blog: "Guides on styling small spaces, caring for solid wood, reducing household waste and choosing the right materials for humid climates.",
  "Shipping & Delivery":
    "Orders placed before 2pm local time ship the same business day. Standard delivery is 2-4 business days in the US and 5-9 business days internationally, with express options in 1-2 days.",
  "Refund Policy":
    "You may return unused items within 60 days of delivery for a full refund to the original payment method. Members on Northwind Plus receive a 90-day window, and made-to-order items are final sale.",
  Warranty:
    "Every product carries a 5-year craftsmanship guarantee covering structural defects and manufacturing faults, but not normal wear, misuse or accidental damage.",
  "Track Order":
    "Track your parcel in real time using the link in your dispatch confirmation email, or from Track Order in your account. If tracking stalls for 48 hours we trace it with the carrier.",
  "Returns Portal":
    "Start a return in three steps, print a prepaid label and drop the parcel at any collection point. Refunds are issued within 5 business days of arrival.",
  Membership:
    "Northwind Plus adds free two-day shipping, early access to seasonal collections, a 90-day extended return window and 10% off the trade programme.",
  Wholesale:
    "Our trade programme offers dedicated pricing, priority production slots, co-branded packaging and a personal account manager, starting at 50 units per SKU per quarter.",
  "Assembly Guide":
    "Step-by-step instructions and short videos cover self-assembly for smaller products, and professional assembly can be booked for larger furniture items.",
  Careers:
    "We are a distributed team of designers, makers and support specialists, with roles across product, operations and customer experience.",
  "Store Locator":
    "Find your nearest Northwind showroom, check opening hours and book a styling appointment at a location near you.",
  "Gift Cards":
    "Digital and physical gift cards never expire and can be redeemed online or in any Northwind retail location.",
  Sustainability:
    "All packaging is 100% recyclable or compostable, and our reforestation programme plants a tree for every order placed without expedited shipping.",
  "Customer Reviews":
    "We hold a 4.8 out of 5 average from more than 12,000 verified reviews, praised for build quality, delivery speed and responsive support.",
  "Size Guide":
    "Measurement charts and clearance guidance help you choose the right fit for seating, tables and storage before you order.",
  Press:
    "Company milestones, brand assets and media contacts for journalists covering design, retail and sustainable manufacturing.",
  Accessibility:
    "We are working towards WCAG 2.1 AA conformance and welcome feedback from customers using assistive technology.",
  "Cookie Policy":
    "Essential cookies keep the store working, while optional analytics and marketing cookies can be managed at any time from the cookie preferences panel.",
  Sitemap:
    "A complete index of every public page on the site, grouped by category for customers and search engines.",
  "Business Information":
    "Business Information — Category: Home & Garden · 128,400 followers · Based in Portland, Oregon · Typically replies within one hour.",
  About:
    "Northwind Commerce designs premium home essentials with durability and sustainability in mind, founded in 2014 and now serving over 380,000 customers worldwide.",
  "Public Content":
    "Recent public posts feature the Autumn Collection launch with 15% off first orders using code AUTUMN15, a restock notice for the Cedar lounge chair and a community reforestation fundraiser.",
  Reviews:
    "Reviews & Recommendations — a 4.8 / 5 average from 3,200 recommendations, with praise for build quality and delivery speed.",
  "Page Information":
    "Page Information — verified business page with opening hours, address and current seasonal promotions published publicly.",
  Orders:
    "public.orders — 4,182 orders in the last 30 days with status, customer_id, total, currency, discount and created_at. Average order value $86.40, cancellation rate 3.1%, 62% of orders include at least two items.",
  "Order Items":
    "public.order_items — 9,640 line items linking orders to products with quantity, unit_price and line_total. The Alder Lounge Chair and Marlow Oak Table are the most frequently ordered SKUs.",
  Customers:
    "public.customers — 38,204 active accounts with email, signup date, membership tier and lifetime_value. 12% are Northwind Plus members and the average lifetime value is $412.",
  "Product Catalog":
    "public.products — 1,240 SKUs with name, category, price, cost and supplier. Home and Living categories account for 48% of revenue.",
  Inventory:
    "public.inventory — stock on hand per SKU per warehouse. 18 products are below their reorder threshold and 6 are out of stock; the Cedar lounge chair holds 240 units across three warehouses.",
  Payments:
    "public.payments — 5,904 settled payments this month with method, provider, amount and status. Card payments are 71%, digital wallets 22% and buy-now-pay-later 7%.",
  Shipments:
    "public.shipments — 4,010 shipments with carrier, tracking_number, dispatched_at and delivered_at. 94% delivered within the promised window and the average transit time is 2.8 days.",
  Subscriptions:
    "public.subscriptions — 4,580 active memberships contributing $182k monthly recurring revenue, with a 3.4% monthly churn rate.",
  "Support Tickets":
    "public.support_tickets — 1,204 tickets in the last 30 days with channel, priority, sentiment and resolution time. 87% were resolved by the AI agent without handoff.",
  "Product Reviews":
    "public.reviews — 12,480 verified reviews averaging 4.8 out of 5, most frequently praising build quality, delivery speed and responsive support.",
  Carts:
    "public.carts — 6,730 carts, 24% of which are abandoned, representing $214k of recoverable revenue.",
  Addresses:
    "public.addresses — 44,120 saved shipping addresses across 42 countries, with the United States, Canada and the United Kingdom the top destinations.",
  Cover:
    "Northwind Commerce — Warranty & Returns Policy. Version 4.2, effective January 2026. This document describes the 5-year craftsmanship guarantee, the 60-day return window and how to claim.",
  "Warranty Terms":
    "Every Northwind product carries a 5-year craftsmanship guarantee covering structural defects and manufacturing faults from the date of delivery.",
  "Coverage Period":
    "The guarantee runs for 60 months from the delivery date. Northwind Plus members receive an additional 12 months of coverage on all eligible items.",
  "What Is Covered":
    "Covered: structural failure, joint separation, frame defects, manufacturing faults and material failure under normal domestic use.",
  Exclusions:
    "Not covered: normal wear and tear, misuse, accidental damage, exposure to extreme humidity, and commercial use beyond the trade programme terms.",
  "Claim Process":
    "Claims can be filed from your account or by contacting support with your order number and photos. Approved replacements ship within 3 business days.",
  "Returns Policy":
    "Unused items may be returned within 60 days of delivery for a full refund. Members on Northwind Plus receive a 90-day window. Made-to-order items are final sale.",
  "Refund Timelines":
    "Refunds are issued to the original payment method within 5 business days of the returned item arriving at our warehouse.",
  "Shipping Damage":
    "Report damage within 48 hours of delivery with photos and we will arrange a replacement or refund at no cost.",
  "Contact & Escalation":
    "Reach the warranty team seven days a week between 8am and 8pm Pacific Time. Unresolved claims are escalated to a senior specialist within one business day.",
};

const chunkTemplates = [
  "Our standard delivery window is 2-4 business days within the United States and 5-9 business days for international orders.",
  "You can return unused items within 60 days of delivery for a full refund to the original payment method.",
  "Every product is covered by a 5-year craftsmanship guarantee that protects against structural and manufacturing defects.",
  "Membership costs $9 per month or $89 per year and includes free two-day shipping and a 90-day return window.",
  "Orders placed before 2pm local time are shipped the same business day from our nearest fulfilment centre.",
  "Customer support is available seven days a week between 8am and 8pm Pacific Time by chat, email and phone.",
  "We ship to more than 40 countries and handle all customs documentation on your behalf for supported destinations.",
  "Assembly assistance is available for large furniture items and can be booked during checkout or from your account.",
  "Trade programme members receive dedicated pricing, priority production slots and a personal account manager.",
  "Gift cards never expire and can be redeemed online or in any Northwind retail location.",
  "Track your parcel in real time using the tracking link in your dispatch confirmation email.",
  "Seasonal promotions are announced first to members and on our public social channels.",
  "If your order arrives damaged, contact support within 48 hours with photos and we will arrange a replacement.",
  "Made-to-order and personalised items are final sale and cannot be returned unless faulty.",
  "We accept all major credit cards, digital wallets and buy-now-pay-later through our checkout partners.",
  "Sustainability is core to our design process and all packaging is 100% recyclable or compostable.",
  "Frequently asked questions cover tracking, address changes, cancellations, duties, gift wrapping and assembly.",
  "Our design studio is based in Portland, Oregon and every collection is developed in-house.",
  "Warranty claims can be filed from your account dashboard or by contacting support with your order number.",
  "Wholesale partners receive volume pricing, co-branded packaging and marketing assets.",
];

export function buildWebsitePages(limit = 28): DiscoveredPage[] {
  return websitePageCatalog.slice(0, limit).map((page, index) => ({
    id: `page_${index + 1}`,
    title: page.title,
    path: page.path,
    status: "pending",
    words: 180 + ((index * 137) % 940),
    blocks: 18 + ((index * 29) % 74),
  }));
}

export function buildFacebookSections(): DiscoveredPage[] {
  return facebookSectionCatalog.map((page, index) => ({
    id: `fb_${index + 1}`,
    title: page.title,
    path: page.path,
    status: "pending",
    words: 90 + ((index * 83) % 420),
    blocks: 6 + ((index * 13) % 24),
  }));
}

export function buildDatabaseTables(limit = 12): DiscoveredPage[] {
  return databaseTableCatalog.slice(0, limit).map((table, index) => ({
    id: `tbl_${index + 1}`,
    title: table.title,
    path: table.path,
    status: "pending",
    words: 400 + ((index * 311) % 3200),
    blocks: 900 + ((index * 731) % 6400),
  }));
}

export function buildDocumentSections(limit = 10): DiscoveredPage[] {
  return documentSectionCatalog.slice(0, limit).map((section, index) => ({
    id: `doc_${index + 1}`,
    title: section.title,
    path: section.path,
    status: "pending",
    words: 120 + ((index * 97) % 520),
    blocks: 6 + ((index * 11) % 22),
  }));
}

export function buildChunks(count: number, sourceName: string): ChunkPreview[] {
  const previewCount = Math.min(count, 24);
  return Array.from({ length: previewCount }).map((_, index) => {
    const template = chunkTemplates[index % chunkTemplates.length];
    const page =
      websitePageCatalog[index % websitePageCatalog.length]?.title ??
      facebookSectionCatalog[index % facebookSectionCatalog.length]?.title ??
      "Overview";
    return {
      id: `chunk_${index + 1}`,
      index: index + 1,
      pageTitle: page,
      tokens: 96 + ((index * 47) % 180),
      text: `${sourceName}: ${template}`,
      score: undefined,
    };
  });
}

export function buildContentSections(
  sourceId: string,
  pages: DiscoveredPage[],
): ExtractedSection[] {
  return pages.map((page, index) => {
    const text =
      pageContent[page.title] ?? chunkTemplates[index % chunkTemplates.length];
    return {
      id: `sec_${sourceId}_${page.id}`,
      sourceId,
      pageTitle: page.title,
      heading: page.title,
      text,
      words: text.split(/\s+/).filter(Boolean).length,
    };
  });
}

export function estimateCounts(seed: string, type: KnowledgeSourceType) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  switch (type) {
    case "website": {
      const pages = 22 + (hash % 12);
      const blocks = pages * (44 + (hash % 18));
      return { pages, blocks, chunks: blocks * 4 };
    }
    case "facebook": {
      const blocks = 380 + (hash % 140);
      return { pages: 8, blocks, chunks: blocks * 4 };
    }
    case "document": {
      const pages = 10;
      const blocks = 90 + (hash % 160);
      return { pages, blocks, chunks: blocks * 3 };
    }
    case "database": {
      const tables = 12;
      const rows = 42000 + (hash % 12000);
      const chunks = tables * (240 + (hash % 60));
      return { pages: tables, blocks: rows, chunks };
    }
    default: {
      const pages = 22 + (hash % 12);
      const blocks = pages * (44 + (hash % 18));
      return { pages, blocks, chunks: blocks * 4 };
    }
  }
}
