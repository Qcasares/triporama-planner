import { test, expect } from '@playwright/test';

test.describe('Triporama Planner E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    // Wait for the app to load
    await page.waitForSelector('[data-testid="trip-planner"]', { timeout: 10000 });
  });

  test('Map Features', async ({ page }) => {
    // Test map loading
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();

    // Test adding location by clicking on map
    const mapContainer = page.locator('[data-testid="map-container"]');
    await mapContainer.click({ position: { x: 100, y: 100 } });
    await expect(page.locator('[data-testid="location-marker"]')).toBeVisible();
  });

  test('Trip Statistics', async ({ page }) => {
    // Navigate to stats tab
    await page.click('[data-testid="stats-tab"]');
    await expect(page.locator('[data-testid="trip-stats"]')).toBeVisible();
    
    // Check budget chart
    await expect(page.locator('[data-testid="budget-chart"]')).toBeVisible();
  });

  test('Weather Integration', async ({ page }) => {
    // Navigate to weather tab
    await page.click('[data-testid="weather-tab"]');
    
    // Check weather forecast
    await expect(page.locator('[data-testid="weather-forecast"]')).toBeVisible();
    await expect(page.locator('[data-testid="weather-card"]')).toBeVisible();
  });

  test('Trip Sharing', async ({ page }) => {
    // Open share dialog
    await page.click('[data-testid="share-trip-button"]');
    await expect(page.locator('[data-testid="share-dialog"]')).toBeVisible();
    
    // Test collaborator invitation
    await page.fill('[data-testid="collaborator-email-input"]', 'test@example.com');
    await page.click('[data-testid="invite-collaborator-button"]');
    await expect(page.locator('text=Invitation sent')).toBeVisible();
  });

  test('Packing List', async ({ page }) => {
    // Navigate to tools tab
    await page.click('[data-testid="tools-tab"]');
    
    // Add a packing item
    await page.fill('[data-testid="packing-item-input"]', 'Passport');
    await page.click('[data-testid="add-packing-item-button"]');
    
    // Verify item was added
    await expect(page.locator('text=Passport')).toBeVisible();
    
    // Check off the item
    await page.click('[data-testid="packing-item-checkbox"]');
    await expect(page.locator('[data-testid="packing-item-completed"]')).toBeVisible();
  });

  test('Currency Converter', async ({ page }) => {
    // Navigate to tools tab
    await page.click('[data-testid="tools-tab"]');
    
    // Convert currency
    await page.fill('[data-testid="currency-amount-input"]', '100');
    await page.selectOption('[data-testid="from-currency-select"]', 'USD');
    await page.selectOption('[data-testid="to-currency-select"]', 'EUR');
    
    // Check conversion result
    await expect(page.locator('[data-testid="converted-amount"]')).toBeVisible();
  });

  test('UI/UX Features', async ({ page }) => {
    // Test theme toggle
    await page.click('[data-testid="theme-toggle-button"]');
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Test responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test tab transitions
    await page.click('[data-testid="stats-tab"]');
    await expect(page.locator('[data-testid="tab-content"]')).toHaveClass(/opacity-100/);
  });
});
