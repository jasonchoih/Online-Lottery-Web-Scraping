// 
const { get_new_jnd } = require('./lottery/jnd');
const { get_new_jnc } = require('./lottery/jnc');
const { get_new_ddbj } = require('./lottery/ddbj');
const { get_new_au } = require('./lottery/au');
const { get_new_elg } = require('./lottery/elg');
const { get_new_slfk } = require('./lottery/slfk');
// btc - kr - 自行开奖 - 无需执行
const { get_new_btc } = require('./lottery/btc');
const { get_new_kr } = require('./lottery/kr');
// 
const { gameIn, dayIn } = require('./tool/gameOpt');
// 
const { 
    //
    contro_subscribe,
    contro_setex,
    contro_del,
    //
    day_subscribe,
    day_del,
    //
} = require('./tool/redis');
// 
const _g = [ 
    'jnd', 
    'ddbj', 
    'jnc', 
    'au',
    'elg',
    'slfk',
];
// 
const _run = {};
_run['jnd'] = get_new_jnd;
_run['jnc'] = get_new_jnc;
_run['ddbj'] = get_new_ddbj;
_run['elg'] = get_new_elg;
_run['au'] = get_new_au;
_run['slfk'] = get_new_slfk;
// 
const fix = 'game_list_';
// 
const _start = async() => 
{
    // 先清除每天当前
    for(let i in _g)
    {
        await day_del('day_'+_g[i]);
        // await contro_del('game_list_'+_g[i]); // -x
    }
}
// 
const run_get = async() => 
{
    for(let i in _g)
    {
        const _g_i = _g[i];
        // console.log(_g_i);
        // 获取信息
        const _d = await _run[_g_i]();
        // console.log(_g_i, _d);
        // 入库
        if(_d) await gameIn(_g_i, _d);
    }
    // 开始执行
    await contro_setex('run_get_number', 5, 'uityiuyy'); 
}
// 通知 - 循环执行
const sub_one = async() => 
{
    contro_subscribe.subscribe(`__keyevent@0__:expired`, async() =>
    {
        contro_subscribe.on('message', async(info, msg) => 
        {
            // console.log(info, msg);
            // 
            if(msg=='run_get_number')
            {
                try {
                    await run_get();
                } catch (error) {
                    
                }
            }
        })
    });
}
// 通知 - 每天执行
const sub_day = async()=> 
{
    day_subscribe.subscribe(`__keyevent@1__:expired`, async() =>
    {
        day_subscribe.on('message', async(info, msg) => 
        {
            try {
                // console.log('每天', info, msg);
                // 
                await dayIn(msg);
                //
            } catch (error) {
                
            }
        })
    });
}
//
const _all_run = async() => 
{
    await _start();
    await sub_day();
    await sub_one();
    await run_get();
}
// 
_all_run();
