import { 
    connection 
} from './db.js'
import * as np from './novaposhta.js'

export const createTTN = (phone, ttnNumber, ScheduledDeliveryDate, status) => {
    connection.query(`INSERT INTO ttn (phone, TTN, data, status) VALUES ('${phone}','${ttnNumber}', '${JSON.stringify({ScheduledDeliveryDate: ScheduledDeliveryDate})}', '${status}')`)
}

export const IsRealNumberTTN = (phone , ttn, bot_admin, chatID) => {
    const value = np.getStatusDocuments([{
        TTN: ttn,
        phone: phone
    }])
    value.then(res => {
        console.log(res)
        if(res.success){
            checkNumberTTN(ttn, function(exists) {
                if (exists) {
                    bot_admin.sendMessage(chatID, 'Така ТТН вже існує', {
                        "parse_mode": "Markdown",
                        "reply_markup": {
                            "keyboard": [
                                [{
                                    text: `Створення ТТН ${String.fromCodePoint(0x1F513)}`
                                }, {
                                    text: '/start'
                                }]
                            ]
                        }
                    })
                    return;
                }
                const status = np.getStatusDocuments([{
                    TTN: ttn,
                    phone: phone
                }])
                status.then(res => {
                    let messageText = `По вашому замовленню створенно ТТН ${ttn} \n`
                    if (res.data[0] != undefined && res.data[0].ScheduledDeliveryDate != undefined) {
                        connection.query(`INSERT INTO ttn (phone, TTN, data, status) VALUES ('${phone}','${ttn}', '${JSON.stringify({ScheduledDeliveryDate: res.data[0].ScheduledDeliveryDate})}' , ${res.data[0].StatusCode})`)
                        messageText += "Очікувана дата прибуття: " + res.data[0].ScheduledDeliveryDate
                    } else {
                        connection.query(`INSERT INTO ttn (phone, TTN) VALUES ('${phone}','${ttn}')`)
                    }
                    checkNumberPhone(phone, function(userId) {
                        if (userId) {
                            bot_admin.sendMessage(userId[0].chatid, messageText)
                        }
                    })
                })
                bot_admin.sendMessage(chatID, 'Створено нову ТТН',{
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "keyboard": [
                            [{
                                text: `Створення ТТН ${String.fromCodePoint(0x1F513)}`
                            }, {
                                text: '/start'
                            }]
                        ]
                    }
                })
            })
        }else{
            bot_admin.sendMessage(chatID, 'Це не схоже на номер TTN', {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "keyboard": [
                        [{
                            text: `Створення ТТН ${String.fromCodePoint(0x1F513)}`
                        }, {
                            text: '/start'
                        }]
                    ]
                }
            })
        }
    })
}

export const selectNumberAndTTN = (phone,callback) => {
    connection.query("SELECT * FROM `ttn` WHERE `phone` = " + phone , function(err,results){
        if(results.length > 0){
            return callback(results)
        }
            return callback(false)
    })
}

export const selectAllId = (adminId ,callback) => {
    connection.query("SELECT * FROM `user` WHERE `chatid`!= " + adminId , function(err,results){
        if(results.length > 0){
            return callback(results)
        }
            return callback(false)
    })
    
}

export const checkUserId = (id, callback) => {
    connection.query("SELECT * FROM `user` WHERE `chatid` = " + id, function(err, results) {
        if(results.length > 0){
            return callback(true)
        }
        return callback(false)
    })
    
}

export const checkNumberTTN = (ttn, callback) => {
    connection.query("SELECT * FROM `ttn` WHERE `TTN` = " + ttn, function(err, results) {
        if(results.length > 0){
            return callback(true)
        }
        return callback(false)
    })
    
}
export const checkNumber = (AStr) => {
    return AStr.match(/^((\+?3)?8)?0\d{9}$/) != null;
}

export const addslashes = (str) => {	
	return str.replace('/(["\'\])/g', "\\$1").replace('/\0/g', "\\0");
}

export const checkNumberPhone = (number, callback) => {
    connection.query("SELECT chatid FROM `user` WHERE `number` = " + number, (err, results) => {
        if(results.length > 0){
            return callback(results)
        }
        return callback(false) 
    })
}

export const selectNumber = (chatID, callback) => {
    connection.query("SELECT `number` FROM `user` WHERE `chatid` = " + chatID, (err, result) => {
        if (result.length > 0) {
            return callback(result)
        } else {
            return callback(false)
        }
    })
}

export const addUserFromMessage = (msg) => {
    connection.query(`INSERT INTO user(name, number, chatid) VALUES ('${addslashes(msg.contact.first_name)}','${msg.contact.phone_number.replace('+', '')}',${msg.contact.user_id})`)
}
