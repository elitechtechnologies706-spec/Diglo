import { expect, test } from "@playwright/test";

const productCases = [
  {
    testId: "link-product-corporate-gift-boxes",
    product: "Corporate Gift Boxes",
    service: "Gift Packs",
    serviceName: "Gift Packs",
    sectionId: "service-gift-packs",
  },
  {
    testId: "link-product-polo-shirts",
    product: "Polo Shirts",
    service: "Uniforms",
    serviceName: "Corporate Uniforms",
    sectionId: "service-corporate-uniforms",
  },
  {
    testId: "link-product-safety-helmets",
    product: "Safety Helmets",
    service: "PPE",
    serviceName: "PPE",
    sectionId: "service-ppe",
  },
  {
    testId: "link-product-business-cards",
    product: "Business Cards",
    service: "Printing",
    serviceName: "Printing Services",
    sectionId: "service-printing-services",
  },
] as const;

const groupNames = ["GIFT PACKS", "CORPORATE UNIFORMS", "PPE & SAFETY", "PRINTING"];

async function expectProductDestination(
  page: import("@playwright/test").Page,
  product: (typeof productCases)[number],
) {
  const url = new URL(page.url());
  expect(url.searchParams.get("service")).toBe(product.service);
  expect(url.searchParams.get("product")).toBe(product.product);
  expect(url.hash).toBe(`#${product.sectionId}`);
  await expect(page.getByTestId("text-selected-product")).toContainText(product.product);
  const serviceCard = page.locator('[data-testid^="card-service-"]');
  await expect(serviceCard).toHaveCount(1);
  await expect(serviceCard.getByRole("heading", { name: product.serviceName, level: 3 })).toBeVisible();
}

test("desktop hover and keyboard focus reveal all product groups and links filter services", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const mainNavigation = page.getByRole("navigation", { name: "Main navigation" });
  const productsButton = page.getByTestId("button-products-desktop");
  await productsButton.hover();
  for (const groupName of groupNames) {
    await expect(mainNavigation.getByRole("heading", { name: groupName, exact: true })).toBeVisible();
  }

  await page.mouse.move(0, 0);
  await productsButton.focus();
  await expect(productsButton).toBeFocused();
  for (const groupName of groupNames) {
    await expect(mainNavigation.getByRole("heading", { name: groupName, exact: true })).toBeVisible();
  }

  for (const product of productCases) {
    await page.goto("/");
    await productsButton.hover();
    await mainNavigation.getByTestId(product.testId).click();
    await expectProductDestination(page, product);
  }
});

test("mobile accordion expands, collapses, and routes every product to its service", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByTestId("button-menu").click();

  const mobileNavigation = page.getByRole("navigation", { name: "Mobile navigation" });
  const productsButton = page.getByTestId("button-products-mobile");
  await expect(productsButton).toHaveAttribute("aria-expanded", "false");
  await productsButton.click();
  await expect(productsButton).toHaveAttribute("aria-expanded", "true");
  for (const groupName of groupNames) {
    await expect(mobileNavigation.getByRole("heading", { name: groupName, exact: true })).toBeVisible();
  }

  await productsButton.click();
  await expect(productsButton).toHaveAttribute("aria-expanded", "false");
  for (const groupName of groupNames) {
    await expect(mobileNavigation.getByRole("heading", { name: groupName, exact: true })).toBeHidden();
  }

  for (const product of productCases) {
    await page.goto("/");
    await page.getByTestId("button-menu").click();
    await page.getByTestId("button-products-mobile").click();
    await mobileNavigation.getByTestId(product.testId).click();
    await expect(mobileNavigation.getByTestId(product.testId)).toBeHidden();
    await expectProductDestination(page, product);
  }
});

test("About Us works from desktop navigation, mobile navigation, and the footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByTestId("link-nav-about").click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "Meet the Team" })).toBeVisible();

  await page.goto("/");
  await page.getByTestId("link-footer-about").click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "Meet the Team" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByTestId("button-menu").click();
  await page.getByTestId("link-menu-about").click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "Meet the Team" })).toBeVisible();
});
