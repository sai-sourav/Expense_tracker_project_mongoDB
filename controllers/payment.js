const User = require('../models/user');
const Razorpay = require('razorpay');
const Order = require('../models/premiumorder');


exports.purchasepremium = async (req, res, next) => {
    const userid = req.body.userid;
    const user = await User.findByPk(userid);
    try {
        var rzp = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "USD"}, (err, order) => {
            if(err) {
                console.log(err);
                return res.status(403).json({ message: 'Something went wrong', error: err})
            }
            user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updateTransactionStatus = async (req, res, next ) => {
    try {
        const userid = req.body.userid;
        const user = await User.findByPk(userid);
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                user.update({ispremiumuser: true})
                return res.status(202).json({success: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}
