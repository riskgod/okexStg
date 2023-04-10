const BigNumber = require('bignumber.js');

function addNumbers(num1, num2) {
  const result = new BigNumber(num1).plus(num2);
  return result.toString();
}

function subtractNumbers(num1, num2) {
  const result = new BigNumber(num1).minus(num2);
  return result.toString();
}

function multiplyNumbers(num1, num2) {
  const result = new BigNumber(num1).times(num2);
  return result.toString();
}

function divideNumbers(num1, num2) {
  const result = new BigNumber(num1).dividedBy(num2);
  return result.toString();
}


module.exports = {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers
}