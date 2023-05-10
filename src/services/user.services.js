const userSchema = require ('../services/mongo/models/user.model.js');
const uuidv4 = require('uuid').v4;


class UserConstructor{
    constructor(){}

    saveUser(user){
        const newUser = new userSchema({
            id: uuidv4(),
            username: user.username,
            password: user.password,
        })
        newUser.save()
        return newUser
    }

    verifyUser(user){
        const verifyUser = userSchema.findOne({"username": user.username})
        if(verifyUser.password === user.password){
            return true
        }else{
            return false
        }
    }
}


module.exports = UserConstructor;