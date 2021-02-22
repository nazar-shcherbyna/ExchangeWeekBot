const {Telegraf} = require("telegraf");
const axios = require('axios');
var moment = require('moment');
const cc = require('currency-codes');
const { resolve } = require("path");
const TOKEN = process.env.TOKEN || "1693125881:AAFxpYEDuHibSuX7i7OygBGGjS9i8beA1Is";
const BASE = 'USD'
const bot = new Telegraf(TOKEN);
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
const REQUEST_URL = `https://api.exchangeratesapi.io/latest?base=${BASE}`;

bot.start((ctx) => {
    return ctx.reply('Welcome');
})

let lastUpdateTime = null; 
bot.hears('/list', async (ctx) => {
    try {

        let currencyObj = {},
        currData = {};
        lastUpdateTime = new Date().getTime();
        
        if (!lastUpdateTime || Math.abs(lastUpdateTime - new Date().getTime()) > 10 * 60 * 1000) {
            console.log('обновление данных');
            currencyObj = await axios.get(REQUEST_URL);
            lastUpdateTime = new Date().getTime();
            currData = currencyObj.data;
            localStorage.clear();
            localStorage.setItem('currency', JSON.stringify(currData));
        } else {
            console.log('Данные из локального хранилища');
        }


        let list = localStorage.getItem('currency');

        listObj = JSON.parse(list);

        let arrCurr = []

        for (key in listObj.rates) {
            arrCurr.push(key + ' - ' + listObj.rates[key].toFixed(2));
        }

        if (listObj) {
            return ctx.reply('Список всех валют для конвертации: ' + '\n' + `Базовая ${listObj.base}` + '\n' + arrCurr.join('\n'));
        }
        

    } catch (error){
        console.log(error);
        return ctx.reply(error);
    }
})

bot.startPolling();

// let beforeOne = null;
// let beforeTwoo = null;
// let dayPerStart = 1000 * 60 * 60 * 24;
// let hourPerStart = 1000 * 60 * 60;
// let minPerStart = 1000 * 60;


// setTimeout(() => {
//     beforeOne = new Date().getTime();
    // console.log((beforeOne / (dayPerStart)).toFixed());
    // console.log((beforeOne / (hourPerStart)).toFixed());
//     console.log((beforeOne / (minPerStart)).toFixed());
// }, 2000);

// setTimeout(() => {
//     beforeTwoo = new Date().getTime(); 
//     console.log(beforeTwoo - beforeOne);
// }, 6000);

// setTimeout(() => {
//     if ((beforeTwoo - beforeOne) >= 3900) {
//         console.log('4 секунды');
//     } else {
//         console.log('Any numbers');
//     }
// }, 8000);

// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         beforeOne = new Date().getTime();
//         // console.log((beforeOne / (dayPerStart)).toFixed());
//         // console.log((beforeOne / (hourPerStart)).toFixed());
//         console.log((beforeOne / (minPerStart)).toFixed());
//         resolve(beforeOne);
//     }, 2000);
// })

// p.then((data) => {
//     const p2 = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             beforeTwoo = new Date().getTime();
//             console.log(beforeTwoo); 
//             resolve(data);
//         }, 2000)
//     })

//     p2.then(clData => {
//         console.log('Promise P2 resolved', clData);
//     })
// })

// const sleep = (ms) => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(), ms);
//     })
// }

// // sleep(3000).then(() => console.log('My promise 3'))
// // sleep(5000).then(() => console.log('My promise 5'))

// Promise.all([sleep(2000),sleep(5000)]).then(() => console.log('All Promises'))

// Promise.race([sleep(2000),sleep(5000)]).then(() => console.log('Race Promises'))