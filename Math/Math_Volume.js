const { RestClient } = require('@fugle/marketdata');
const { Sequelize,DataTypes, Model } = require('sequelize');
require("dotenv").config( { path: "../.env" })

async function Trade_Volume(){
    const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
        host: process.env.Post,
        port:process.env.Port,
        dialect: 'mariadb'
    });
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
    const Allids = await IDs.findAll().then(Id => {
        // 用 JSON.stringify() 來格式化輸出
        Get_Id = Id.map(function(el){
          return el.dataValues.symbol
        })
    return Get_Id
    });
    const Volumes = sequelize.define('VolumeGos',{
        id:{
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        symbol: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date:{
            type: DataTypes.STRING,
        }
    },{
        timestamps: false
    })
    var res = [];
    for(let i=0;i<Allids.length;i++){
        setTimeout(async function(){
            let Get_Detail = await Details.findAll({
                where: {
                    symbol: Allids[i]
                },
                order:[
                    ['date','ASC']
                ],
                attributes:['symbol','volume','changes','date']
                }).then(data => {
                    data = data.map(function(el){
                        
                        return el.dataValues
                    })
                    return data
                    })
            let Avg = 0
            for(let j = Get_Detail[Get_Detail.length -2]; j > 20 ;j--)
            {
                Avg += Get_Detail[j].volume
            }
            Avg = Avg / 20;
            console.log(Get_Detail[Get_Detail.length - 1])
            let today = Get_Detail[Get_Detail.length - 1].volume;
            let changes = Get_Detail[Get_Detail.length - 1].changes
            if((today > Avg * 1.2) && (changes > 0) && today > 1000000)
            { 
                sequelize.sync().then(() => {
                // 寫入對映欄位名稱的資料內容
                Volumes.create({
                // 記得 value 字串要加上引號
                symbol: Get_Detail[0].symbol,
                date: Get_Detail[Get_Detail.length - 1].date
                }).then(() => {
                // 執行成功後會印出文字
                console.log('successfully created!!') 
                });
              }); 
            }
            else{
                console.log('000000') 
            }
        },i*10000)
        
    }
    
}
module.exports = {
    Trade_Volume:Trade_Volume
}