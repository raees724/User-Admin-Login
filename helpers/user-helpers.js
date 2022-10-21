var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
module.exports = {
    // doSignup:(userData) => {
    //     var statuss=null
    //     return new Promise(async(resolve,reject)=>{
    //     console.log(userData.password);
    //     let emailId=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
    //     if(!emailId){
    //         userData.password = await bcrypt.hash(userData.password,10)
    //         console.log(userData.password)
    //         db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
    //             console.log(data);

    //             resolve({statuss:true})
    //         })
    //     }else{
    //         console.log("This email exists")
    //         resolve({statuss:false})   
    //     }
    // })
    // },

    addUser: (user) => {
        var statuss = null
        return new Promise(async (resolve, reject) => {
            let emailId = await db.get().collection(collection.USER_COLLECTION).findOne({ email: user.email })
            if (!emailId) {
                user.password = await bcrypt.hash(user.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                    resolve({ statuss: true })
                })
            } else {
                console.log("This email exists")
                resolve({ statuss: false })
            }
        })
    },
    // addUser:(user, callback) => {
    //     console.log(user);
    //     user.password = bcrypt.hash(user.password,10)
    //     db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
    //         console.log(data);
    //         callback(data)
    //     })
    // },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
        })
    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    updateUser: (userId, userDetails) => {
        var statuss = null
        return new Promise(async (resolve, reject) => {
            let emailId = await db.get().collection(collection.USER_COLLECTION).findOne({_id:{$ne:objectId(userId)},email:userDetails.email})
            if(!emailId){
            userDetails.password = await bcrypt.hash(userDetails.password, 10)
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        name: userDetails.name,
                        email:userDetails.email,
                        // password: userDetails.password,
                        phone: userDetails.phone
                    }
                }).then((response) => {
                    console.log(response)
                    resolve({ statuss: true })
                })
            }else{
                console.log("This email exists")
                resolve({ statuss: false }) 
            }
        })
    }
}