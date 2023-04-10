const axios = require('axios');
const baseUrl = 'https://www.okex.com';

async function getCandleData(symbol, granularity, startTime, endTime) {
  const path = `/api/v5/market/candles`;
  const url = `${baseUrl}${path}?instId=${symbol}&after=${startTime}&before=${endTime}&bar=${granularity}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data.data;
    } else {
      console.error('Error getting candle data:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error getting candle data:', error);
  }
}

async function getMonthlyCandles() {
  const symbol = 'BTC-USDT';
  const granularity = '60'; // 1 分钟的 K 线
  const currentTime = new Date();
  const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000)).getTime();
  const endTime = currentTime.getTime();

  const candleData = await getCandleData(symbol, granularity, startTime, endTime);
  const closePrices = candleData.map((candle) => parseFloat(candle[4]));

  console.log('1-Minute Candle Close Prices:', closePrices);
}

async function main() {
  const data = await getMonthlyCandles();
  console.log("btc price  len ", data.length)
  const results = [];
  let sourceBalance = "1000"
  let holderBtc = "0"

  for (let i = 0; i < data.length; i++) {
    // if () 波动比例大于2 个点 data 重新rebalance
    const percentage = ((data - data[i - 1]) / data) * 100;
    if (percentage > 1) {
      const [s, h] = myStrategy(data[i], sourceBalance, holderBtc, data[i - 1])
      sourceBalance = s;
      holderBtc = h
      results.push(s);
    }
  }
  console.log(results);
}
function myStrategy(data, sourceBalance, holderBtc, lastDayPrice) {
  // console.log("sourceBalance   ", sourceBalance)
  // console.log("holderBtc    ", holderBtc)
  // const yingli = data * holderBtc - lastDayPrice * holderBtc
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

main()