import type { ChunkPreview, DiscoveredPage } from "@/types/crawler";
import type { ExtractedSection } from "@/types/knowledge";

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

export function estimateCounts(seed: string, type: "website" | "facebook") {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  if (type === "website") {
    const pages = 22 + (hash % 12);
    const blocks = pages * (44 + (hash % 18));
    const chunks = blocks * 4;
    return { pages, blocks, chunks };
  }
  const sections = 8;
  const blocks = 380 + (hash % 140);
  const chunks = blocks * 4;
  return { pages: sections, blocks, chunks };
}
