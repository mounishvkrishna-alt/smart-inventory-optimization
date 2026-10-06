/*
 * 0/1 Knapsack Algorithm
 * Smart Inventory Management
 *
 * weight  = storage requirement
 * value   = expected profit
 * capacity = warehouse capacity
 */

function knapsack(products, capacity) {
  const n = products.length;

  // DP table
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // Build the DP table
  for (let i = 1; i <= n; i++) {
    const product = products[i - 1];

    const weight = product.storage;
    const value = product.expectedProfit;

    for (let w = 0; w <= capacity; w++) {
      // Product does not fit
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      }

      // Product fits
      else {
        const exclude = dp[i - 1][w];

        const include = value + dp[i - 1][w - weight];

        dp[i][w] = Math.max(exclude, include);
      }
    }
  }

  // Maximum possible profit
  const maxProfit = dp[n][capacity];

  // Find selected products
  const selectedProducts = [];

  let w = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const product = products[i - 1];

      selectedProducts.push(product);

      w -= product.storage;
    }
  }

  // Return results
  return {
    maxProfit: maxProfit,
    selectedProducts: selectedProducts.reverse(),
    dpTable: dp,
  };
}
