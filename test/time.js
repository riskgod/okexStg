const startOfMonth = new Date(2022, 10, 1); // 2022 年 11 月 1 日，月份从 0 开始，所以 10 表示 11 月
const endOfMonth = new Date(2022, 11, 0); // 2022 年 12 月 0 日表示 11 月的最后一天

const startTimestamp = startOfMonth.getTime();
const endTimestamp = endOfMonth.getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000) + 999; // 将时间调整为 11 月最后一天的 23:59:59.999

console.log('Start of November 2022:', startTimestamp);
console.log('End of November 2022:', endTimestamp);
