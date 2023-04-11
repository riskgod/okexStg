const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const folderPath = path.resolve(__dirname, '../../data/ftx'); // 将此路径替换为您的 CSV 文件夹路径

// 读取文件夹中的所有文件名
const files = fs.readdirSync(folderPath);

// 筛选出 CSV 文件
const csvFiles = files.filter(file => path.extname(file) === '.csv');

// 初始化一个空数组来存储所有 CSV 文件的数据
const combinedData = [];

// 读取每个 CSV 文件并将其数据合并到 combinedData 数组中
csvFiles.forEach(file => {
  const csvFilePath = path.join(folderPath, file);
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');
  const workbook = XLSX.read(csvFileContent, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  combinedData.push(...data);
});

function allFtxData() {
  const sortresult = combinedData.sort((a, b) => {
    Object.values(a)[2] - Object.values(b)[2]
  })

  let dataR = []

  sortresult.forEach(e => {
    dataR.push(e[Object.keys(e)[6]])
  })

  return dataR
}

module.exports = { allFtxData }