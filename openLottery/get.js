const express = require('express');
const app = express();
const { get_list_jnd } = require('./lottery/jnd');
// 
const { 
    // app,
    dayjs,
    get  
} = require('./tool/app');

app.get('/', async(req, res) =>
{
    // console.log(765765)
    const _list = await get_list_jnd();
    // res.send('Hello World')
    // let d = await get('jndlist');
    res.json(_list);
})

app.listen(3692);