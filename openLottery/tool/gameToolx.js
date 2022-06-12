//
// const { createHash } = require('crypto');
// 
// 排序
const psort = async(d) => 
{
    let _abc = d.sort();
    return _abc;
}
// 1豹 2顺 3对 4半 5杂
const bsdbz = async(ee) =>
{
    let e = await psort(ee);
    // console.log();
    let _this_jg = '_' + (parseInt(e[0]) - parseInt(e[1])) + '_' + (parseInt(e[1]) - parseInt(e[2])) + '_';
    _this_jg = _this_jg.replace(/-/g, '');
    if (_this_jg == '_0_0_') return 'bao';
    if (_this_jg == '_1_1_'||(e[0]=='0'&&e[1]=='8'&&e[2]=='9') || (e[0]=='0'&&e[1]=='1'&& e[2]=='9')) return 'shun';
    if (_this_jg.indexOf('_0_') !== -1) return 'dui';
    if (_this_jg.indexOf('_1_') !== -1 || (e[0]=='0'&&e[2]=='9')) return 'ban';
    return 'za';
}
// 取尾数
const strLastOne = async(str) => {
    str = str + '';
    let spstr = str.split('');
    spstr = spstr[spstr.length - 1];
    return parseInt(spstr);
}
// 除以6，余数+1
const sixAddOne = async(num) => {
    return (num % 6)+1;
}
// PK 虎龙
const pklonghu = async(a, b) => {
    return parseInt(a) > parseInt(b) ? 'long' : 'hu';
}
// PK 小大 冠亚和
const pkdaxiao = async(a) => {
    return parseInt(a) > 11 ? 'da' : 'xiao';
}
// PK 小大 车道
const pkcddaxiao = async(a) => {
    return parseInt(a) > 5 ? 'da' : 'xiao';
}
// PK 单双
const pkdanshuang = async(a) => {
    return parseInt(a) % 2 == 0 ? 'shuang' : 'dan';
}
// 群玩法 小大
const qundaxiao = async(a) => {
    return parseInt(a) > 13 ? 'da' : 'xiao';
}
// 群玩法 极大极小
const qunJi = async(a) => 
{
    if(['0','1','2','3','4','5','22','23','24','25','26','27'].find(v=>v==(a+''))) return 'ji';
    return '';
}
// 数组相加
const strArrSum = async(arr) => {
    let _r = arr.reduce(function(prev, curr) {
        return parseInt(prev) + parseInt(curr);
    });
    return _r;
}
// 区位
const areaNum = (type) => {
    if (type == 'dd') {
        return {
            11: [
                [0, 1, 2, 3, 4, 5],
                [12, 13, 14, 15, 16, 17]
            ],
            16: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ],
            28: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ],
            36: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ]
        }
    }
    return {
        11: [
            [0, 3, 6, 9, 12, 15],
            [2, 5, 8, 11, 14, 17]
        ],
        16: [
            [0, 3, 6, 9, 12, 15],
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17]
        ],
        28: [
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17],
            [3, 6, 9, 12, 15, 18]
        ],
        36: [
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17],
            [3, 6, 9, 12, 15, 18]
        ]
    }
};
// 
const modeToJg = async(e, d) => {
    if (e == 11 || e == 16) return sixAddOne(d);
    return strLastOne(d);
};
const showJg = async(e, d) => {
    if (e == '36') return await bsdbz(d);
    return await strArrSum(d);
};
// 
const DdBjJndJg = async(type, mode, number) => {
    // console.log(type, mode, number);
    // 开奖号码
    let _area = areaNum(type)[mode];
    // 取得号码
    let num = [];
    for (let ii in _area) {
        num[ii] = [];
        for (let i in _area[ii]) {
            num[ii][i] = number[_area[ii][i]];
        }
        num[ii] = await strArrSum(num[ii]);
        num[ii] = await modeToJg(mode, num[ii]);
    }
    //
    const _jg = await showJg(mode, num);
    return _jg;
};
// 
const getGameListData = async(category, data) => 
{
    if(!data || !data.number) return data;
    //
    const { number } = data;
    // 
    let result = {};
    const _other_types = [ 36, 11, 16, 28 ];
    // const _other_types = [ 36, 11, 16 ];
    for(let j in _other_types)
    {
        let _j = _other_types[j];
        result[_j] = await DdBjJndJg(category, _j, number);
    }
    return result;
}
//
const getGameType = async(category, data) => 
{
    return await getGameListData(category, data);
}
// 
// 投注情况
const gameBetData = async(category) => 
{
    let arr = [28,11,16,36,'28gd'];
    if(category=='pk') arr = ['sc','gyh','10','22','gj','lh'];
    // 
    let _r = {};
    for(let i in arr)
    {
        _r[arr[i]] = [
            0, // 投注金额
            0, // 投注人数
            0, // 中奖人数
        ];
    }
    return _r;
}
const gameBetDatas = async(category) => 
{
    let result = {};
    if(category=='jnd')
    {
        result['jnd'] = await gameBetData('jnd');
        result['pk'] = await gameBetData('pk');
        return result;
    }
    if(category=='ddbj')
    {
        result['bj'] = await gameBetData('bj');
        result['dd'] = await gameBetData('dd');
        return result;
    }
    result[category] = await gameBetData(category);
    return result;
}
//
const twoNumberRandom = async(min, max) =>
{
    return Math.random() * (max - min) + min;
}
const winnum = async(b) => 
{
    if(b<1) return [0,0];
    // 
    let _x = (parseInt(await twoNumberRandom(2,8))/10).toFixed(1);
    let _n = parseInt(b*_x);
    if(b<3&&_n<1) return [parseInt(await twoNumberRandom(8,20)),parseInt(await twoNumberRandom(1,6))];
    return _n;
}
const gamePwin = async(p) => 
{
    let _p = {};
    for(let i in p)
    {
        _p[i] = {};
        for(let j in p[i])
        {
            let _pij = p[i][j];
            if(_pij[1]&&_pij[2]&&_pij[1]>0&&_pij[2]>0)
            {
                _p[i][j] = _pij;
            }else{
                _p[i][j] = [
                    _pij[0],
                    ...await winnum(_pij[1])
                ];
            }
        }
    }
    return _p;
}
//
module.exports = {
    //
    bsdbz,
    strLastOne,
    sixAddOne,
    pklonghu,
    pkdaxiao,
    pkdanshuang,
    strArrSum,
    //
    DdBjJndJg,
    getGameListData,
    getGameType,
    gameBetDatas,
    gamePwin
};