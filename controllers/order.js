const Cart = require("../models/Cart");
const Order = require("../models/Order");

module.exports.checkout = (req, res) => {
    return Cart.findOne({userId : req.user.id})
    .then(existingCart => {
        console.log(existingCart);
        if (!existingCart) {
            return res.status(404).send({error : 'Cart not found'})
        } 

        if(existingCart.cartItems.length !== 0) {
            let newOrder = new Order({
                userId: req.user.id,
                productsOrdered : existingCart.cartItems,
                totalPrice : existingCart.totalPrice
            })

            return newOrder.save()
            .then(savedCart => {
                return res.status(201).send({message: "Successfully Added to Cart",savedCart})
            })
            .catch(saveErr => {
                console.error("Error in saving the cart:", saveErr);
                return res.status(500).send({error: 'Failed to save the cart'})
            });
        } else {
            return res.status(200).send({ message: 'No items found in cart.' });
        }  
    })
    .catch(err => {
    	console.error("Error in finding cart: ", err)
    	res.status(500).send({error: "Error finding cart."})
    });
}

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