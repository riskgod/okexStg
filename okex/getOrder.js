const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/index')
const path = '/api/v5/trade/orders';
// Okex API 地址
const endpoint = config.okexHost + path;

// 您的 API 密钥信息
const apiKey = config.okexApiKey;
const secretKey = config.okexApiSec;
const passphrase = config.passPhrase;

async function getOrder(symbol) {
  const timestamp = Date.now() / 1000;
  const method = 'GET';
  const signature = getSignature(secretKey, timestamp, method, path, '');

  const res = await axios.get(endpoint, {
    headers: {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'Content-Type': 'application/json'
    },
    params: {
      instType: 'SWAP',
      instId: symbol,
      state: '3', // 我们将 state 参数设置为 '2,3,4'，以查询已开单状态的订单。具体来说，状态值 2 表示部分成交，3 表示已完全成交，4 表示已撤销
      limit: 100, // 每页显示 100 条记录
      after: 0 // 从最新记录开始查询
    }
  })

  return res.data.data[0]
}

// 生成签名
function getSignature(secretKey, timestamp, method, path, body) {
  const message = `${timestamp}${method.toUpperCase()}${path}${body}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  return hmac.update(message).digest('base64');
}


module.exports = {
  getOrder
}