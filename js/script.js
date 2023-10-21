'use strict';

// Data
const account1 = {
  owner: 'Denis Obote',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Brian Lutalo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Smith Nokrach',
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
const displayMovements = (movements) => {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
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
displayMovements(account1.movements);

// Calculate balance, incomes, debts and interest
const calculateBalance = (movements) => {
  return movements.reduce((acc, cur) => acc + cur);
};

const calculateIncomes = (movements) => {
  return movements
    .filter((mvt) => mvt > 0)
    .reduce((acc, income) => acc + income);
};

const calculateDebts = (movements) => {
  return Math.abs(
    movements.filter((mvt) => mvt < 0).reduce((acc, debt) => acc + debt)
  );
};

const calculateInterest = (movements) => {
  return movements
    .filter((mvt) => mvt > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, cur) => acc + cur);
};

// Display balance
const displayBalance = () => {
  labelBalance.textContent = `${calculateBalance(account1.movements)}€`;
};
displayBalance();

// Display income, debts and interest
const displaySummary = () => {
  labelSumIn.textContent = `${calculateIncomes(account1.movements)} €`;
  labelSumOut.textContent = `${calculateDebts(account1.movements)}€`;
  labelSumInterest.textContent = `${calculateInterest(account1.movements)}€`;
};
displaySummary();

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
