//這是輸入ID，查詢ID去DB資料夾中

const { RestClient } = require('@fugle/marketdata');
require("dotenv").config( { path: "../.env" })

const client = new RestClient({ apiKey: process.env.FUGLE_API_KEY });
const stock = client.stock;

async function GetStockID(stockid){
    let Temp_Stock = await stock.intraday
    .ticker({ symbol: stockid })
    return Temp_Stock
}
module.exports = {
    GetStockID:GetStockID
}
