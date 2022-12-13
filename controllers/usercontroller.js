const User = require('../models/user');
const Forgotpswd = require('../models/forgotpswd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const IP = "localhost";
const {v4 : uuidv4} = require('uuid');
const Expense = require('../models/expenses');
const Credit = require('../models/credits');
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
        var URL;
        if((emailid === "") || (pswd === "")){
            return res.status(500).json({fields : "empty"});
        }
        let search = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        if (search.length > 0){
            search = search[0];
            const ispremiumuser = search.ispremiumuser;
            if (ispremiumuser === true){
                URL = `http://${IP}:4000/premiumhtml/practice.html`

            }else{
                URL = `http://${IP}:4000/html/addExpense.html`
            }
            bcrypt.compare(pswd, search.password, async (err,result) => {
                if(err){
                    throw new Error("something went wrong");
                }
                else{
                    if(result === true){
                        res.status(200).json({
                            email : true,
                            pswd : true,
                            token : generateaccesstoken(search.id),
                            url : URL
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
        }else {
            res.status(404).json({
                email : false,
                pswd : false
            });
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

exports.getlifetimedata = async (req,res,next) => {
    const userid = req.body.userid;
    try{
        let totalexpenses = await Expense.sum('amount',{
            where: {
                userId : userid
            }
        });
        let totalcredits = await Credit.sum('amount',{
            where: {
                userId : userid
            }
        });
        if(totalcredits === null){
            totalcredits = 0;
        }
        if(totalexpenses === null){
            totalexpenses = 0;
        }
        res.status(200).json({
            lifetimeexpenses : totalexpenses,
            lifetimecredits : totalcredits,
            status : "success"
        })
    }catch(err){
        res.status(500).json({error : err.response});
    }
}

exports.getleaderboard = async (req,res,next) => {
    const array = [];
    try{
        const users = await User.findAll();
        for(i=0; i<users.length; i++){
            const user = users[i];
            let totalcredits = await Credit.sum('amount',{
                where: {
                    userId : user.id
                }
            });
            if(totalcredits === null){
                totalcredits = 0;
            }
            const obj = {
                name : user.name,
                credits : totalcredits
            }
            array.push(obj);
        }
        array.sort((a, b) => b.credits - a.credits);
        res.status(200).json({
            array : array,
            status : "success"
        })
    }catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    }
}

function generateaccesstoken(id) {
    return jwt.sign({ userid : id } , process.env.TOKEN_SECRET);
}