const axios = require('axios');
const { addNumbers, multiplyNumbers, subtractNumbers, divideNumbers } = require('./bignumber')
const baseUrl = 'https://www.okex.com';
const path = '/api/v5/market/candles';

async function getHistory(instrumentId, granularity, days) {
  const currentTime = new Date();
  const endTime = currentTime.toISOString();
  const startTime = new Date(currentTime.getTime() - granularity * days * 1000).toISOString();

  const url = `${baseUrl}${path}?instId=${instrumentId}&start=${startTime}&end=${endTime}&granularity=${granularity}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data.data
    } else {
      console.error('Error getting history:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error getting history:', error);
  }
}

async function main() {
  // const data = await getHistory('BTC-USDT', 86400, 90);
  const data = [
    7.3207, 7.3685, 7.498, 8.9553, 9.7815, 9.5293, 8.7863,
    9.1951, 8.7013, 8.1845, 7.9532, 7.8049, 7.9439, 8.1925,
    7.3707, 7.2328, 7.6532, 7.6249, 7.3095, 7.0006, 5.3762,
    3.9626, 5.1534, 5.1841, 4.5473, 4.2196, 4.1925, 4.3346,
    4.5005, 4.6604, 4.7177, 4.6226, 4.1024, 4.0637, 4.3163,
    4.443, 4.4382, 4.4259, 4.7686, 4.7944, 4.4789, 4.6722,
    4.7718, 4.6546, 4.8985, 5.1137, 5.1829, 5.1613, 5.0491,
    4.818, 4.9177, 4.8072, 4.784, 4.6637, 4.5282, 4.6222,
    4.6975, 4.6676, 4.0479, 4.0906, 4.0537, 3.8075, 3.896,
    3.7683, 3.7102, 3.7507, 3.695, 3.5779, 3.6449, 3.5972,
    3.2357, 3.2093, 3.4186, 3.4473, 3.5214, 3.7598, 3.8219,
    3.8128, 3.7097, 3.858, 3.8329, 3.932, 5.2121, 5.4872,
    5.295, 6.4591, 6.8115, 7.7058, 7.9255, 8.1318, 7.6105,
    7.6196, 7.8741, 10.9471, 11.7565, 13.3033, 12.6744, 12.3404,
    18.38, 18.1429]
  console.log("btc price  ",)
  const results = [];
  let sourceBalance = "1000"
  let holderBtc = "0"

  for (let i = 0; i < data.length; i++) {
    // if () 波动比例大于2 个点 data 重新rebalance
    // const percentage = ((data - data[i - 1]) / data) * 100;

    // if (percentage > 2) {

    // }
    const [s, h] = myStrategy(data[i], sourceBalance, holderBtc, data[i - 1])
    sourceBalance = s;
    holderBtc = h
    results.push(s);

  }
  console.log(results);
}

function myStrategy(data, sourceBalance, holderBtc, lastDayPrice) {
  // console.log("sourceBalance   ", sourceBalance)
  // console.log("holderBtc    ", holderBtc)
  const yingli = data * holderBtc - lastDayPrice * holderBtc

  if (yingli > 20) {
    const s = sourceBalance - ((sourceBalance - holderBtc * data) / 2)
    // const h = holderBtc + ((sourceBalance - holderBtc * data) / 2) / data

    const holderTimesData = multiplyNumbers(holderBtc, data)
    const h = addNumbers(holderBtc, divideNumbers(divideNumbers(subtractNumbers(sourceBalance, holderTimesData), 2), data))

    if (holderBtc = 0) {
      return [500, 500 / data]
    } else {
      return [s, h]
    }

  }

}

main()