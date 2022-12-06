const User = require('../models/user');

exports.usersignup = async (req, res, next) => {
    try{
        const name = req.body.name;
        const emailid = req.body.emailid;
        const pswd = req.body.pswd;
        let search = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        search = search[0];
        if(!search){
            const response = await User.create({
                name : name,
                emailid : emailid,
                password : pswd
            });
            res.status(201).json({
                found : false,
                created : true
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
        let search_email = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        search_email = search_email[0];
        
        if(!search_email){
            res.status(404).json({
                email : false,
                pswd : false
            });
        }else {
            if(search_email.password === pswd){
                res.status(200).json({
                    email : true,
                    pswd : true
                })
            } else{
                res.status(401).json({
                    email : true,
                    pswd : false
                });
            }
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