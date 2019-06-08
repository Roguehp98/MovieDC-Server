const userModel = require('./model');
const mongoose = require('mongoose');

const users = async(root) => {
    try {
        const users = await userModel.find({});
        return users;
    }catch (err){
        console.log(err);
        throw new Error(err.message);
    }
}

const user = async(root,{idUser}) => {
    try {
        const user = await userModel.findOne({_id: idUser});
        return user;
    }catch (err){
        console.log(err);
        return null;
    }
}

const createUser = async(root, {username, password,name,gender,age}) => {
    try {
        const newUser = await userModel.create({username, password,name,gender,age})
        return newUser;
    }catch (err){
        console.log(err);
        throw new Error(err.message);
    }
}

const updateUser = async(root, {idUser,name,password,gender,age}) => {
    try {
        const dataChange = {name,password,gender,age}
        const userUpdated = 
                await userModel
                    .findOne({_id: idUser})
                    .then((userFound) => {
                        for(key in dataChange){
                            userFound[key] = dataChange[key];
                        }
                        return userFound.save();
                    }) 
        return userUpdated;
    }catch (err){
        console.log(err);
        throw new Error(err.message);
    }
}

const deleteUser = async(root,{id}) => {
    try {
        userModel.findOne({_id: id})
                .remove()
                .then(userDeleted => {return userDeleted})
        return id;
    }catch (err){
        console.log(err);
        throw new Error(err.message);
    }
}



module.exports = {
    users,
    user,
    createUser,
    updateUser,
    deleteUser
}