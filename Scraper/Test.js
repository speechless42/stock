const { RestClient } = require('@fugle/marketdata');
require("dotenv").config( { path: "../.env" })
const client = new RestClient({ apiKey: process.env.FUGLE_API_KEY });

const stock = client.stock;
stock.historical.candles({symbol:"0050",to:"2023-10-11",from:"2023-10-11",timeframe:'D',fields: 'open,high,low,close,volume,change'})
            .then((data)=>{console.log(data)});