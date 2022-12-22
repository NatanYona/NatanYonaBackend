const knexConfig = require('./database/config.js');
const knex = require('knex')(knexConfig);

const chatLog = []

class ChatLog{
    constructor(){}

    getChatLog(){
        return chatLog
    }

    saveChatLog(message){
        chatLog.push(message)
        knex('messages').insert(message).then(()=> {
            console.info('message saved')
        }).catch(err =>{
            console.error(err)
        }).finally(() =>{
            knex.destroy();
        });
        return message
    }
}

module.exports = ChatLog