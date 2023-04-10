const { getMonthlyCandles } = require('./service/bian')

async function main() {
  const data = await getMonthlyCandles();
  console.log("btc price  len ", data.length)
  const results = [];
  let sourceBalance = "1000"
  let holderBtc = "0"

  for (let i = 0; i < data.length; i++) {
    // if () 波动比例大于2 个点 data 重新rebalance
    console.log('我们计算到了第：：：', i)
    const percentage = ((data - data[i - 1]) / data) * 100;
    if (percentage > 1) {
      const [s, h] = myStrategy(data[i], sourceBalance, holderBtc, data[i - 1])
      sourceBalance = s;
      holderBtc = h
      results.push(s);
    }
  }
  console.log(results);
}
function myStrategy(data, sourceBalance, holderBtc, lastDayPrice) {
  console.log("sourceBalance   ", sourceBalance)
  console.log("holderBtc    ", holderBtc)
  // const yingli = data * holderBtc - lastDayPrice * holderBtc
  const s = sourceBalance - ((sourceBalance - holderBtc * data) / 2)
  // const h = holderBtc + ((sourceBalance - holderBtc * data) / 2) / data
  const holderTimesData = multiplyNumbers(holderBtc, data)
  const h = addNumbers(holderBtc, divideNumbers(divideNumbers(subtractNumbers(sourceBalance, holderTimesData), 2), data))
  if (holderBtc = 0) {
    return [500, 500 / data]
  } else {
    return [s, h]
  }
}

main()