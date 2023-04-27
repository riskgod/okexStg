const axios = require('axios');
const math = require('mathjs');

const OKEX_API_URL = 'https://www.okex.com/api/v5/market/candles?instId={instrument_id}&after={start_time}&before={end_time}&bar=60';
const TWO_WEEKS_MS = 2 * 7 * 24 * 60 * 60 * 1000;

// 替换为您感兴趣的交易对，例如："BTC-USDT"
const instrument_id = 'BTC-USDT';

async function calculateStdDevMinuteClosePrice() {
  try {
    const startTime = Math.floor((Date.now() - TWO_WEEKS_MS) / 1000);
    const endTime = Math.floor(Date.now() / 1000);

    const response = await axios.get(
      OKEX_API_URL.replace('{instrument_id}', instrument_id)
        .replace('{start_time}', startTime)
        .replace('{end_time}', endTime)
    );
    const data = response.data.data;

    const closePrices = data.map(item => parseFloat(item[4]));
    const priceChanges = closePrices.slice(1).map((price, index) => (price - closePrices[index]) / closePrices[index]);

    const stdDev = math.std(priceChanges, 'uncorrected');

    console.log(`Standard Deviation of Close Price Changes for ${instrument_id} in the Last 2 Weeks:`);
    console.log(stdDev);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

calculateStdDevMinuteClosePrice();
