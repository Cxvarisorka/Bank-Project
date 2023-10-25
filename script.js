'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const accounts = [];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerPopup = document.querySelector('.popup')

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogout = document.querySelector('.logout__btn');
const btnConfirm = document.querySelector('.confirm__btn');
const btnClosePopup = document.querySelector('#close-popup');
const btnCreateAcc = document.querySelector('.create__acc');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputNewName = document.querySelector('#create-from--name');
const inputNewlastname = document.querySelector('#create-from--lastname');
const inputNewPin = document.querySelector('#create-from--pin');

const updateUI = function(currentAccount){
  // Display Movements
  displayMovements(currentAccount);

  // Display Balance
  calcDisplayBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);

}

const getFormatTime = function(){

  const now = new Date();
  const locale = navigator.language;

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long'
  }

  return new Intl.DateTimeFormat(locale,options).format(now);
}

// Count Down

let timerInterval;

let currentTime = 300;
let time = currentTime;

const updateTimerUI = function(){
  const minutes = String(parseInt(currentTime / 60));
  const seconds = String(currentTime % 60);
  labelTimer.textContent = `${minutes}:${seconds.padStart(2,0)}`;
}

const countdown = function(){
  if(currentTime > 0){
    currentTime--;
    console.log(currentTime)
    updateTimerUI(currentTime);
  } else{

    clearInterval(timerInterval);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Log in to get started';
    opacityChangerLogin('block');

    console.log('Timer Ended')
  }
}

const startTimer = function(){
  clearInterval(timerInterval);
  currentTime = time;
  updateTimerUI();
  timerInterval = setInterval(countdown,1000);
}

const getCurrentDate = function(){
  const now  = new Date();

  const paddStart = function(word){
    return `${word}`.padStart(2,0)
  }

  return {
    day: paddStart(now.getDate()),
    month: paddStart(now.getMonth() + 1),
    year: now.getFullYear(),
    hour: paddStart(now.getHours()),
    minute: paddStart(now.getMinutes())
  };
}

const opacityChangerLogin = function(value){
  inputLoginPin.style.display = value;
  inputLoginUsername.style.display = value;
  btnLogin.style.display = value;
  btnLogout.style.display = value === 'none' ? 'block' : 'none';
}

const createAccount = function(accs){
  accs.forEach(function(acc){

    // Add new property to acc obj
    acc.username = acc.owner.toLowerCase().split(' ').map((word) => word.at(0)).join('');
  })
}

const calcDisplayBalance = function(acc){
  let resultBalance = acc.movements.reduce((acc,sum) => acc + sum, 0);

  const balanceWithoutFormat = resultBalance;

  const userLanguage = window.navigator.language;
  // Format value to read easy
  resultBalance = new Intl.NumberFormat(userLanguage).format(resultBalance);

  acc.balance = balanceWithoutFormat;
  labelBalance.textContent = `${resultBalance}€`;
}

