const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/exchanges/okex';
const TWO_WEEKS_MS = 2 * 7 * 24 * 60 * 60 * 1000; // 两周的毫秒数

async function getTopTwentyUsdtTokens() {
  try {
    const response = await axios.get(COINGECKO_API_URL);
    const data = response.data.tickers;

    // 过滤USDT交易对和过去两周的数据
    const usdtTwoWeeksData = data.filter(item => {
      const timestamp = new Date(item.last_fetch_at).getTime();
      return item.target === 'USDT' && Date.now() - timestamp <= TWO_WEEKS_MS;
    });

    // 根据交易量对数据进行排序
    const sortedData = usdtTwoWeeksData.sort((a, b) => parseFloat(b.trade_volume_24h_btc_normalized) - parseFloat(a.trade_volume_24h_btc_normalized));

    // 获取排名前20的Token
    const topTwentyTokens = sortedData.slice(0, 20).map(item => ({
      symbol: item.base + '/' + item.target,
      tradingVolume: item.trade_volume_24h_btc_normalized,
    }));

    console.log('Top 20 USDT Tokens by Trading Volume in the Last 2 Weeks:');
    console.log(topTwentyTokens);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

getTopTwentyUsdtTokens();
