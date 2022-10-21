var db=require('../config/connection')
var collection=require('../config/collection');
const bcrypt=require('bcrypt')
const { MongoCompatibilityError } = require('mongodb');
const { response } = require('../app');
module.exports={
    doSignup:(userData) => {
        var statuss=null
        return new Promise(async(resolve,reject)=>{
        console.log(userData.password);
        let emailId=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
        if(!emailId){
            userData.password = await bcrypt.hash(userData.password,10)
            console.log(userData.password)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                console.log(data);
                
                resolve({statuss:true})
            })
        }else{
            console.log("This email exists")
            resolve({statuss:false})   
        }
    })
    },
    doLogin:(userData)=>{
        let loginStatus=false
            let response={}
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                console.log(userData.password)
                console.log(user.password)
       bcrypt.compare(userData.password,user.password).then((status)=>{
if(status){
    console.log("login success");
    response.user=user
    response.status=true
    resolve(response)
}else{
    console.log("login failed")
    resolve({status:false})
}
})
}else{
    console.log("login failed")
    resolve({status:false})
  }
        })
    }
}