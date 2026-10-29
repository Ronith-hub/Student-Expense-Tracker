// ===================================================
// script.js - Student Expense Tracker
// Pure Vanilla JavaScript logic
// ===================================================

// 1. App State: Load expenses from browser localStorage, or default to an empty array
let expenses = JSON.parse(localStorage.getItem('student_expenses')) || [];

// 2. DOM Elements Selection
const form = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const categoryInput = document.getElementById('expense-category');
const dateInput = document.getElementById('expense-date');

const totalAmountDisplay = document.getElementById('total-amount');
const expenseList = document.getElementById('expense-list');
const emptyMessage = document.getElementById('empty-message');
const filterCategory = document.getElementById('filter-category');

// Category Totals Display Spans
const catTotalFood = document.getElementById('cat-total-food');
const catTotalTravel = document.getElementById('cat-total-travel');
const catTotalBooks = document.getElementById('cat-total-books');
const catTotalFun = document.getElementById('cat-total-fun');
const catTotalOther = document.getElementById('cat-total-other');

// Set today's date as default in the date input
dateInput.value = new Date().toISOString().split('T')[0];

// 3. Form Submit Event Handler (Add Expense)
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Stop the form from submitting and reloading the page

  // Read and clean values from inputs
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  // Validation Check: Ensure no field is empty and amount is positive
  if (!name) {
    alert('Error: Please enter an expense name (e.g., Canteen Lunch).');
    nameInput.focus();
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Error: Please enter a valid positive amount in rupees (greater than 0).');
    amountInput.focus();
    return;
  }

  if (!category) {
    alert('Error: Please select a category (Food, Travel, Books, Fun, or Other).');
    categoryInput.focus();
    return;
  }

  if (!date) {
    alert('Error: Please choose a valid date for this expense.');
    dateInput.focus();
    return;
  }

  // Create a new expense object
  const newExpense = {
    id: Date.now().toString(), // Unique timestamp ID for deletion
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  // Add the new expense to the top of our array
  expenses.unshift(newExpense);

  // Save to browser localStorage and update screen
  saveAndRender();

  // Reset form inputs for the next entry
  form.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
});

// 4. Function to Delete an Expense by its unique ID
function deleteExpense(id) {
  // Filter out the expense matching the clicked ID
  expenses = expenses.filter(item => item.id !== id);
  saveAndRender();
}

// 5. Function to Calculate Total Amount Spent
function updateTotalSpent() {
  const total = expenses.reduce((accumulator, item) => accumulator + item.amount, 0);
  totalAmountDisplay.textContent = total.toFixed(2);
}

// 6. Function to Calculate Spending for Each Category
function updateCategoryTotals() {
  // Initialize counters for all 5 categories
  const totals = {
    Food: 0,
    Travel: 0,
    Books: 0,
    Fun: 0,
    Other: 0
  };

  // Sum up expenses per category
  expenses.forEach(item => {
    if (totals[item.category] !== undefined) {
      totals[item.category] += item.amount;
    }
  });

  // Update numbers in the Category Breakdown Cards
  if (catTotalFood) catTotalFood.textContent = totals.Food.toFixed(2);
  if (catTotalTravel) catTotalTravel.textContent = totals.Travel.toFixed(2);
  if (catTotalBooks) catTotalBooks.textContent = totals.Books.toFixed(2);
  if (catTotalFun) catTotalFun.textContent = totals.Fun.toFixed(2);
  if (catTotalOther) catTotalOther.textContent = totals.Other.toFixed(2);
}

// 7. Function to Render the Expense List on the screen (Filtered by Category)
function renderExpenses() {
  // Clear the existing list contents
  expenseList.innerHTML = '';

  // Get currently selected category from the filter dropdown
  const selectedFilter = filterCategory ? filterCategory.value : 'all';

  // Filter expenses based on the selected dropdown value
  const itemsToDisplay = selectedFilter === 'all'
    ? expenses
    : expenses.filter(item => item.category === selectedFilter);

  // Show or hide empty message
  if (itemsToDisplay.length === 0) {
    emptyMessage.classList.remove('hidden');
    emptyMessage.textContent = selectedFilter === 'all'
      : 'No expenses found in "' + selectedFilter + '" category.';
  } else {
    emptyMessage.classList.add('hidden');

    // Create an <li> element for each filtered expense
    itemsToDisplay.forEach(item => {
      const li = document.createElement('li');
      li.className = 'expense-item';

      li.innerHTML = `
        <div class="item-info">
          <span class="item-name">${escapeHTML(item.name)}</span>
          <div class="item-details">
            <span class="category-tag tag-${item.category.toLowerCase()}">${item.category}</span>
            <span>· ${item.date}</span>
          </div>
        </div>
        <div class="item-right">
          <span class="item-amount">₹${item.amount.toFixed(2)}</span>
          <button class="delete-btn" onclick="deleteExpense('${item.id}')" title="Delete Expense">&times;</button>
        </div>
      `;

      expenseList.appendChild(li);
    });
  }
}

// Listen for changes on the Category Filter Dropdown
if (filterCategory) {
  filterCategory.addEventListener('change', renderExpenses);
}

// 8. Save to localStorage and update total, category breakdown, and list
function saveAndRender() {
  localStorage.setItem('student_expenses', JSON.stringify(expenses));
  updateTotalSpent();
  updateCategoryTotals();
  renderExpenses();
}

// Helper function to prevent Cross-Site Scripting (XSS)
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 9. Initial render when page loads
saveAndRender();
