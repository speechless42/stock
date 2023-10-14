const { Sequelize, Model } = require('sequelize');
require("dotenv").config( { path: "../.env" })

// 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
const sequelize = new Sequelize(process.env.DataBase, process.env.DBUser, process.env.DBPwd, {
  host: process.env.Post,
  port:process.env.Port,
  dialect: 'mariadb'
});

// sequelize.authenticate().then(() => {
//   console.log('Connection has been established successfully.');
// }).catch((error) => {
//   console.error('Unable to connect to the database: ', error);
// });

module.exports= {
  sequelize
}