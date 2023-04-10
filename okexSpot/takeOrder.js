const axios = require('axios');
const crypto = require('crypto');



const apiKey = 'YOUR_API_KEY';
const apiSecret = 'YOUR_API_SECRET';
const apiPassphrase = 'YOUR_API_PASSPHRASE';
const baseUrl = 'https://www.okex.com';
const endpoint = '/api/v5/trade/place-order';


async function takeOrder(size, px) {
  const config = {
    headers,
    method: 'post',
    url: baseUrl + endpoint,
    data
  };
  const data = {
    instId: 'BTC-USDT',
    tdMode: 'cash',
    side: 'buy',
    ordType: 'limit',
    sz: size,
    px: '60000',
    ccy: 'USDT'
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



  const res = await axios(config)
  return res.data
}
