const axios = require('axios');
const crypto = require('crypto');

const apiKey = 'YOUR_API_KEY';
const secretKey = 'YOUR_SECRET_KEY';
const passphrase = 'YOUR_PASSPHRASE';

const endpoint = 'https://www.okex.me/api/v5/trade/order';

const timestamp = Date.now() / 1000;
const method = 'POST';
const path = '/api/v5/trade/order';
const body = JSON.stringify({
  instId: 'BTC-USDT',
  tdMode: 'cash',
  side: 'buy',
  ordType: 'market',
  sz: '0.001'
});

const signature = getSignature(secretKey, timestamp, method, path, body);

axios.post(endpoint, body, {
  headers: {
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-PASSPHRASE': passphrase,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'Content-Type': 'application/json'
  }
})
  .then((response) => {
    // 处理 API 响应
    console.log(response.data);
  })
  .catch((error) => {
    // 处理错误
    console.error(error);
  });

function getSignature(secretKey, timestamp, method, path, body) {
  const message = `${timestamp}${method.toUpperCase()}${path}${body}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  return hmac.update(message).digest('base64');
}
