const axios = require('axios');

const OKEX_API_URL = 'https://www.okex.com/api/v5/market/candles?instId={instrument_id}&startTime={start_time}&endTime={end_time}&bar=1H';
const TWO_WEEKS_MS = 2 * 7 * 24 * 60 * 60 * 1000;

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

async function calculateTotalTradingVolume() {
  try {
    const startTimestamp = Math.floor((Date.now() - TWO_WEEKS_MS) / 1000);
    const endTimestamp = Math.floor(Date.now() / 1000);

    const data = await fetchCandles(startTimestamp, endTimestamp);

    if (!data || data.length === 0) {
      console.error('No data received from OKEx API.');
      return;
    }

    const tradingVolumes = data.map(item => parseFloat(item[5]));
    const totalTradingVolume = tradingVolumes.reduce((sum, volume) => sum + volume, 0);

    console.log(`Total Trading Volume for ${instrument_id} in the Last 2 Weeks:`);
    console.log(totalTradingVolume);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

calculateTotalTradingVolume();
