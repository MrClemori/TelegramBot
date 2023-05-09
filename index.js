import TelegramApi from 'node-telegram-bot-api'
import * as botUser from './bot.js'
import {startAdmin} from  "./admin.js"
import * as Checking from "./TTN.js"

// let token
// let chatIdAdmin
const bot = new TelegramApi(token, {polling: true})

function start () {
    bot.on("polling_error", console.log)
    bot.on('message', msg => {
        const chatID = msg.chat.id
        if(chatID === chatIdAdmin){
            startAdmin(bot, msg)
        }else{
            botUser.start(bot,msg)
        }
    })
}
start()

// new func 
setInterval((bot) => {
    Checking.checkStatus(bot)
    Checking.checkAllTTNInDay() 
}, 1000  * 60 * 60  );
