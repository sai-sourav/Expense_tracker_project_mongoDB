const User = require('../models/user');
const Forgotpswd = require('../models/forgotpswd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const IP = "localhost";
const {v4 : uuidv4} = require('uuid');
const Debit = require('../models/expenses');
const Credit = require('../models/credits');
const AWS = require("aws-sdk");
const Fileurl = require('../models/fileurl');
exports.usersignup = async (req, res, next) => {
    try{
        const name = req.body.name;
        const emailid = req.body.emailid;
        const pswd = req.body.pswd;
        if((name === "") || (emailid === "") || (pswd === "")){
            return res.status(500).json({fields : "empty"});
        }
        let search = await User.find(
            {
                email: emailid
            }
        );
        search = search[0];
        if(!search){
            bcrypt.hash(pswd, saltRounds, async(err,hash) => {
                const user = new User({ 
                    name : name,
                    email : emailid,
                    password : hash,
                    forgotpswdrequests: [],
                    credits: [],
                    debits: [],
                    orders: [],
                    fileurl: [] 
                })
                const response = await user.save();
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
        let search = await User.find({
            email: emailid
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
        let user = await User.find( {email : emailid} );
        user = user[0];
        if(!user){
            return res.status(404).json({ found: "false",status: "success"});
        }
        else {
            const newId = uuidv4();
            const forgotpswd = new Forgotpswd({
                id: newId,
                isactive: true,
                createdAt: new Date(),
                userid: user._id
            })
            const result = await forgotpswd.save();
            const requestarray = user.forgotpswdrequests;
            requestarray.push({
                requestid: result._id
            })
            user.forgotpswdrequests = requestarray;
            const result1 = await user.save();
            res.status(200).json({
                found: "true",
                link: `http://${IP}:4000/html/forgotpassword.html?uniqueid=${newId}`,
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
    let getforgotpswd = await Forgotpswd.find({id: uid});
    getforgotpswd = getforgotpswd[0];
    const userid = getforgotpswd.userid;
    if (getforgotpswd.isactive === true){
        try{
            const user = await User.findById(userid);
            bcrypt.hash(newpswd, saltRounds, async(err,hash) => {
                if (err){
                    return res.status(500).json({
                        error : err
                    });
                }

                user.password = hash;
                await user.save();

                getforgotpswd.isactive = false;
                await getforgotpswd.save();
                
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
        const user = await User.findById(userid);
        if(user.ispremiumuser === false){
            return res.status(401).json({error : err.response});
        }
        let count = user.credits.length;
        let debitscount = user.debits.length;
        let totalcredits;
        if(count !== 0){
            totalcredits = await Credit.aggregate([
                { $match: { userId : user._id } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            totalcredits = totalcredits[0].total;
        }else{
            totalcredits = 0; 
        }
        let totalexpenses;
        if(debitscount !== 0){
            totalexpenses = await Debit.aggregate([
                { $match: { userId : user._id } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            totalexpenses = totalexpenses[0].total;
        }else{
            totalexpenses = 0;
        }
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
        const userid = req.body.userid;
        const user = await User.findById(userid);
        if(user.ispremiumuser === false){
            return res.status(401).json({error : err.response});
        }
        const users = await User.find();
        for(i=0; i<users.length; i++){
            const user = users[i];
            let count = user.credits.length;
            let totalcredits;
            if(count !== 0){
                totalcredits = await Credit.aggregate([
                    { $match: { userId : user._id } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);
                totalcredits = totalcredits[0].total;
            }else{
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

exports.downloadExpenses = async (req, res, next) => {
    const userid = req.body.userid;
    try{
        const user = await User.findById(userid).populate('debits.debitid');
        if(user.ispremiumuser === false){
            return res.status(401).json({error : err.response});
        }
        const expenses = user.debits;
        // console.log(expenses);
        const stringifyexpenses = JSON.stringify(expenses);
        const filename = `Expenses${userid}/${new Date()}.txt`;
        const fileurl = await uploadTos3(stringifyexpenses, filename);
        const fileurl1 = new Fileurl({
            fileurl : fileurl,
            createdAt : new Date(),
            userId: user._id
        })
        const result = await fileurl1.save();
        user.fileurl.push({fileurlid: result._id});
        await user.save();
        res.status(200).json({
            fileurl : fileurl,
            status: "success"
        })
    }catch(err){
        if(err){
            res.status(500).json({
                fileurl : "",
                status: "failed",
                error: err
            })
        }
    }
}

exports.getdownloadhistory = async (req, res, next) => {
    const userid = req.body.userid;
    try{
        const user = await User.findById(userid).populate('fileurl.fileurlid');
        if(user.ispremiumuser === false){
            return res.status(401).json({error : err.response});
        }
        const result = user.fileurl;
        res.status(200).json({
            result : result,
            status: "success"
        });
    }catch(err){
        if(err){
            res.status(500).json({
                status: "failed",
                error: err
            })
        }
    }
}

function uploadTos3(data, filename) {

	const BUCKET_NAME = process.env.BUCKET_NAME;
	const IAM_USER_KEY = process.env.IAM_USER_KEY;   
	const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

	let s3bucket = new AWS.S3({
		accessKeyId: IAM_USER_KEY,
		secretAccessKey: IAM_USER_SECRET,
		Bucket: BUCKET_NAME
	});

	// s3bucket.createBucket(() => {

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL :'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                reject(err);
            }else {
                resolve( s3response.Location);
            }
        });
    });

}

function generateaccesstoken(id) {
    return jwt.sign({ userid : id } , process.env.TOKEN_SECRET);
}