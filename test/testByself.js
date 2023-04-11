const { getMonthlyCandles } = require('./service/bian')
const { addNumbers, multiplyNumbers, subtractNumbers, divideNumbers } = require('./bignumber')

async function main() {
  const data = await getMonthlyCandles();
  console.log("btc price  len ", data.length)
  const results = [];
  let sourceBalance = "1000"
  let holderBtc = "0"

  for (let i = 0; i < data.length; i++) {
    // if () 波动比例大于2 个点 data 重新rebalance
    const percentage = ((data[i] - data[i - 1]) / data[i]) * 100;
    console.log(`我们计算到了第 ${i} 个, 波动比 ${percentage}`)
    if (Math.abs(percentage) > 1) {
      const [s, h] = myStrategy(data[i], sourceBalance, holderBtc, data[i - 1])
      sourceBalance = s;
      holderBtc = h
      results.push(s);
    }
  }

  const newR = results.sort((a, b) => a - b);
  const newD = data.sort((a, b) => b - a);
  console.log(`价格变化从 ${data[0]} 到 ${data[data.length - 1]}`)
  console.log(`最后的盈利变化是 ${results[0]}  ${results[results.length - 1]}`);
  console.log(`最大价格为 ${newD[0]} , 最大盈利为 ${newR[newR.length - 1]}`)

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