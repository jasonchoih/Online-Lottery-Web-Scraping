const {
    contro_get
} = require('../tool/redis');
// 
const test = async ()=>
{
    const _perv = await contro_get('game_list_au');
    console.log(_perv);
}
// 
test();