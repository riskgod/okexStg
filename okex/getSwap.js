const axios = require('axios');
const config = require('../config/index')

// const symbol = 'BTC-USDT-SWAP'; // 要查询的永续合约交易对
const endpoint = config.okexHost + '/api/v5/market/ticker'; // API 端点

// {
//     "code": "0",
//     "msg": "",
//     "data": [
//         {
//             "instType": "SWAP",
//             "instId": "BTC-USD-SWAP",
//             "last": "56956.1",
//             "lastSz": "3",
//             "askPx": "56959.1",
//             "askSz": "10582",
//             "bidPx": "56959",
//             "bidSz": "4552",
//             "open24h": "55926",
//             "high24h": "57641.1",
//             "low24h": "54570.1",
//             "volCcy24h": "81137.755",
//             "vol24h": "46258703",
//             "ts": "1620289117764",
//             "sodUtc0": "55926",
//             "sodUtc8": "55926"
//         }
//     ]
// }



async function getSwap(symbol) {
  const params = {
    instId: symbol
  }
  try {
    const response = await axios.get(endpoint, { params });
    // console.log(response.data.data[0])  yong data.last
    return response.data.data[0]
  } catch (error) {
    console.error(error);
    return false
  }
}

module.exports = {
  getSwap
}
