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