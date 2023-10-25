'use strict';

// Data
const account1 = {
  owner: 'Joseph Arwata',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementDates: ['2019-11-18T21:31:17.178Z', '2019-12-23T07:42:02.383Z'],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Stella Akello',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementDates: ['2020-01-28T09:15:04.904Z', '2020-04-01T10:17:24.185Z'],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Denis Daniel Obua',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementDates: ['2020-05-08T14:11:59.604Z', '2020-05-27T17:01:17.194Z'],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Francis Ojok',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementDates: ['2020-07-11T23:36:17.929Z', '2020-07-12T10:51:36.790Z'],
  currency: 'USD',
  locale: 'en-US',
};

const account5 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 5555,

  movementDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account6 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 6666,

  movementDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4, account5, account6];

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

// Create current date and time
const showDateTime = () => {
  const now = new Date();
  const date = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const mins = `${now.getMinutes()}`.padStart(2, 0);
  const period = hour >= 12 ? 'pm' : 'am';
  labelDate.textContent = `${date}/${month}/${year}, ${hour}:${mins} ${period}`;
};

// Diplay movements
const displayMovements = (acct, sorted = false) => {
  containerMovements.innerHTML = '';

  const transactions = sorted
    ? acct.movements.slice().sort((a, b) => a - b)
    : acct.movements;

  transactions.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const time = new Date(acct.movementDates[i]);
    const date = `${time.getDate()}`.padStart(2, 0);
    const month = `${time.getMonth() + 1}`.padStart(2, 0);
    const year = time.getFullYear();
    const dateDisplay = `${date}/${month}/${year}`;

    const html = `
      <li class="movements__row">
        <span class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </span>
        <span class="movements__date">
          ${dateDisplay}
        </span>
        <span class="movements__value">
          ${mov.toFixed(2)}€
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
    .reduce((acc, cur) => acc + cur, 0);
};

// Display balance
const displayBalance = (acct) => {
  labelBalance.textContent = `${calculateBalance(acct).toFixed(2)}€`;
};

// Display income, debts and interest
const displaySummary = (acct) => {
  labelSumIn.textContent = `${calculateIncomes(acct).toFixed(2)}€`;
  labelSumOut.textContent = `${calculateDebts(acct).toFixed(2)}€`;
  labelSumInterest.textContent = `${calculateInterest(acct).toFixed(2)}€`;
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
  displayMovements(acct);
  displayBalance(acct);
  displaySummary(acct); // income, debts and interest
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
      acct.pin === +inputLoginPin.value
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

  // Show current date and time
  showDateTime();

  // Update UI
  updateUI(currentAccount);
});

// Transfer money
btnTransfer.addEventListener('click', (event) => {
  // Prevent form default
  event.preventDefault();

  const amount = Number(inputTransferAmount.value.trim());

  // Determine reciepientAccount account
  const reciepientAccount = accounts.find(
    (acct) => acct.username === inputTransferTo.value
  );

  // Transfer money
  if (
    reciepientAccount &&
    reciepientAccount.username !== currentAccount.username &&
    currentAccount.balance >= amount &&
    amount > 0
  ) {
    currentAccount.movements.push(-amount);
    reciepientAccount.movements.push(amount);

    // Clear transfer input fields
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    // Add transfer date
    currentAccount.movementDates.push(new Date().toISOString());
    reciepientAccount.movementDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

// Request loan
btnLoan.addEventListener('click', (event) => {
  event.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mvt) => mvt >= 0.1 * loanAmount)
  ) {
    currentAccount.movements.push(loanAmount); // Add movement
    currentAccount.movementDates.push(new Date().toISOString());

    updateUI(currentAccount); // Update UI

    // Clear input field
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// Close account
btnClose.addEventListener('click', (event) => {
  event.preventDefault();

  const inputUsername = inputCloseUsername.value;
  const inputPin = +inputClosePin.value;

  if (
    inputUsername === currentAccount.username &&
    inputPin === currentAccount.pin
  ) {
    // Delete account
    const deleteIndex = accounts.findIndex(
      (acct) => acct.username === inputUsername && acct.pin === inputPin
    );
    accounts.splice(deleteIndex, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

// Sort movements
let isSorted = false;
btnSort.addEventListener('click', (event) => {
  event.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
