const { Sequelize,DataTypes, Model } = require('sequelize');
const AllRevenue = require('../Scraper/revenue')
require("dotenv").config( { path: "../.env" })
async function DB_Revenue(markets){
  const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
    host: process.env.Post,
    port:process.env.Port,
    dialect: 'mariadb'
  });
  const Store_Revenue = sequelize.define('Revenues', {
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
    revenue: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    L_Mon_Compare: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    L_Year_Compare: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    Remark:{
      type: DataTypes.STRING,
    }
  },{
    timestamps: false
  });
  
  const Data_revenue = await AllRevenue.Get_Revenue(markets);
  for(let i=0;i<Data_revenue.length;i++){
    setTimeout(function(){
      sequelize.sync().then(() => {
        // 寫入對映欄位名稱的資料內容
        Store_Revenue.create({
        // 記得 value 字串要加上引號
        symbol: Data_revenue[i].symbol,
        revenue: Data_revenue[i].revenue,
        L_Mon_Compare: Data_revenue[i].L_Mon_Compare,
        L_Year_Compare: Data_revenue[i].L_Year_Compare,
        Remark:Data_revenue[i].Remark
        }).then(() => {
        // 執行成功後會印出文字
        console.log('successfully created!!') 
        });
      });
    },i*5000)
  }
}
module.exports={
  DB_Revenue:DB_Revenue
}
