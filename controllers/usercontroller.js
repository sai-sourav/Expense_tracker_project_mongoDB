const User = require('../models/user');
const Forgotpswd = require('../models/forgotpswd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const IP = "localhost";
const {v4 : uuidv4} = require('uuid')
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

exports.forgotpassword = async (req, res, next) => {
    const emailid = req.params.emailid;
    try{
        let user = await User.findAll( {where : {emailid : emailid} });
        user = user[0];
        if(!user){
            return res.status(404).json({ found: "false",status: "success"});
        }
        else {
            const newId = uuidv4();
            const result = await user.createForgotPasswordRequest({
                id: newId,
                isactive: true
            })
            res.status(200).json({
                found: "true",
                link: `http://${IP}:4000/html/forgotpassword.html?id=${newId}`,
                status: "success"
            })
        }
    }catch(err){
        if(err){
            res.status(500).json({
                found: "false",
                status: "failed",
                error: err
            })
        }
    }
    
}

exports.resetpassword = async (req, res, next) => {
    const newpswd = req.body.newpswd;
    const uid = req.body.uid;
    const getforgotpswd = await Forgotpswd.findByPk(uid);
    const userid = getforgotpswd.userId;
    if (getforgotpswd.isactive === true){
        try{
            const user = await User.findByPk(userid);
            bcrypt.hash(newpswd, saltRounds, async(err,hash) => {
                if (err){
                    return res.status(500).json({
                        error : err
                    });
                }
                const response = await user.update({
                    password : hash
                });
                await getforgotpswd.update({
                    isactive : false
                });
                res.status(201).json({
                    updated : true
                });
            });
        }catch(err){
            res.status(500).json({
                error : err
            });
        }
    } else {
        res.status(404).json({
            link: "expired"
        })
    }


    
}

function generateaccesstoken(id) {
    return jwt.sign({ userid : id } , process.env.TOKEN_SECRET);
}