var express = require('express');
var router = express.Router();
const { Sequelize,DataTypes} = require('sequelize');
const fs = require("fs")
const { RestClient } = require('@fugle/marketdata');
require("dotenv").config( { path: "./.env" })
///////////////////////////設定
const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
  host: process.env.Post,
  port:process.env.Port,
  dialect: 'mariadb'
});
const client = new RestClient({ apiKey: process.env.FUGLE_API_KEY });
const stock = client.stock;
const CronJob = require('cron').CronJob;
/////////////////////營收相關
const SetDB_Revenue = require("../DataBase/Revenue")
const Math_Revenue = require("../Math/Math_Revenue")
const Revenue = require("../Scraper/revenue")

const Cron_L_Mon_Revenue = new CronJob('1 1 1 3,5,7,10 * *', async function(){
  let Lian_L_Mon_sii = await Math_Revenue.Trade_L_Mon_Revenue("sii",Revenue)
  
  let Lian_L_Mon_otc = await Math_Revenue.Trade_L_Mon_Revenue("otc",Revenue)

  let Lian_L_Mon = Object.assign({}, Lian_L_Mon_sii, Lian_L_Mon_otc);
  fs.writeFile('./public/json/Revenue_L_Mon.json', JSON.stringify(Lian_L_Mon,null,' '), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}, null, true, 'Asia/Taipei')
Cron_L_Mon_Revenue.start();

const Cron_L_Year_Revenue = new CronJob('1 1 1 3,5,7,10  * *', async function(){
  let Lian_L_Year_sii = await Math_Revenue.Trade_L_Year_Revenue("sii",Revenue)

  let Lian_L_Year_otc = await Math_Revenue.Trade_L_Year_Revenue("otc",Revenue)

  let Lian_L_Year = Object.assign({}, Lian_L_Year_sii, Lian_L_Year_otc);
  fs.writeFile('./public/json/Revenue_L_Year.json', JSON.stringify(Lian_L_Year,null,' '), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
  // let Lian_ALL_sii = await Math_Revenue.Trade_ALL_Revenue("sii",Revenue)
  // let Lian_ALL_otc = await Math_Revenue.Trade_ALL_Revenue("otc",Revenue)
}, null, true, 'Asia/Taipei')
Cron_L_Year_Revenue.start();

const Cron_L_All_Revenue = new CronJob('1 1 1 3,5,7,10 * *', async function(){
  let Lian_ALL_sii = await Math_Revenue.Trade_ALL_Revenue("sii",Revenue)

  let Lian_ALL_otc = await Math_Revenue.Trade_ALL_Revenue("otc",Revenue)

  let Lian_ALL = Object.assign({}, Lian_ALL_sii, Lian_ALL_otc);
  fs.writeFile('./public/json/Revenue_L_All.json', JSON.stringify(Lian_ALL,null,' '), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
  
}, null, true, 'Asia/Taipei')
Cron_L_All_Revenue.start();
/////////////////////每日擷取歷史K線
const Get_Day_Stock_Detail_F = require("../Scraper/StockDetail");


async function GetDayStockDetails(){
  let x = await stock.snapshot.quotes({market:"TSE"})
  x = x.date
  //////////////
  var today = new Date();
  var month ,todayDate;
  if((today.getMonth()+1)<10){
      month = `0${today.getMonth()+1}`;
  }else{
      month = today.getMonth()+1;
  }
  if((today.getDate())<10){
    todayDate = `0${today.getDate()}`;
  }else{
    todayDate = today.getDate();
  }
  let ThisDay = `${today.getFullYear()}-${month}-${todayDate}`
  //////////////
  if(ThisDay != x){
    console.log("股價沒更新")
    return "股價沒更新"
  }
  else{
    await Get_Day_Stock_Detail_F.Get_Day_Stock_Details();
    console.log("股價於三點更新")
    return ThisDay + "股價於三點更新"
  // await Get_Day_Stock_Detail_F.Get_Day_Stock_Details();
  }
}
const Cron_StockDetails = new CronJob('1 1 15 * * *', async function() {
  await GetDayStockDetails();
}, null, true, 'Asia/Taipei');
Cron_StockDetails.start();
////////////////////計算爆量
const Get_Math_Volume = require('../Math/Math_Volume')
const Cron_Math_Volume = new CronJob('1 1 18 * * *', async function() {
  await Get_Math_Volume.Trade_Volume();
}, null, true, 'Asia/Taipei');
Cron_Math_Volume.start();

// const GetDBVolume = sequelize.define('VolumeGos',{
//   id:{
//       type: DataTypes.NUMBER,
//       primaryKey: true,
//       autoIncrement: true
//   },
//   symbol: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   date:{
//       type: DataTypes.STRING,
//   }
// },{
//   timestamps: false
// })


// const Cron_DB_Revenue = new CronJob('* 50 1 * * *', async function(){
//   await SetDB_Revenue.DB_Revenue("sii");
//   await SetDB_Revenue.DB_Revenue("otc");
// }, null, true, 'Asia/Taipei')
// Cron_DB_Revenue.start();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/RevenueMon', function(req, res, next) {
  fs.readFile("./public/json/Revenue_L_Mon.json",function ( err , data ) { if ( err ) { res.send("無資料") } 
    data = JSON.parse(data);
    console.log(typeof(data))
    res.send(data)
  }); 
});
router.get('/RevenueYear', function(req, res, next) {
  fs.readFile("./public/json/Revenue_L_Year.json",function ( err , data ) { if ( err ) { res.send("無資料") } 
    data = JSON.parse(data);
    res.send(data)
  }); 
});
router.get('/RevenueALL', function(req, res, next) {
  fs.readFile("./public/json/Revenue_L_All.json",function ( err , data ) { if ( err ) { return console.error( err ); } 
    data = JSON.parse(data);
    res.send(data)
  }); 
});
router.get('/Big_Volume',function(req,res,next){
  GetDBVolume.findAll().then((data)=>{
    res.send(data)
  })
})
module.exports = router;
