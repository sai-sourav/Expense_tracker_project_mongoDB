const User = require('../models/user');

exports.getexpenses = async (req, res, next) => {
    const userid = req.body.userid;
    try{
        const user = await User.findByPk(userid);
        const expenses = await user.getExpenses();
        res.status(200).json({
            ispremiumuser : user.ispremiumuser,
            expenses : expenses,
            status : "success"
        })
    } catch(err){
        res.status(500).json({error : err});
    }
}

exports.postexpenses = async (req, res, next) => {
    const amount = req.body.amount;
    const Description = req.body.Description;
    const category = req.body.category;
    const userid = req.body.userid;
    // console.log(userid);
    if((amount === "") || (Description === "") || (category === "")){
        return res.status(500).json({fields : "empty"});
    }
    try{
        const user = await User.findByPk(userid);
        const response = await user.createExpense({
            amount : amount,
            Description : Description,
            category : category
        });
        res.status(201).json({
           created : true
        });
    }catch(err){
        res.status(500).json({
            fields : "full",
            error : err
        });
    }
}

exports.deleteexpense = async (req, res, next) => {
    const userid = req.body.userid;
    const expenseid = req.body.expenseid;
    
    try{
        const user = await User.findByPk(userid);
        let expense = await user.getExpenses({ where: { id : expenseid } });
        expense = expense[0];
        const response = await expense.destroy();
        res.status(200).json({
            deleted : true
         });
    }catch(err){
        res.status(500).json({
            error : err
        });
    }

}