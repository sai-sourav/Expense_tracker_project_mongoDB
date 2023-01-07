const jwt = require('jsonwebtoken');

exports.authenticate = async (req,res,next) => {
    const token = req.header('Authorization');
    try{
        const result = jwt.verify(token, process.env.TOKEN_SECRET);
        const userid = result.userid;
        req.body.userid = userid;
        next();

    } catch(err){
        if(err){
            res.status(500).json({
                error : "token error"
            })
        }
    }
}