const calcDisplaySummary = function(acc){
  let incomes = Math.floor(
    acc.movements
    .filter((item) => item > 0)
    .reduce((acc,cur) => acc + cur , 0)
  );

  let outcome = Math.floor(
    acc.movements
    .filter((item) => item < 0)
    .reduce((acc,cur) => acc + cur, 0)
  );

  const interest = acc.movements.filter((item) => item > 0).map((item) => (item * acc.interestRate) / 100).filter((item) => item >= 1).reduce((acc,cur) => acc + cur, 0);

  const userLanguage = window.navigator.language;

  // Format value to read easy
  incomes = new Intl.NumberFormat(userLanguage).format(incomes);
  outcome = new Intl.NumberFormat(userLanguage).format(outcome);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const displayMovements = function(acc,sort){
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements.slice();

  movs.forEach(function(value,index){
    
    const currentDate = acc.movementsDate.at(index);
    const displayDate = [currentDate.day,currentDate.month,currentDate.year].join('/') + ', ' + [currentDate.hour,currentDate.minute].join(':');

    console.log(currentDate);
    
    const movType = value > 0 ? 'deposit' : 'withdrawal';

    const userLanguage = window.navigator.language;

    // Format value to read easy
    value = new Intl.NumberFormat(userLanguage).format(value);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${index + 1} ${movType}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${value}€</div>
      </div>
    `

    containerMovements.insertAdjacentHTML('afterbegin',html)
  });
}

// Timer (NOt Working)

/*
const startLogOutTimer = function(){

  let time = 10;

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(Math.trunc(time % 60)).padStart(2,0);

    // In each call print remaining time
    labelTimer.textContent = `${min}:${sec}`;

    

    // If time == 0 the hide UI
    if(time == 0){
      clearInterval(timerInterval);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
      opacityChangerLogin('block');
    }

    // Decrease time by one each call
    time--;
  }

  tick();
  const timer = setInterval(tick,1000);
}
*/

// Event Handler



let currentAccount;

btnLogin.addEventListener('click',function(e){

  e.preventDefault(); // PreventDefault will terminate refresh when btn clicked
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Opacity 0 for input logins
    opacityChangerLogin('none');
    btnLogout.style.display = 'block';

    btnLogout.addEventListener('click',function(){
      containerApp.style.opacity = '0';
      clearInterval(timerInterval);
      labelWelcome.textContent = 'Log in to get started';
      opacityChangerLogin('block');
    });

    // Display Date

    // const currentDate = getCurrentDate();
    
    // const resultCurrentDate = [currentDate.day,currentDate.month,currentDate.year].join('/') + ', ' + [currentDate.hour,currentDate.minute].join(':');

    const fullDate = getFormatTime();

    labelDate.textContent = fullDate;

    // Display UI And Welcome Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = '1';

    // Start Timer
    startTimer();
    // startLogOutTimer(); Not working

    // Update UI
    updateUI(currentAccount);


  } else{
    labelWelcome.textContent = 'Sorry, we can\'t find your account.';
  }

  // Clear Login Inputs
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

});

const btnArr = [btnTransfer,btnLoan,btnClose];

btnArr.forEach((btn) => {
  btn.addEventListener('click',function(e){

    e.preventDefault()

    const classArr = [...this.classList];

    const currentDate = getCurrentDate();
    // const displayDate = [currentDate.day,currentDate.month,currentDate.year].join('/');
    
    if(classArr.includes('form__btn--transfer')){
      
      // Get amount and find acc in accounts arr
      const amount = Number(inputTransferAmount.value);
      const receiverAcc = accounts.find((cur) => cur.username == inputTransferTo.value);

      inputTransferAmount.value = inputTransferTo.value = '';

      // const curAccBalance = currentAccount.balance.filter((cur) => cur != ',')

      if(receiverAcc && amount > 0 && Number(currentAccount.balance) >= amount && receiverAcc.username !== currentAccount.username){
        // Doing The Transfers
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Getting Dates
        currentAccount.movementsDate.push(currentDate);
        receiverAcc.movementsDate.push(currentDate);

        console.log(receiverAcc)

        // UI Update
        updateUI(currentAccount);

      } else{
        console.log('Invalid Transaction');
      }
    }
    else if(classArr.includes('form__btn--loan')){
      const loanAmount = Number(inputLoanAmount.value);
      const deposit = currentAccount.movements.filter((cur) => cur > 0 && cur > loanAmount * 10 / 100);

      if(loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount / 10)){

        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDate.push(currentDate);

        setTimeout(function(){
          updateUI(currentAccount);
        },1500); 

      }
    }
    else{
      const accUsernameClose = inputCloseUsername.value;
      const accPinClose = Number(inputClosePin.value);

      if(accUsernameClose === currentAccount.username && accPinClose === currentAccount.pin){
        const index = accounts.findIndex(elem => elem.username === accUsernameClose);
        accounts.splice(index,1);
        
        clearInterval(timerInterval);

        containerApp.style.opacity = '0';
        labelWelcome.textContent = 'Log in to get started';
        opacityChangerLogin('block');
        

        inputCloseUsername.value = inputClosePin.value = '';
      }
    }

    console.log(currentAccount)
  });
})

let sort = false;

btnSort.addEventListener('click',function(){
  displayMovements(currentAccount, !sort);
  sort = !sort
});

btnClosePopup.addEventListener('click',function(){
  containerPopup.style.display = 'none';
});

btnCreateAcc.addEventListener('click',function(){
  containerPopup.style.display = 'flex';
});

const createUser = function(name,lastname,pin,interest){
  this.owner = `${name.slice(0,1).toUpperCase() + name.slice(1)} ${lastname.slice(0,1).toUpperCase() + lastname.slice(1)}`;
  this.pin = pin;
  this.movements = [500];
  this.interestRate = interest;
  this.movementsDate = [getCurrentDate()];
}

btnConfirm.addEventListener('click',function(e){
  e.preventDefault();

  const name = inputNewName.value;
  const lastname = inputNewlastname.value;
  const pin = Number(inputNewPin.value);
  const interest = (Math.random() * 3).toFixed(2);

  if(String(pin).length === 4){
    // Create obj with constructor
    const account = new createUser(name,lastname,pin,interest);

    // Add it in arr
    accounts.push(account);

    // Make abbr with this function 'lt'
    createAccount(accounts);

    // Alert That succesfully created
    alert('Account Succesfully Created!');

    // Display None register page
    containerPopup.style.display = 'none';

    // Make Inputs value to empty string
    inputNewName.value = '';
    inputNewlastname.value = '';
    inputNewPin.value = '';
  }
});

