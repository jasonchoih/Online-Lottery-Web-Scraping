//
const dayjs = require('dayjs');
const request = require('request-promise');
// 
const { 
    //
    day_subscribe,
    day_lrange,
    day_rpop,
    day_ltrim,
    day_lindex,
    day_llen,
    day_lpush,
    day_setex,
    contro_get,
    contro_set
    //
} = require('./tool/redis');
//
const lottery_day_fix = 'lottery_day_list_';
// 清除开奖号码列表 (慎用)
// const clean_list = async() => 
// {
//     const _arr = [
//         'jnd',
//         'ddbj',
//         'jnc',
//         'au',
//         'elg',
//         'slfk',
//         // 'btc'
//     ];
//     for(let i in _arr)
//     {
//         await day_lrange(lottery_list_fix+''+_arr[i], 2, 1);
//     }
// }
// 
// const test = async() => 
// {
//     await contro_set('game_list_kr', {
//         peroids: 3220082,
//         time: '2022-05-22 08:49:00',
//         number: [
//             1,  2, 11, 20, 26, 27, 34,
//             39, 46, 47, 49, 50, 56, 60,
//             61, 63, 68, 69, 71, 80
//         ]
//     });
//     // await clean_list();
//     const _list = await contro_get('game_list_kr', 0, -1);
//     console.log(_list);
//     const time = await dayjs().format('YYYY-MM-DD HH:mm:ss');
//     console.log(time);

// }
const test = async() =>
{
    const ips = {
        'sd28': '183.57.36.16:7777',
        'sj28': '219.129.216.139:7777',
        'wn28': '116.10.184.155:7777',
    };
    // 
    for(let i in ips)
    {
        const reqs = await request({
            method: 'get',
            json: true,
            uri:'http://'+ips[i]+'?category=btc&peroids=2320727'
        });
        console.log(reqs);
    }   
}
test();