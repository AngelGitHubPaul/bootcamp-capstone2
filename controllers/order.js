const Order = require("../models/Order");
const User = require("../models/User");


module.exports.getUserOrder = (req, res) => {

    return Order.findOne({userId: req.user.id})
    .then(order => {
        if(order){
            return res.status(200).send({order});
        } else {
            return res.status(200).send({ message: 'No order found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all order: ", err)
        return res.status(500).send({error: "Error finding order"})
    });
};



module.exports.getAllOrder = (req, res) => {

    return Order.find({})
    .then(order => {
        if(order.length > 0){
            return res.status(200).send({order});
        } else {
            return res.status(200).send({ message: 'No order found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all order: ", err)
        return res.status(500).send({error: "Error finding order"})
    });
};

