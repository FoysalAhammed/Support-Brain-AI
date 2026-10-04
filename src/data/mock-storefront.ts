export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  tag?: string;
}

export interface StoreFeature {
  id: string;
  title: string;
  description: string;
}

/**
 * Mock content for the standalone "Northwind Store" demo site used to show the
 * chat widget embedded on a customer's own website. This is third-party demo
 * content, not SupportBrain app data.
 */
export const storeProducts: StoreProduct[] = [
  { id: "p1", name: "Alder Lounge Chair", category: "Living", price: 429, rating: 4.8, tag: "Bestseller" },
  { id: "p2", name: "Marlow Oak Table", category: "Dining", price: 689, rating: 4.7 },
  { id: "p3", name: "Sable Floor Lamp", category: "Lighting", price: 149, rating: 4.6, tag: "New" },
  { id: "p4", name: "Linen Weave Sofa", category: "Living", price: 1290, rating: 4.9 },
  { id: "p5", name: "Cove Ceramic Vase", category: "Decor", price: 59, rating: 4.5 },
  { id: "p6", name: "Pebble Wool Rug", category: "Living", price: 320, rating: 4.7 },
];

export const storeFeatures: StoreFeature[] = [
  { id: "f1", title: "Free carbon-neutral shipping", description: "On every order over $75 — delivered in 2-4 business days." },
  { id: "f2", title: "60-day returns", description: "Changed your mind? Send it back within 60 days for a full refund." },
  { id: "f3", title: "5-year guarantee", description: "Every piece is covered against manufacturing faults." },
];

export const storeDepartments = ["Living", "Dining", "Lighting", "Decor", "Sale"];
