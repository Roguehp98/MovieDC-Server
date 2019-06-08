const bcrypt = require('bcrypt-nodejs');
const userModel = require('../user/model');

const login = async (parent, { username, pwd }, { req }) => {
    const user =  await userModel.findOne({username})
                        .then((userFound) => {
                            if(userFound) {
                                if ( bcrypt.compareSync(pwd, userFound.password)) {
                                    req.session.user = userFound;
                            
                                    return userFound;
                                }
                                throw new Error('Incorrect password.');
                            }
                            throw new Error('No Such User exists.');   
                        })
    return user;
}  

const logout = async(parent, args, { req }) => {
    req.session.destroy();
    return "Logout successfully";
}

module.exports = {
    login,
    logout
}