export type DigloProductGroup = {
  title: string;
  service: string;
  items: string[];
};

export const PRODUCT_GROUPS: DigloProductGroup[] = [
  {
    title: "PPE",
    service: "PPE",
    items: [
      "Safety Helmet White",
      "Hi-Vis Vest Orange",
      "Safety Boots",
      "Safety Gloves",
      "Reflective Jacket",
      "Safety Goggles",
    ],
  },
  {
    title: "Uniforms & Apparel",
    service: "Corporate Uniforms",
    items: [
      "Corporate Polo Shirt",
      "Security Uniform Set",
      "Work Overalls",
      "Branded T-Shirt",
      "Reflective Work Jacket",
    ],
  },
  {
    title: "Printing & Branding",
    service: "Printing Services",
    items: [
      "Printed Banner",
      "Business Cards",
      "Company Stamp",
      "Branded Packaging",
      "Large Format Printing",
    ],
  },
  {
    title: "Promotional Gifts",
    service: "Gift Packs",
    items: [
      "Branded Mug",
      "Branded Notebook",
      "Branded Pen",
      "Branded Water Bottle",
      "Branded Tote Bag",
    ],
  },
  {
    title: "Safety Kits",
    service: "PPE",
    items: [
      "Hard Hat + Vest Combo",
      "Full Construction PPE Kit",
      "Security Guard Kit",
    ],
  },
];

export function productDetails(product: string) {
  const group = PRODUCT_GROUPS.find((item) => item.items.includes(product));
  return {
    category: group?.title ?? "",
    service: group?.service ?? "",
  };
}

export function quotePath(product = "", category = "", service = "") {
  const params = new URLSearchParams();
  if (product) params.set("product", product);
  if (category) params.set("category", category);
  if (service) params.set("service", service);
  const query = params.toString();
  return query ? `/quote?${query}` : "/quote";
}

export function productQuotePath(product: string) {
  const details = productDetails(product);
  return quotePath(product, details.category, details.service);
}
