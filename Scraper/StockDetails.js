//這是將股票歷史數據直接貼到DB中。一般來說不會用到，上線直接利用另一檔Stockdetail新增每日
const { RestClient } = require('@fugle/marketdata');
const { Sequelize,DataTypes, Model } = require('sequelize');
require("dotenv").config( { path: "../.env" })
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
            stock.historical.candles({symbol:IDs[i].dataValues.symbol,to:"2023-10-13",from:"2023-10-03",timeframe:'D',fields: 'open,high,low,close,volume,change'})
            .then((data)=>{
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
                // console.log(typeof(data.data[0].open))
                for(let j=0;j< data.data.length;j++){
                        // 寫入對映欄位名稱的資料內容
                        Details.create({
                        // 記得 value 字串要加上引號
                        symbol: data.symbol,
                        open: data.data[j].open,
                        high: data.data[j].high,
                        low: data.data[j].low,
                        close: data.data[j].close,
                        volume: data.data[j].volume,
                        changes: data.data[j].change,
                        date: data.data[j].date
                        }).then(() => {
                        // 執行成功後會印出文字
                        console.log('successfully created!!') 
                        });
                    
                }
            })
            .catch((error)=>{
                console.log(error)
            })
         },i*10000)
        
      }
      
    });
  });
  
