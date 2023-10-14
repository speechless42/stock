//儲存IDs資料到DB中
const { Sequelize,DataTypes, Model } = require('sequelize');
const AllIDs = require('../Scraper/StockIDs')
require("dotenv").config( { path: "../.env" })
const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
    host: process.env.Post,
    port:process.env.Port,
    dialect: 'mariadb'
  });



async function AddStockIds(stockid){
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
    AllIDs.GetStockID(stockid).then((data)=>{
        sequelize.sync().then(() => {
            // 寫入對映欄位名稱的資料內容
            IDs.create({
            // 記得 value 字串要加上引號
            symbol: data.symbol,
            name: data.name
            }).then(() => {
            // 執行成功後會印出文字
            console.log('successfully created!!') 
            });
        });
      })
}

module.exports={
    AddStockIds:AddStockIds
}
