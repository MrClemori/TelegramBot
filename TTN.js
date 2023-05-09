import { connection } from './db.js'
import * as np from './novaposhta.js'

// --
export const createTTN = (phone, ttnNumber, ScheduledDeliveryDate, status) => {
    connection.query(`INSERT INTO ttn (phone, TTN, data, status) VALUES ('${phone}','${ttnNumber}', '${JSON.stringify({ScheduledDeliveryDate: ScheduledDeliveryDate})}', '${status}')`)
}

export const checkAllTTNInDay = () => {
    let arrayDocuments = np.getArrayDocuments()
}
// --

// func check status
export const checkStatus = (bot) => {
    connection.query('SELECT * FROM ttn WHERE status != 9', function(err,results) {
        results.forEach(element => {
            let res = np.getStatusDocuments([element])
            res.then(el => {
                connection.query('SELECT `chatid` FROM `user` WHERE `number` = ' + element.phone, function(err, idAuthorizationUser){
                    if(el.data[0].StatusCode != element.status){
                        connection.query('UPDATE `ttn` SET `status`= '+ Number(el.data[0].StatusCode) +' WHERE `TTN` = ' + Number(element.TTN))
                    }
                    if(el.data[0].StatusCode == 4 || el.data[0].StatusCode == 41 || el.data[0].StatusCode == 7 || el.data[0].StatusCode == 8 || el.data[0].StatusCode == 12){
                        if(idAuthorizationUser.length > 0){
                            switch (el.data[0].StatusCode) {
                                case 4:
                                    bot.sendMessage(idAuthorizationUser[0].chatid, `Ваше відправлення вже у місті`)
                                    break;
                                case 41:
                                    bot.sendMessage(idAuthorizationUser[0].chatid, `Ваше відправлення вже у місті`)
                                    break;
                                case 7:
                                    bot.sendMessage(idAuthorizationUser[0].chatid, `Ваше відправлення вже на відділенні`)
                                    break;
                                case 8:
                                    bot.sendMessage(idAuthorizationUser[0].chatid, `Ваше відправлення вже знаходиться в Поштоматі`)
                                    break;
                                case 12:
                                    bot.sendMessage(idAuthorizationUser[0].chatid, `Нова Пошта комплектує ваше відправлення`)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                })
            })
        })
    })
}