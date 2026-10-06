// SMART INVENTORY MANAGEMENT
// Application Logic

// Store all products entered
let products = [];

// SCROLL TO INVENTORY

function scrollToInventory() {
  document.getElementById("inventory").scrollIntoView({
    behavior: "smooth",
  });
}

// ADD PRODUCT

function addProduct(product = null) {
  const tableBody = document.getElementById("productTableBody");

  const row = document.createElement("tr");

  row.innerHTML = `
        <td>
            <input
                type="text"
                class="product-name"
                placeholder="Product name"
                value="${product ? product.name : ""}"
            >
        </td>

        <td>
            <input
                type="number"
                class="product-storage"
                min="1"
                placeholder="0"
                value="${product ? product.storage : ""}"
            >
        </td>

        <td>
            <input
                type="number"
                class="product-cost"
                min="0"
                placeholder="0"
                value="${product ? product.cost : ""}"
            >
        </td>

        <td>
            <input
                type="number"
                class="product-selling"
                min="0"
                placeholder="0"
                value="${product ? product.selling : ""}"
            >
        </td>

        <td>
            <input
                type="number"
                class="product-demand"
                min="1"
                placeholder="0"
                value="${product ? product.demand : ""}"
            >
        </td>

        <td class="expected-profit">
            ₹0
        </td>

        <td>
            <button
                class="delete-btn"
                onclick="removeProduct(this)"
            >
                ×
            </button>
        </td>
    `;

  tableBody.appendChild(row);

  // Adding listeners to calculate profit automatically
  const inputs = row.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => calculateRowProfit(row));
  });

  calculateRowProfit(row);
}

// REMOVE PRODUCT

function removeProduct(button) {
  const row = button.closest("tr");

  row.remove();
}

// CALCULATE EXPECTED PROFIT

function calculateRowProfit(row) {
  const cost = Number(row.querySelector(".product-cost").value) || 0;

  const selling = Number(row.querySelector(".product-selling").value) || 0;

  const demand = Number(row.querySelector(".product-demand").value) || 0;

  const profitPerUnit = selling - cost;

  const expectedProfit = profitPerUnit * demand;

  row.querySelector(".expected-profit").textContent =
    formatCurrency(expectedProfit);
}

// LOAD DEMO DATA

function loadDemoData() {
  const tableBody = document.getElementById("productTableBody");

  tableBody.innerHTML = "";

  document.getElementById("warehouseCapacity").value = 10;

  const demoProducts = [
    {
      name: "Laptop",
      storage: 5,
      cost: 40000,
      selling: 45000,
      demand: 5,
    },

    {
      name: "Headphones",
      storage: 2,
      cost: 2000,
      selling: 3000,
      demand: 8,
    },

    {
      name: "Keyboard",
      storage: 3,
      cost: 1500,
      selling: 2500,
      demand: 6,
    },

    {
      name: "Monitor",
      storage: 6,
      cost: 15000,
      selling: 18000,
      demand: 4,
    },

    {
      name: "Mouse",
      storage: 1,
      cost: 500,
      selling: 800,
      demand: 10,
    },
  ];

  demoProducts.forEach((product) => {
    addProduct(product);
  });

  updateProductCount();
  updateCapacityDisplay();
}

// READ PRODUCTS FROM TABLE

function getProductsFromTable() {
  const rows = document.querySelectorAll("#productTableBody tr");

  const products = [];

  rows.forEach((row) => {
    const name = row.querySelector(".product-name").value.trim();

    const storage = Number(row.querySelector(".product-storage").value);

    const cost = Number(row.querySelector(".product-cost").value);

    const selling = Number(row.querySelector(".product-selling").value);

    const demand = Number(row.querySelector(".product-demand").value);

    if (name && storage > 0 && cost >= 0 && selling >= 0 && demand > 0) {
      const expectedProfit = (selling - cost) * demand;

      products.push({
        name: name,

        storage: storage,

        cost: cost,

        selling: selling,

        demand: demand,

        expectedProfit: expectedProfit,
      });
    }
  });

  return products;
}

// OPTIMIZE INVENTORY

function optimizeInventory() {
  const capacity = Number(document.getElementById("warehouseCapacity").value);

  if (!capacity || capacity <= 0) {
    alert("Please enter a valid warehouse capacity.");

    return;
  }

  const products = getProductsFromTable();

  if (products.length === 0) {
    alert("Please add at least one valid product.");

    return;
  }

  // Running the 0/1 Knapsack algorithm
  const result = knapsack(products, capacity);

  // Displaying the results
  displayResults(result, products, capacity);

  // Scroll to results
  document.getElementById("results").scrollIntoView({
    behavior: "smooth",
  });
}

// DISPLAY RESULTS

function displayResults(result, products, capacity) {
  const selectedProducts = result.selectedProducts;

  const selectedNames = new Set(
    selectedProducts.map((product) => product.name),
  );

  // Maximum profit
  document.getElementById("maxProfit").textContent = formatCurrency(
    result.maxProfit,
  );

  // Calculate storage used
  const storageUsed = selectedProducts.reduce(
    (total, product) => total + product.storage,
    0,
  );

  document.getElementById("storageUsed").textContent = storageUsed;

  document.getElementById("storageTotal").textContent = `/ ${capacity} units`;

  // Remaining capacity
  document.getElementById("remainingCapacity").textContent =
    capacity - storageUsed;

  // Update storage utilization
  const utilizationPercent = Math.round((storageUsed / capacity) * 100);

  document.getElementById("utilizationPercent").textContent =
    `${utilizationPercent}%`;

  document.getElementById("utilizationBar").style.width =
    `${utilizationPercent}%`;

  document.getElementById("utilizationUsed").textContent =
    `${storageUsed} units used`;

  document.getElementById("utilizationRemaining").textContent =
    `${capacity - storageUsed} units remaining`;

  // Status
  document.getElementById("optimizationStatus").textContent =
    "Optimization complete";

  // Result table
  const resultTable = document.getElementById("resultsTableBody");

  resultTable.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");

    const isSelected = selectedNames.has(product.name);

    row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.storage}</td>

            <td>
                ${formatCurrency(product.expectedProfit)}
            </td>

            <td>
                ${isSelected ? "✅ Selected" : "❌ Not Selected"}
            </td>

        `;

    resultTable.appendChild(row);
  });
}

// UPDATE PRODUCT COUNT

function updateProductCount() {
  const rows = document.querySelectorAll("#productTableBody tr");

  document.getElementById("productCount").textContent = rows.length;
}

// UPDATE CAPACITY DISPLAY

function updateCapacityDisplay() {
  const capacity = document.getElementById("warehouseCapacity").value;

  document.getElementById("capacityDisplay").textContent = capacity || 0;
}

// FORMAT CURRENCY

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// INITIAL SETUP

document.addEventListener("DOMContentLoaded", () => {
  // Updating capacity when user changes it
  document
    .getElementById("warehouseCapacity")
    .addEventListener("input", updateCapacityDisplay);

  // Updating product count whenever products change
  document
    .getElementById("productTableBody")
    .addEventListener("input", updateProductCount);
});
