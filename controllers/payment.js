const User = require('../models/user');
const Razorpay = require('razorpay');
const Order = require('../models/premiumorder');


exports.purchasepremium = async (req, res, next) => {
    const userid = req.body.userid;
    const user = await User.findById(userid);
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
            const order1 = new Order({
                orderid: order.id,
                status: 'PENDING',
                createdAt: new Date(),
                userId: user._id
            })
            return order1.save()
            .then((result) => {
                user.orders.push({orderid: result._id});
                return user.save()
            }).then((result) => {
                res.status(201).json({ order, key_id : rzp.key_id});
            })
            .catch(err => {
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
        const user = await User.findById(userid);
        const { payment_id, order_id} = req.body;
        Order.find({orderid: order_id})
        .then(order => {
            order = order[0];
            order.paymentid = payment_id;
            order.status = 'SUCCESSFUL';
            return order.save();
        }).then(result => {
            user.ispremiumuser = true;
            return user.save();
        }).then(result => {
            res.status(202).json({success: true, message: "Transaction Successful"});
        })
        .catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}
