'use strict';

// Data
const account1 = {
  owner: 'Joseph Arwata',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Stella Akello',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Denis Daniel Obua',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Francis Ojok',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const select = (selector) => document.querySelector(selector);

const labelWelcome = select('.welcome');
const labelDate = select('.date');
const labelBalance = select('.balance__value');
const labelSumIn = select('.summary__value--in');
const labelSumOut = select('.summary__value--out');
const labelSumInterest = select('.summary__value--interest');
const labelTimer = select('.timer');

const containerApp = select('.app');
const containerMovements = select('.movements');

const btnLogin = select('.login__btn');
const btnTransfer = select('.form__btn--transfer');
const btnLoan = select('.form__btn--loan');
const btnClose = select('.form__btn--close');
const btnSort = select('.btn--sort');

const inputLoginUsername = select('.login__input--user');
const inputLoginPin = select('.login__input--pin');
const inputTransferTo = select('.form__input--to');
const inputTransferAmount = select('.form__input--amount');
const inputLoanAmount = select('.form__input--loan-amount');
const inputCloseUsername = select('.form__input--user');
const inputClosePin = select('.form__input--pin');

// Diplay movements
const displayMovements = (acct) => {
  containerMovements.innerHTML = '';

  acct.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <li class="movements__row">
        <span class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </span>
        <span class="movements__value">
          ${mov}€
        </span>
      </li>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate balance, incomes, debts and interest
const calculateBalance = (acct) => {
  acct.balance = acct.movements.reduce((acc, cur) => acc + cur, 0);
  return acct.balance;
};

const calculateIncomes = (acct) => {
  return acct.movements
    .filter((mvt) => mvt > 0)
    .reduce((acc, income) => acc + income, 0);
};

const calculateDebts = (acct) => {
  return Math.abs(
    acct.movements.filter((mvt) => mvt < 0).reduce((acc, debt) => acc + debt, 0)
  );
};

const calculateInterest = (acct) => {
  return acct.movements
    .filter((mvt) => mvt > 0)
    .map((deposit) => (deposit * acct.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);
};

// Display balance
const displayBalance = (acct) => {
  labelBalance.textContent = `${calculateBalance(acct)}€`;
};

// Display income, debts and interest
const displaySummary = (acct) => {
  labelSumIn.textContent = `${calculateIncomes(acct)} €`;
  labelSumOut.textContent = `${calculateDebts(acct)}€`;
  labelSumInterest.textContent = `${calculateInterest(acct)}€`;
};

// Create usernames
const createUserNames = (accts) => {
  accts.forEach((acct) => {
    acct.username = acct.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUserNames(accounts);

// Update UI
const updateUI = (acct) => {
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displaySummary(currentAccount); // income, debts and interest
};

// Create login functionality
let currentAccount;

btnLogin.addEventListener('click', (event) => {
  // Prevent form default
  event.preventDefault();

  // Get current user's account
  currentAccount = accounts.find(
    (acct) =>
      acct.username === inputLoginUsername.value &&
      acct.pin === Number(inputLoginPin.value)
  );

  // Clear login input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  // Stop execution if no user is found
  if (!currentAccount) return;

  // Display welcome message
  labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}!`;

  // Display main page
  containerApp.style.opacity = 1;

  // Update UI
  updateUI();
});
