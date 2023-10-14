const fs = require("fs")
async function Trade_L_Mon_Revenue(market,data){
    let Return_Data = await data.Get_Revenue(market)
    Return_Data = Return_Data.filter(el => el.L_Mon_Compare > 0)
    Return_Data = Return_Data.filter(el => el.revenue > 1000000)
    return Return_Data
}

async function Trade_L_Year_Revenue(market,data){
    let Return_Data = await data.Get_Revenue(market)
    Return_Data = Return_Data.filter(el => el.L_Year_Compare > 0)
    Return_Data = Return_Data.filter(el => el.revenue > 1000000)
    return Return_Data
}

async function Trade_ALL_Revenue(market,data){
    let Return_Data = await data.Get_Revenue(market)
    Return_Data = Return_Data.filter(el => el.L_Year_Compare > 0 )
    Return_Data = Return_Data.filter(el => el.L_Mon_Compare > 0 )
    Return_Data = Return_Data.filter(el => el.revenue > 100000)
    return Return_Data
}
module.exports = {
    Trade_L_Mon_Revenue:Trade_L_Mon_Revenue,
    Trade_L_Year_Revenue:Trade_L_Year_Revenue,
    Trade_ALL_Revenue:Trade_ALL_Revenue
  }