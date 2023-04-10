const WebSocket = require('ws');
const axios = require('axios');

const OKEX_API_URL = 'https://www.okex.com';
const OKEX_WS_URL = 'wss://ws.okex.com:8443/ws/v5/public';
const INTERVAL = '1D';
const SYMBOL = 'BTC-USDT';
const SMA_PERIOD = 5;
const INCREASE_FACTOR = 2; // 反马丁格尔加仓倍数
const BASE_POSITION = 0.01; // 基础仓位大小

// 记录当前交易方向和仓位
let currentTradeDirection = '';
let currentPositionSize = BASE_POSITION;

const getHistoricalData = async () => {
  try {
    const response = await axios.get(`${OKEX_API_URL}/api/v5/market/candles`, {
      params: {
        instId: SYMBOL,
        after: Math.floor(Date.now() / 1000) - INTERVAL * SMA_PERIOD * 86400,
        before: Math.floor(Date.now() / 1000),
        bar: INTERVAL,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

const calculateSMA = (data) => {
  const sum = data.reduce((acc, item) => acc + parseFloat(item[4]), 0);
  return sum / data.length;
};

const initWebSocket = async () => {
  const ws = new WebSocket(OKEX_WS_URL);
  ws.on('open', () => {
    console.log('WebSocket connection established.');
    const message = {
      op: 'subscribe',
      args: [{ channel: 'candle1D', instId: SYMBOL }],
    };
    ws.send(JSON.stringify(message));
  });

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.event === 'subscribe') {
      console.log('Subscribed to:', parsedData.arg.channel);
    } else if (parsedData.event === 'update') {
      const candle = parsedData.data[0];
      console.log('New candle:', candle);
      executeAntiMartingaleSMAStrategy(candle);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

}