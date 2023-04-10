const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/index')

// 请替换为您的API密钥
const apiKey = config.okexApiKey;
const apiSecret = config.okexApiSec;
const passphrase = config.passPhrase;

const OKEX_API_URL = config.okexHost;

const getServerTime = async () => {
  const response = await axios.get(`${OKEX_API_URL}/api/v5/public/time`);
  return response.data.data[0].ts;
};

const signRequest = (timestamp, method, path, body) => {
  const prehash = timestamp + method + path + (body || '');
  const hmac = crypto.createHmac('sha256', apiSecret);
  return hmac.update(prehash).digest('hex');
};

async function getAccountBalance(currency) {
  const path = '/api/v5/account/balance';
  const method = 'GET';
  const timestamp = await getServerTime();

  const headers = {
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': signRequest(timestamp, method, path),
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': passphrase,
  };

  const params = {
    ccys: currency
  }

  try {
    const response = await axios.get(`${OKEX_API_URL}${path}`, { headers, params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return [];
  }
}

async function convertBalanceToUSDT(balances) {
  const symbols = balances.map((balance) => balance.cc).join(',');
  const response = await axios.get(`${OKEX_API_URL}/api/v5/market/tickers`, {
    params: { instId: symbols + '-USDT' },
  });
  const tickers = response.data.data;

  return balances.map((balance) => {
    const ticker = tickers.find((t) => t.instId.startsWith(balance.cc));
    const usdtValue = parseFloat(balance.bl) * parseFloat(ticker.last);
    return { currency: balance.cc, balance: balance.bl, usdtValue };
  });
}


module.exports = {
  getAccountBalance,
  convertBalanceToUSDT
}


// (async () => {
//   const balances = await getAccountBalance();
//   const usdtBalances = await convertBalanceToUSDT(balances);
//   console.log('Account balances in USDT:', usdtBalances);
// })();
