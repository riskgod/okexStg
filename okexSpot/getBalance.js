const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/index')
const apiKey = config.okexApiKey; // 替换为您的 API Key
const apiSecret = config.okexApiSec; // 替换为您的 API Secret
const passphrase = config.passPhrase; // 替换为您的 API Passphrase

const endpoint = config.okexHost + '/api/v5/account/balance';

// 获取时间戳
const timestamp = Date.now() / 1000;

// 创建请求头
const sign = crypto.createHmac('sha256', apiSecret).update(`${timestamp}GET${endpoint}`).digest('base64');
const headers = {
  'OK-ACCESS-KEY': apiKey,
  'OK-ACCESS-SIGN': sign,
  'OK-ACCESS-TIMESTAMP': timestamp,
  'OK-ACCESS-PASSPHRASE': passphrase,
  'Content-Type': 'application/json'
};



async function spotGetBalance() {
  const res = await axios.get(endpoint, { headers })
  const balances = res.data.data;
  const btcBalance = balances.filter((b) => b.ccy === 'BTC')[0].cashBal;
  const usdtBalance = balances.filter((b) => b.ccy === 'USDT')[0].cashBal; // 获取 USDT 余额
  return [btcBalance, usdtBalance]
}

module.exports = { spotGetBalance }