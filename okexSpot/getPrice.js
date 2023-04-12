const WebSocket = require('ws');

// 请将 'BTC-USDT' 替换为您关注的货币对，例如 'ETH-USDT'
const symbol = 'BTC-USDT';

// 连接到 OKEx WebSocket API
const ws = new WebSocket('wss://ws.okex.com:8443/ws/v5/public');

// 发送订阅消息
function subscribe(ws) {
  const request = {
    op: 'subscribe',
    args: [
      {
        channel: 'tickers',
        instId: symbol,
      },
    ],
  };

  ws.send(JSON.stringify(request));
}

ws.on('open', () => {
  console.log(`WebSocket 连接已打开，订阅 ${symbol} 行情价格。`);
  subscribe(ws);
});

ws.on('message', message => {
  const response = JSON.parse(message);

  if (response.hasOwnProperty('arg') && response.arg.channel === 'tickers') {
    console.log(`价格更新：${symbol} 最新价格：${response.data[0].last}`);
  }
});

ws.on('close', () => {
  console.log(`WebSocket 连接已关闭。`);
});

ws.on('error', error => {
  console.error(`WebSocket 发生错误：`, error);
});
