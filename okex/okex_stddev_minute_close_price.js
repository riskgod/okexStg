const axios = require('axios');
const math = require('mathjs');

const OKEX_API_URL = 'https://www.okex.com/api/v5/market/candles?instId={instrument_id}&after={start_time}&before={end_time}&bar=1m';
const TWO_WEEKS_MS = 2 * 7 * 24 * 60 * 60 * 1000;
const REQUEST_INTERVAL_MS = 6 * 60 * 60 * 1000; // 请求6小时的数据

// 替换为您感兴趣的交易对，例如："BTC-USDT"
const instrument_id = 'BTC-USDT';

async function fetchCandles(startTime, endTime) {
  const response = await axios.get(
    OKEX_API_URL.replace('{instrument_id}', instrument_id)
      .replace('{start_time}', startTime)
      .replace('{end_time}', endTime)
  );
  return response.data.data;
}

async function calculateStdDevMinuteClosePrice() {
  try {
    const startTimestamp = Math.floor((Date.now() - TWO_WEEKS_MS) / 1000);
    const endTimestamp = Math.floor(Date.now() / 1000);
    let currentTime = startTimestamp;

    let allData = [];

    while (currentTime < endTimestamp) {
      const nextTime = Math.min(currentTime + REQUEST_INTERVAL_MS / 1000, endTimestamp);
      const data = await fetchCandles(currentTime, nextTime);

      if (!data || data.length === 0) {
        console.error('No data received from OKEx API for time range:', currentTime, nextTime);
        return;
      }

      allData = allData.concat(data);
      currentTime = nextTime;
    }

    const closePrices = allData.map(item => parseFloat(item[4]));

    if (closePrices.length === 0) {
      console.error('Close prices array is empty.');
      console.log(allData);
      return;
    }

    const priceChanges = closePrices.slice(1).map((price, index) => (price - closePrices[index]) / closePrices[index]);
    const stdDev = math.std(priceChanges, 'uncorrected');

    console.log(`Standard Deviation of Close Price Changes for ${instrument_id} in the Last 2 Weeks:`);
    console.log(stdDev);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

calculateStdDevMinuteClosePrice();
