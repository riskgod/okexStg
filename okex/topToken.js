const axios = require('axios');

const OKEX_API_URL = 'https://www.okex.com/api/spot/v3/instruments/ticker/24h';

async function getTopTenTokens() {
  try {
    const response = await axios.get(OKEX_API_URL);
    const data = response.data;

    // 根据交易量对数据进行排序
    const sortedData = data.sort((a, b) => parseFloat(b.quote_volume_24h) - parseFloat(a.quote_volume_24h));

    // 获取排名前十的Token
    const topTenTokens = sortedData.slice(0, 10).map(item => ({
      symbol: item.instrument_id,
      tradingVolume: item.quote_volume_24h,
    }));

    console.log('Top 10 Tokens by Trading Volume:');
    console.log(topTenTokens);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

getTopTenTokens();
