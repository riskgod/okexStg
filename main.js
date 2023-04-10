const { getSwap } = require('./okex/getSwap')
const { getOrder } = require('./okex/getOrder')

const { makeTicket } = require('./okex/makeTicket')
const { closePosition } = require('./okex/closePosition')
const symbol = 'BTC-USDT-SWAP';

async function main() {
  const swapRes = await getSwap(symbol);
  const lastPrice = swapRes.last // 市场价格 last price
  const orderBalance = await getOrder(symbol) // 已开订单
  const yikaiBalanace = orderBalance.sz * lastPrice // 已开订单的余额
  const balances = await getAccountBalance();
  const availUsdt = balances[0].availEq // 可用余额 usdt
  const yingli = yikaiBalanace - availUsdt
  const qty = (yingli / 2) / lastPrice

  if (yingli > 20 || yingli > '20') {
    await closePosition(qty)
  }

  if (yingli < 20 || yingli < '20') {
    await makeTicket('buy', Math.abs(qty), symbol)
  }
}

main() 