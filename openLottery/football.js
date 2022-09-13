const express = require('express');
const app = express();
// 
const { dayjs, cheerio, get } = require('../tool/app');
const { contro_get, contro_set } = require('../tool/redis');
// 
const get_new_football = async() =>
{
    let d = await get('slfk');
    // 
    if(!d) return '';
    // 
    const $ = cheerio.load(d);
    // let next = $('#_ctl0_ContentPlaceHolder_lblKenoNextDrawValue').text();
    // let time = $('#_ctl0_ContentPlaceHolder_lblLastDrawTimeValue').text();
    // if(!time) return '';
    // // 
    // let number = [];
    // let _this_span = $('#_ctl0_ContentPlaceHolder_tblLastDraw').find('tr').eq(1).find('td').eq(1).find('span');
    // // 
    // if(!_this_span.eq(0).text()) return '';
    // // 
    // for(let i=0;i<20;i++)
    // {
    //     number.push(parseInt(_this_span.eq(i).text().replace(/(^\s*)|(\s*$)/g, "")))
    // }
    // number.sort((a,b)=>{ return a-b; });
    // // 
    // // time = dayjs(time).add(6,'hour').format('YYYY-MM-DD HH:mm:ss');
    // time = await timeCheck(time);
    // time = dayjs(time).add(6,'hour').format('YYYY-MM-DD HH:mm:ss');
    // // 
    // let peroids;
    // const _perv = await contro_get('game_list_slfk');
    // if(_perv && (_perv.number).join(',')==number.join(',')) return '';
    // // 
    // if(_perv && _perv.peroids)
    // {
    //     peroids = parseInt(_perv.peroids)+1
    // }else{
    //     peroids = _default_peroids;
    // }
    // // 
    // if(number.length<20) return;
    // // 
    // return {
    //     peroids,
    //     time,
    //     number,
    //     // next
    // }
}
//
app.get('/', async(req, res) =>
{
    res.json(_list);
})
//
app.listen(3699);