const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const fvSchema = new Schema({
    id: {type: String, require: true},
    name: {type: String, require: true},
    type: {type: String, require: true}
})

const UserSchema = new Schema({
    username: {type: String,unique: true,require: true},
    password: {type: String,unique: true,require: true},
    name: {type: String,require: true},
    gender: {type: String},
    age: {type: Number},
    listfv : [fvSchema]
})

UserSchema.pre('save',function(next){
    if(this.isModified('password')){
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(this.password,salt);
        this.password = hashPassword;     
    }
    // console.log(bcrypt.compareSync("tgh",this.password))
    next();
}) 



module.exports= mongoose.model('User',UserSchema);