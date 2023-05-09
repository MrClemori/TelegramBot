import * as Function from "./functions.js"
import {
    getStatusDocuments
} from './novaposhta.js'

const text_ReturnToMainMenu = 'Повернутись на головну'
const text_Greetings = 'Привіт! Мене звати Адольф, я чат-бот, помічник 🖤'
const text_ChooseSection = 'Вибери потрібний розділ\n'
const text_TrackingButton = `Трекінг 📦`
const text_LookingForOrder = 'Супер!  Я вже шукаю твоє замовлення...⌛️'
const text_NoOrderFound = 'Наші менеджери ще оформляють твоє замовлення, протягом 3-х годин надішлю тобі оновлену інформацію...⏳'
const text_ButtonAskForNumber = '📱Надай свій номер телефону за яким було оформлено покупку, \n щоб я знайшов твоє замовлення💪 \n Жми на кнопку нижче'
const text_ShareNumber = 'Поділитись номером'

const text_MenuKeyboard = [
    [{
        text: text_TrackingButton
    }],
    [{
        text: `Контакти ${String.fromCodePoint(0x1F4DE)}`
    }, {
        text: `ТОП пропозицій ${String.fromCodePoint(0x1F525)}`
    }]
]


export const start = (bot, msg) => {
    const chatID = msg.chat.id
    const text = msg.text
    console.log(msg)
    if (text === '/start' || text === text_ReturnToMainMenu) {
        Function.checkUserId(chatID, function(result) {
            if (result === true) {
                return setTimeout(() => {
                    bot.sendMessage(chatID, text_Greetings)
                    bot.sendMessage(chatID, text_ChooseSection, {
                        "parse_mode": "Markdown",
                        "reply_markup": {
                            "keyboard": text_MenuKeyboard
                        }
                    })
                }, 500)
            } else {
                return setTimeout(() => {
                    bot.sendMessage(chatID, text_Greetings)
                    bot.sendMessage(chatID, text_ChooseSection, {
                        "parse_mode": "Markdown",
                        "reply_markup": {
                            "keyboard": [
                                [{
                                    text: text_ShareNumber
                                }],
                                [{
                                    text: `Контакти ${String.fromCodePoint(0x1F4DE)}`
                                }, {
                                    text: `ТОП пропозицій ${String.fromCodePoint(0x1F525)}`
                                }]
                            ]
                        }
                    })
                }, 500)
            }
        })
    }
    if (text === text_ShareNumber) {
        return setTimeout(() => {
            bot.sendMessage(chatID, text_ButtonAskForNumber, {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "keyboard": [
                        [{
                            text: 'Поділитись',
                            request_contact: true
                        }],
                        [{
                            text: text_ReturnToMainMenu
                        }]
                    ]
                }
            })
        }, 1500)
    }
    if (text === text_TrackingButton) {
        return setTimeout(() => {
            Function.selectNumber(chatID, function(exists) {
                Function.selectNumberAndTTN(exists[0].number, function(exists) {
                    if (exists) {
                        if(exists[0].status != 9){
                            const status = getStatusDocuments(exists)
                            status.then(res => {
                                res.data.forEach(element => {
                                    let messageText = `По вашому замовленню створенно ТТН ${element.Number} \n`
                                    if (element.ScheduledDeliveryDate != undefined) {
                                        messageText += "Очікувана дата прибуття: " + element.ScheduledDeliveryDate
                                    }
                                    bot.sendMessage(chatID, messageText)
                                })
                            })
                        } else {
                        console.log('not exists')
                        bot.sendMessage(chatID, text_LookingForOrder)
                        return setTimeout(() => {
                            bot.sendMessage(chatID, text_NoOrderFound, {
                                "parse_mode": "Markdown",
                                "reply_markup": {
                                    "keyboard": [
                                        [{
                                            text: text_ReturnToMainMenu
                                        }]
                                    ]
                                }
                            })
                        }, 5000)
                    }}
                })
            })
        }, 1500)
    }
    if (msg.contact) {
        Function.checkUserId(msg.chat.id, function(exists) {
            if (exists) {
                bot.sendMessage(chatID, 'твій номер вже є')
            } else {
                Function.addUserFromMessage(msg)
                Function.selectNumberAndTTN(msg.contact.phone_number, function(exists) {
                    if (exists) {
                        const status = getStatusDocuments(exists)
                        status.then(res => {
                            res.data.forEach(element => {
                                let messageText = `По вашому замовленню створенно ТТН ${element.Number} \n`
                                if (element.ScheduledDeliveryDate != undefined) {
                                    Function.createTTN(msg.contact.phone_number, element.Number, element.ScheduledDeliveryDate)
                                    messageText += "Очікувана дата прибуття: " + element.ScheduledDeliveryDate
                                }
                                bot.sendMessage(chatID, messageText)
                            })
                        })
                    } else {
                        bot.sendMessage(chatID, text_LookingForOrder)
                        return setTimeout(() => {
                            bot.sendMessage(chatID, text_NoOrderFound, {
                                "parse_mode": "Markdown",
                                "reply_markup": {
                                    "keyboard": [
                                        [{
                                            text: text_ReturnToMainMenu
                                        }]
                                    ]
                                }
                            })
                        }, 5000)
                    }
                })
            }
        })
    }
}