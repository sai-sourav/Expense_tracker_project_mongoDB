const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.usersignup = async (req, res, next) => {
    try{
        const name = req.body.name;
        const emailid = req.body.emailid;
        const pswd = req.body.pswd;
        if((name === "") || (emailid === "") || (pswd === "")){
            return res.status(500).json({fields : "empty"});
        }
        let search = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        search = search[0];
        if(!search){
            bcrypt.hash(pswd, saltRounds, async(err,hash) => {
                const response = await User.create({
                    name : name,
                    emailid : emailid,
                    password : hash
                });
                res.status(201).json({
                    found : false,
                    created : true
                });
            });
        }else{
            res.status(200).json({
                found : true,
                created : false
            })
        }
    }catch(err) {
        if(err) {
           res.status(500).json({
            found : false,
            created : false,
            error : err
           });
        }
    }
}

exports.usersignin = async (req, res, next) => {
    try{
        const emailid = req.body.emailid;
        const pswd = req.body.pswd;
        if((emailid === "") || (pswd === "")){
            return res.status(500).json({fields : "empty"});
        }
        let search = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        search = search[0];
        
        if(!search){
            res.status(404).json({
                email : false,
                pswd : false
            });
        }else {
            bcrypt.compare(pswd, search.password, async (err,result) => {
                if(err){
                    throw new Error("something went wrong");
                }
                else{
                    if(result === true){
                        res.status(200).json({
                            email : true,
                            pswd : true,
                            token : generateaccesstoken(search.id)
                        })
                    }
                    else {
                        res.status(401).json({
                            email : true,
                            pswd : false
                        });
                    }
                }
            })
        }

    }catch(err) {
        if(err) {
           res.status(500).json({
            error : err
           });
        }
    }
}

exports.forgotpassword = (req, res, next) => {
    const emailid = req.params.emailid;
    console.log(emailid);
    res.status(200).json({status: "success"});
}

function generateaccesstoken(id) {
    return jwt.sign({ userid : id } , process.env.TOKEN_SECRET);
}