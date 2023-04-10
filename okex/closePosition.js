const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/index')
const apiKey = config.okexApiKey;
const apiSecret = config.okexApiSec;
const apiPassphrase = config.passPhrase;
const baseUrl = config.okexHost;
const endpoint = '/api/v5/trade/close-position';


// posSide long short
// qty '1'
async function closePosition(qty) {
  const data = {
    instId: 'BTC-USD-SWAP', // 合约ID
    posSide: 'long', // 持仓方向
    mgnMode: 'cross', // 保证金模式
    ccy: 'BTC', // 币种
    qty: qty // 平仓数量
  };
  const timestamp = Date.now().toString();
  const signInput = timestamp + 'POST' + endpoint + JSON.stringify(data);
  const sign = crypto.createHmac('sha256', apiSecret).update(signInput).digest('base64');
  const headers = {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': sign,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': apiPassphrase
  };
  const config = {
    headers,
    method: 'post',
    url: baseUrl + endpoint,
    data
  };

  await axios(config)
}

module.exports = { closePosition }
