const ccxt = require('./ccxt/js/ccxt');

console.log('CCXT Version:', ccxt.version);

async function main() {

  const exchange = new ccxt.coinex({
    // 'apiKey': '...',
    // 'secret': '...',
    'options': {
      'defaultType': 'swap',
    },
  });

  const markets = await exchange.loadMarkets();
  console.log(markets);

};

main();