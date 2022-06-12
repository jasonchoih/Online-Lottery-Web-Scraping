// 
const redisConfig={
    port: 6379,
    host: '127.0.0.1',
    password: 'Yf@gert&*4RTer%fg45@#4Ui56$%ertTy5e',
    db: 0,
}
// 
const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient(redisConfig);
// 
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const lpushAsync = promisify(client.lpush).bind(client);
// 
let abc = 1;
const test = async() => 
{
    // await setAsync('abc', 123);
    // const _abc = await getAsync('abc');
    // // 
    // console.log(_abc);

    let _abc = [];
    for(let i=1;i<100;i++)
    {
        _abc.push(abc);
        abc++;
    }

    await lpushAsync('lottery_open_data', JSON.stringify({ 
        _abc
    }));

}

setInterval(async()=>{
    test();
},1000)
