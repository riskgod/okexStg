require('dotenv').config();
const axios = require('axios');
const CryptoJS = require('crypto-js');

const apiKey = process.env.OKEX_API_KEY;
const secretKey = process.env.OKEX_SECRET_KEY;
const passphrase = process.env.OKEX_PASSPHRASE;

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

async function executeStrategy() {
  // 获取历史K线数据
  const symbol = 'BTC-USDT';
  const granularity = '1D'; // 1天的K线
  const currentTime = new Date();
  const startTime = new Date(currentTime.getTime() - (90 * 24 * 60 * 60 * 1000)).getTime();
  const endTime = currentTime.getTime();

  const candleData = await getCandleData(symbol, granularity, startTime, endTime);

  // 在此处实现您的维加斯隧道策略逻辑

  // 示例：计算移动平均线
  const movingAverage = (data, windowSize) => {
    const result = [];
    for (let i = windowSize - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += parseFloat(data[i - j][4]); // 取得K线的收盘价
      }
      result.push(sum / windowSize);
    }
    return result;
  };

  const sma5 = movingAverage(candleData, 5);
  const sma10 = movingAverage(candleData, 10);

  console.log('5-day Simple Moving Average:', sma5);
  console.log('10-day Simple Moving Average:', sma10);

  // 在此处根据策略信号执行交易操作，例如买入、卖出等
}

executeStrategy();
