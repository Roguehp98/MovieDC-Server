const userModel = require('../user/model');

const ADD_LISTFV = 'ADD_LISTFV';
const REMOVE_LISTFV = 'REMOVE_LISTFV';

const addListFv = async(root, {idUser, idMovie, nameMovie,typeMovie},{pubsub}) => {
    try {
        const moviefv = {id: idMovie, name: nameMovie,type: typeMovie};
        const user = await userModel.findById(idUser)
                                    .then(userFound => {
                                        userFound.listfv.push(moviefv);
                                        return userFound.save();
                                    })
        // console.log(user.listfv);
        pubsub.publish(ADD_LISTFV,{addListFavor: {
            id: idUser,
            listfv:[{
                id: idMovie,
                name: nameMovie,
                type: typeMovie,
            }]
        }} )
        return user;
    }catch(err) {
        console.log(err)
        throw new Error(err.message)
    }
}

const removeListfv = async(root,{idUser,idMovie},{pubsub}) => {
    try {
        const user =
             await userModel.findOne({_id: idUser})
                            .then(userFound => {
                                userFound.listfv.forEach((element,index) => {
                                    if(element.id === idMovie)
                                        userFound.listfv.splice(index,1);
                                })
                                return userFound.save();
                            })
        pubsub.publish(REMOVE_LISTFV, {removeListFavor: {
            id: idUser,
            listfv: [{
                id: idMovie
            }]
        }})                    
        return user;
    }catch(err) {
        console.log(err)
        throw new Error(err.message)
    }
}

module.exports = {
    addListFv,
    removeListfv
}