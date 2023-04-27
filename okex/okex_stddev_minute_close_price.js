const axios = require('axios');
const { std } = require('mathjs');

const OKEX_API_URL = 'https://www.okex.com/api/spot/v3/instruments/{instrument_id}/candles?granularity=60&start={start_time}&end={end_time}';
const TWO_WEEKS_MS = 2 * 7 * 24 * 60 * 60 * 1000;

// 替换为您感兴趣的交易对，例如："BTC-USDT"
const instrument_id = 'BTC-USDT';

async function calculateStdDevMinuteClosePrice() {
  try {
    const startTime = new Date(Date.now() - TWO_WEEKS_MS).toISOString();
    const endTime = new Date().toISOString();

    const response = await axios.get(
      OKEX_API_URL.replace('{instrument_id}', instrument_id)
        .replace('{start_time}', startTime)
        .replace('{end_time}', endTime)
    );
    const data = response.data;

    const closePrices = data.map(item => parseFloat(item[4]));
    const priceChanges = closePrices.slice(1).map((price, index) => (price - closePrices[index]) / closePrices[index]);

    const stdDev = std(priceChanges);

    console.log(`Standard Deviation of Close Price Changes for ${instrument_id} in the Last 2 Weeks:`);
    console.log(stdDev);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

calculateStdDevMinuteClosePrice();
