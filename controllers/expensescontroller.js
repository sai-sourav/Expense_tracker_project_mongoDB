const User = require('../models/user');
const Debit = require('../models/expenses');
const Credit = require('../models/credits');
const Items_Per_page = 3;

exports.getpremiumexpenses = async (req, res, next) => {
    const userid = req.body.userid;
    var entity = req.query.entity;
    const type = req.query.type;
    const page = parseInt(req.query.page);
    let DATE_START;
    let DATE_END;
    if (type === "date"){
        DATE_START = new Date(entity).setHours(0, 0, 0, 0);
        DATE_END = new Date(entity).setHours(23, 59, 59, 0);
    } else if (type === "week" ){
        entity = entity.replace("W","");
        const array = entity.split('-');
        const array1 = getDateRangeOfWeek(+array[1], +array[0]).split('to');
        DATE_START = new Date(array1[0]).setHours(0, 0, 0, 0);
        DATE_END = new Date(array1[1]).setHours(23, 59, 59, 0);

    } else if (type === "month"){
        const startdate = `${entity}-01`
        const enddate = `${entity}-31`
        DATE_START = new Date(startdate).setHours(0, 0, 0, 0);
        DATE_END = new Date(enddate).setHours(23, 59, 59, 0);
    }
    try{
        const user = await User.findById(userid);
        if(user.ispremiumuser === false){
            return res.status(401).json({error : err.response});
        }
        const allexpenses = await Debit.find({
            createdAt: {
                $gte: DATE_START,
                $lte: DATE_END
            },
            userId: user._id
        })
        let count = allexpenses.length;
        const allcredits = await Credit.find({
            createdAt: {
                $gte: DATE_START,
                $lte: DATE_END
            },
            userId: user._id
        })
        let creditcount = allcredits.length;
        const expenses = await Debit.find({
            createdAt: {
                $gte: DATE_START,
                $lte: DATE_END
            },
            userId: user._id
        }).limit(Items_Per_page).skip((page - 1) * Items_Per_page).exec();

        let totalexpenses = 0;
        allexpenses.map(expense => {
            totalexpenses = totalexpenses + expense.amount;
        })
        let totalcredits = 0;
        allcredits.map(credit => {
             totalcredits = totalcredits + credit.amount;
        })
        res.status(200).json({
            ispremiumuser : user.ispremiumuser,
            expenses : expenses,
            currentpage : page,
            hasnextpage : Items_Per_page*page < count,
            haspreviouspage : page > 1,
            nextpage : page + 1,
            previouspage : page - 1,
            lastpage : Math.ceil(count / Items_Per_page),
            totalexpenses : totalexpenses,
            totalcredits : totalcredits,
            status : "success"
        })
    } catch(err){
        res.status(500).json({error : err});
    }
}

exports.getexpenses = async (req, res, next) => {
    const userid = req.body.userid;
    const page = parseInt(req.query.page);
    try{
        const user = await User.findById(userid).populate('debits.debitid');
        let count = user.debits.length;
        let creditscount = user.credits.length;
        const expenses = await Debit.find({userId : user._id}).limit(Items_Per_page).skip((page - 1) * Items_Per_page).exec();
        let totalcredits;
        if(creditscount !== 0){
            totalcredits = await Credit.aggregate([
                { $match: { userId : user._id } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            totalcredits = totalcredits[0].total;
        }else{
            totalcredits = 0; 
        }
        let totalexpenses;
        if(count !== 0){
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
            ispremiumuser : user.ispremiumuser,
            expenses : expenses,
            totalexpenses : totalexpenses,
            totalcredits : totalcredits,
            currentpage : page,
            hasnextpage : Items_Per_page*page < count,
            haspreviouspage : page > 1,
            nextpage : page + 1,
            previouspage : page - 1,
            lastpage : Math.ceil(count / Items_Per_page),
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
    if((amount === "") || (Description === "") || (category === "")){
        return res.status(500).json({fields : "empty"});
    }
    try{
        const user = await User.findById(userid);
        const debit = new Debit({
            amount : amount,
            description : Description,
            category : category,
            createdAt: new Date(),
            userId: user._id
        })
        const response = await debit.save();
        user.debits.push({
            debitid: response._id
        })
        await user.save();
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
        const user = await User.findById(userid);
        const debits = user.debits;
        const updateddebits = debits.filter(op => {
            return op.debitid === expenseid
        })
        user.debits = updateddebits;
        await user.save();
        await Debit.findByIdAndDelete(expenseid);
        res.status(200).json({
            deleted : true
         });
    }catch(err){
        res.status(500).json({
            error : err
        });
    }

}

function getDateRangeOfWeek(weekNo, year){
    var d1 = new Date();
    d1.setFullYear(year);
    numOfdaysPastSinceLastMonday = eval(d1.getDay()- 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = d1.getWeek();
    var weeksInTheFuture = eval( weekNo - weekNoToday );
    d1.setDate(d1.getDate() + eval( 7 * weeksInTheFuture ));
    var rangeIsFrom =  d1.getFullYear()   + "-"  +  eval(d1.getMonth()+1) + "-"  + d1.getDate()  ;
    d1.setDate(d1.getDate() + 6);		
    var rangeIsTo = d1.getFullYear()   + "-"  +  eval(d1.getMonth()+1)  + "-"  + d1.getDate()   ;
    return rangeIsFrom + "to"+rangeIsTo;
};

Date.prototype.getWeek = function() {
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};