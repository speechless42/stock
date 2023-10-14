//查詢今日日期，輸入並將股票納入DB
const { RestClient } = require('@fugle/marketdata');
const { Sequelize,DataTypes, Model } = require('sequelize');
require("dotenv").config( { path: "../.env" })

async function Get_Day_Stock_Details(){
const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
    host: process.env.Post,
    port:process.env.Port,
    dialect: 'mariadb'
  });

const IDs = sequelize.define('StockIds', {
    // 在这里定义模型属性
    id:{
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    timestamps: false
  });

sequelize.sync().then(() => {
    IDs.findAll().then(IDs => {
      const client = new RestClient({ apiKey: process.env.FUGLE_API_KEY });
      const stock = client.stock;
      for(let i=0;i<IDs.length;i++){
        setTimeout(function() {
            var today = new Date();
            let month, day;
            if((today.getMonth()+1)<10){
                month = `0${today.getMonth()+1}`;
            }else{
                month = (today.getMonth()+1).toString();
            }
            if(today.getDay()<10){
              day = `0${today.getDay()}`;
          }else{
              day = (today.getDay()).toString();
          }
            let ThisDay = `${today.getFullYear()}-${month}-0${today.getDate()-1}`
            
            stock.historical.candles({symbol:IDs[i].dataValues.symbol,to:ThisDay,from:ThisDay,timeframe:'D',fields: 'open,high,low,close,volume,change'})
            .then((data)=>{
              console.log(data)
                if(data == null){ console.log("No Data");return }
                else{
                const Details = sequelize.define('Stock_Day_History',{
                    id:{
                        type: DataTypes.NUMBER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    symbol: {
                        type: DataTypes.STRING,
                        allowNull: false,
                    },
                    open:{
                        type:DataTypes.FLOAT
                    },
                    high:{
                        type:DataTypes.FLOAT
                    },
                    low:{
                        type:DataTypes.FLOAT
                    },
                    close:{
                        type:DataTypes.FLOAT
                    },
                    volume:{
                        type:DataTypes.NUMBER
                    },
                    changes:{
                        type:DataTypes.FLOAT
                    },
                    date:{
                        type: DataTypes.STRING,
                    }
                },{
                    timestamps: false
                    })
                
                        // 寫入對映欄位名稱的資料內容
                        Details.create({
                        // 記得 value 字串要加上引號
                        symbol: data.symbol,
                        open: data.data[0].open,
                        high: data.data[0].high,
                        low: data.data[0].low,
                        close: data.data[0].close,
                        volume: data.data[0].volume,
                        changes: data.data[0].change,
                        date: data.data[0].date
                        }).then(() => {
                        // 執行成功後會印出文字
                        console.log('successfully created!!') 
                        });
                    
                    
                }
            })
            .catch((error)=>{
                return "今天沒股票"
            })
         },i*10000)
        
      }
      
    });
  });
}
  module.exports = {
    Get_Day_Stock_Details:Get_Day_Stock_Details
  }
  //這是取的每日數據
