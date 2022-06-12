//
const request = require('request-promise');
const { contro_get, redis_kill_get } = require('./redis');
// const { kill_kr_au } = require('./krnum');
const { kill_kr_au_x } = require('./krnumx');
// const { getGameListData } = require('./gameToolx');
//
const ips = {
    'sd28': '116.10.189.115',
    'sj28': '116.10.189.66',
    'wn28': '116.10.184.155',
}
const _odds = {
    '11': {
        2: 36.00, 3: 18.00, 4: 12.00, 5: 9.00, 6: 7.20,
        7: 6.00, 8: 7.20, 9: 9.00, 10: 12.00,
        11: 18.00, 12: 36.00
    },
    '16': {
        3: 216.00, 4: 72.00, 5: 36.00, 6: 21.60,
        7: 14.40, 8: 10.29, 9: 8.64, 10: 8.00,
        11: 8.00, 12: 8.64, 13: 10.29, 14: 14.40,
        15: 21.60, 16: 36.00, 17: 72.00, 18: 216.00
    },
    '28': {
        0: 1000.00, 1: 333.33, 2: 166.67, 3: 100.00, 4: 66.66, 5: 47.61, 6: 35.71,
        7: 27.77, 8: 22.22, 9: 18.18, 10: 15.87, 11: 14.49, 12: 13.69, 13: 13.33,
        14: 13.33, 15: 13.69, 16: 14.49, 17: 15.87, 18: 18.18, 19: 22.22,
        20: 27.77, 21: 35.71, 22: 47.61, 23: 66.66,
        24: 100.00, 25: 166.66, 26: 333.33, 27: 1000.00
    },
    '28gd': {
        0: 1000.00, 1: 333.33, 2: 166.67, 3: 100.00, 4: 66.66, 5: 47.61, 6: 35.71,
        7: 27.77, 8: 22.22, 9: 18.18, 10: 15.87, 11: 14.49, 12: 13.69, 13: 13.33,
        14: 13.33, 15: 13.69, 16: 14.49, 17: 15.87, 18: 18.18, 19: 22.22,
        20: 27.77, 21: 35.71, 22: 47.61, 23: 66.66,
        24: 100.00, 25: 166.66, 26: 333.33, 27: 1000.00
    },
    '36': { 'ban': 2.78, 'za': 3.33, 'dui': 3.70, 'shun': 16.67, 'bao': 100.00 }
}
//
const cutNum = {
    11: 4,
    16: 5,
    28: 7,
    36: 2,
};
// 获取号码以及总投注额度
const getSumBets = async(category, peroids) => 
{
    let dousum = 0;
    let data = {};
    //
    try {
        for(let i in ips)
        {
            const reqs = await request({
                method: 'get',
                json: true,
                uri:'http://'+ips[i]+':7777?category='+category+'&peroids='+peroids
            });
            //
            if(reqs && Object.keys(reqs).length>0)
            {
                for(let i in reqs)
                {
                    const _bi = reqs[i];
                    if(!data[i]) data[i] = {};
                    for(let j in _bi)
                    {
                        if(data[i][j])
                        {
                            data[i][j] = parseInt(_bi[j]) + parseInt(data[i][j]);
                        }else{
                            data[i][j] = _bi[j];
                        }
                    }
                }
            }
        }
        if(Object.keys(data).length>0)
        {
            for(let i in data)
            {
                for(let j in data[i])
                {
                    dousum+=parseInt(data[i][j]);
                }
            }
        }
    } catch (error) {
        
    }
    return { dousum, data }
}
// 随机顺序
const randSort = async(arr) => 
{
    for(var i = 0,len = arr.length;i < len; i++ )
    {
        var rand = parseInt(Math.random()*len);
        var temp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
//
const rankDouOdd = async(x,d) => 
{
    let _r = [];
    for(let i in d)
    {
        _r.push([i, d[i][1], d[i][2]]);
    }
    _r = _r.sort((a,b)=>{return a[2]-b[2]});
    //
    return _r;
}
//
const getNumbers = async(data) => 
{
    for(let i in _odds)
    {
        const _oi = _odds[i];
        if(!data[i]) data[i] = {};
        for(let j in _oi)
        {
            if(data[i][j] && data[i][j]>0)
            {
                data[i][j] = [ data[i][j], _oi[j], parseInt(_oi[j] * data[i][j]) ];
            }else{
                data[i][j] = [ 0, _oi[j], 0 ];
            }
        }
    }
    // 
    for(let i in data['28'])
    {
        data['28'][i][2] = data['28'][i][2]+data['28gd'][i][2];
    }
    //
    let kills = {};
    for(let i in data)
    {
        kills[i] = await rankDouOdd(i,data[i]);
    }
    // 找出每个游戏的投注总额
    let betdous = {};
    for(let i in data)
    {
        if(['11','16','28','36'].find(v=>v==i))
        {
            betdous[i] = 0;
            for(let j in data[i])
            {
                betdous[i] = betdous[i] + parseInt(data[i][j][2]);
            }
        }
    }
    // 找出所需开的分类
    let maxbet = 0;
    let openc = 28;
    for(let i in betdous)
    {
        if(betdous[i]>maxbet)
        {
            openc = i;
        }
        maxbet = betdous[i];
    }
    // console.log(betdous, openc);
    // 找出所需要开的号码
    let numx = {};
    for(let i in kills)
    {
        numx[i] = [[],[]];
        for(let j in kills[i])
        {
            if(kills[i][j][2]==0)
            {
                numx[i][0].push(kills[i][j][0]);
            }
            numx[i][1].push(kills[i][j][0]);
        }
    }
    // console.log(numx, numx[openc]);
    //
    let numopens = numx[openc];
    let openv = numopens[0];
    if(openv.length<cutNum[openc])
    {
        openv = numopens[1].slice(0,cutNum[openc]);
    }
    // 
    const numr = (await randSort(openv))[0];
    // 
    return [ openc, numr ];
}
// 
const getOpens = async(category, peroids) => 
{
    const { dousum, data } = await getSumBets(category, peroids);
    // 
    // console.log(dousum);
    if(dousum<=0 || Object.keys(data).length<=0) return '';
    // 
    let { autokill, maxbetdou } = await redis_kill_get('set_kill_'+category);
    if(!autokill || !maxbetdou) return '';
    maxbetdou = parseInt(maxbetdou);
    // console.log(maxbetdou);
    if(autokill=='2' && dousum<maxbetdou) return '';
    //
    return await getNumbers(data);
}
// 
const killKrAu = async(category, peroids) => 
{
    const _k = await getOpens(category, peroids);
    if(!_k) return '';
    // 
    // console.log(_k);
    // 
    let _kills = '';
    try {
        _kills = (await randSort(kill_kr_au_x[_k[0]][_k[1]]))[0];
    } catch (error) {
        
    }
    //
    if(_kills && _kills.length==20) return _kills;
    return '';
}
// 
const killBtc = async(category, peroids) => 
{
    const _k = await getOpens(category, peroids);
    if(!_k) return '';
    // 
    const _cache = await contro_get('lottery_btc_cache');
    // 
    let _kills = '';
    try {
        _kills = _cache[_k[0]][_k[1]];
    } catch (error) {
        
    }
    //
    if(_kills && _kills.length>1) return _kills;
    return '';
}
// 
// const test = async() => 
// {
//     // const _xx = await killKrAu('kr', '3146931');
//     const _xx = await killBtc('btc', '2152175');
//     console.log(_xx);
// }
// test();
// 
// 
// const changeData = async() => 
// {
//     let n = {
//         11: {},
//         16: {},
//         28: {},
//         36: {}
//     };
//     //
//     for(let i in kill_kr_au)
//     {
//         for(let j in kill_kr_au[i])
//         {
//             const _asdf = [kill_kr_au[i][j], await getGameListData('kr',{number:kill_kr_au[i][j]})];
//             for(let _k in _asdf[1])
//             {
//                 if(!n[_k][_asdf[1][_k]]) n[_k][_asdf[1][_k]] = [];
//                 if(n[_k][_asdf[1][_k]].length<21)
//                 {
//                     n[_k][_asdf[1][_k]].push(kill_kr_au[i][j]);
//                 }
//             }
//         }
//     }
//     console.log(JSON.stringify(n));
// }
// changeData();
// 
module.exports = {
    killBtc,
    killKrAu
}