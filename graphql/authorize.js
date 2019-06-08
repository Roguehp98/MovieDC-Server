const isLoggedIn = async (resolve, parent, args,{req}, ctx, info) => {
  // console.log(args.idUser);
  // console.log(req.session)
  if (req.session.user && req.session.user._id === args.idUser ) {
    return resolve()
    
  }
  throw `Not authorised!`
}


const permissions = {
  Query: {
    secured: isLoggedIn,
    // user: isLoggedIn
  },
  Mutation: {
    updateUser: isLoggedIn,
    addListFv: isLoggedIn,
    removeListfv: isLoggedIn
  }
} 

module.exports = permissions;