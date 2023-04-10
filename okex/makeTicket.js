const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/index')

const path = '/api/v5/trade/order';
const endpoint = config.okexHost + path;
const apiKey = config.okexApiKey;
const secretKey = config.okexApiSec;
const passphrase = config.passPhrase;

const orderType = 'limit'; // market市价订单 limit为 maker单
const lever = 1; // 1倍杠杆
const timestamp = Date.now() / 1000;
const method = 'POST';
const signature = getSignature(secretKey, timestamp, method, path, body);


// side // 'buy' 为买入，'sell' 为卖出
// size  // size = 100; // 下单数量
// const symbol = 'BTC-USDT-SWAP'; // btc usdt swap
async function makeTicket(side, size, symbol) {

  const headers = {
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-PASSPHRASE': passphrase,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'Content-Type': 'application/json'
  }
  const data = JSON.stringify({
    instId: symbol,
    tdMode: 'cross',
    side: side,
    posSide: side,
    ordType: orderType,
    sz: size,
    lev: lever
  });

  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data
  } catch (error) {
    console.error(error);
    return false
  }
}

function getSignature(secretKey, timestamp, method, path, body) {
  const message = `${timestamp}${method.toUpperCase()}${path}${body}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  return hmac.update(message).digest('base64');
}

module.exports = { makeTicket }
