const axios = require('axios');

const baseUrl = 'https://api.binance.com';

async function getCandleData(symbol, interval, startTime, endTime) {
  const path = `/api/v3/klines`;
  const url = `${baseUrl}${path}?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error getting candle data:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error getting candle data:', error);
  }
}

async function fetchCandlesInChunks(symbol, interval, startTime, endTime, chunkSize) {
  let currentStartTime = startTime;
  const results = [];

  while (currentStartTime < endTime) {
    const currentEndTime = Math.min(currentStartTime + chunkSize, endTime);
    const chunkData = await getCandleData(symbol, interval, currentStartTime, currentEndTime);
    results.push(...chunkData);
    currentStartTime = currentEndTime;
  }

  return results;
}

async function getMonthlyCandles() {
  const symbol = 'BTCUSDT';
  const interval = '1m'; // 1 分钟的 K 线
  const currentTime = new Date();
  // const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000)).getTime();
  // const endTime = currentTime.getTime();
  const startTime = '1667232000000'
  const endTime = '1669823999999'
  const chunkSize = 6 * 60 * 60 * 1000; // 每次获取 6 小时的数据

  const candleData = await fetchCandlesInChunks(symbol, interval, startTime, endTime, chunkSize);
  const closePrices = candleData.map((candle) => parseFloat(candle[4]));
  return closePrices

}

module.exports = {
  getMonthlyCandles
}
