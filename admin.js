import * as Function from "./functions.js"
//
const start = '/start'
const back = 'Повернутись на головну'
const createNumberAndTTN = 'Напиши номер телефону та номер ТТН через пробіл або натисніть /start щоб повернутись'
const writeToTheUser = 'Розсилка'

export const startAdmin = (bot_admin, msg) => {
    const chatID = msg.chat.id
    const text = msg.text
    console.log(msg)
    if (text === start || text === back) {
        bot_admin.sendMessage(chatID, 'Створимо ТТН', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "keyboard": [
                    [{
                        text: writeToTheUser
                    }]
                ]
            }
        })
    }
    if (text === writeToTheUser) {
        bot_admin.sendMessage(chatID, 'Напишіть повідомлення та прикрипіть фото або натисніть /start щоб повернутись', {
            "parse_mode": "Markdown",
            "reply_markup": {
                'force_reply': true
            }
        })
    }
    if (msg.reply_to_message && msg.reply_to_message.text === 'Напишіть повідомлення та прикрипіть фото або натисніть /start щоб повернутись') {
        Function.selectAllId(chatID, function(exists) {
            exists.forEach(element => {
                bot_admin.copyMessage(element.chatid, chatID, msg.message_id)
                console.log('exists ->' + element.chatid)
            });
        })
    }
    if (msg.reply_to_message && msg.reply_to_message.text === createNumberAndTTN) {
        const data = text.split(' ')
        const phone = data[0].replace('+', '')
        const ttnNumber = data[1]
        if (Function.checkNumber(phone)) {
            Function.IsRealNumberTTN(phone , ttnNumber, bot_admin, chatID)
        } else {
            bot_admin.sendMessage(chatID, 'Це не схоже на номер телефону', {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "keyboard": [
                        [
                        {
                            text: start
                        }]
                    ]
                }
            })
        }
    }
}