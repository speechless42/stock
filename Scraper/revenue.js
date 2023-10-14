const numeral = require('numeral');
const cheerio = require("cheerio");
const axios = require("axios")
const iconv = require('iconv-lite');
async function Get_Revenue(market){
    const today = new Date();
    const Year = today.getFullYear() - 1911;
    const Month = today.getMonth();
    const page = await axios.get(`https://mops.twse.com.tw/nas/t21/${market}/t21sc03_${Year}_${Month}_0.html`,
    { responseType: 'arraybuffer' }).then(response => iconv.decode(response.data, 'big5'))
    const $ = cheerio.load(page);

     // 遍歷每個 table row 並轉換資料格式
     const data = $('tr [align=right]')
     .filter((i, el) => {
       const th = $(el).find('th');
       const td = $(el).find('td');
       return (th.length === 0) && !!td.eq(0).text();
     })
     .map((i, el) => {
       const td = $(el).find('td');
       const symbol = td.eq(0).text().trim();  // 公司代號
       const name = td.eq(1).text().trim();  // 公司名稱
       const revenue = numeral(td.eq(2).text().trim()).value(); // 當月營收
       const L_Mon_Compare =  numeral(td.eq(5).text().trim()).value(); //上月比較增減(%)
       const L_Year_Compare = numeral(td.eq(6).text().trim()).value();//去年比較增減(%)
       const Remark = td.eq(10).text().trim();//去年比較增減(%)
       return { symbol, name, revenue,L_Mon_Compare,L_Year_Compare,Remark };
     }).toArray();
     return data
}

module.exports = {
    Get_Revenue:Get_Revenue
  }
