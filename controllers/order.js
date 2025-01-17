const Cart = require("../models/Cart");
const Order = require("../models/Order");

// Added for capstone 3
const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOne({userId: userId})
        if (cart) {
            cart.cartItems = [];
            cart.totalPrice = 0;
            await cart.save()
            return res.send(cart)
        } else {
            console.log("Cart not found!")
        }
    } catch(err) {
        console.error(err)
        console.log({ error: 'Internal server error' });
    }
}

module.exports.checkout = (req, res) => {
    // Added for capstone 3
    let newCart = new Cart({
        userId: req.user.id,
        cartItems : req.body.cartItems,
        totalPrice : req.body.totalPrice
    });

    return Cart.findOne({userId: req.user.id})
    .then(existingCart => {
        if (!existingCart){
            newCart.save()
            .then(savedCart => {
                console.log({message: "Successfully Added to Cart",savedCart});

                return Cart.findOne({userId : req.user.id});
            })
            .then(existingCart => {
                console.log(existingCart);
                if (!existingCart) {
                    return res.status(404).send({error : 'Cart not found'});
                } 

                if(existingCart.cartItems.length !== 0) {
                    let newOrder = new Order({
                        userId: req.user.id,
                        productsOrdered : existingCart.cartItems,
                        totalPrice : existingCart.totalPrice
                    });

                    return newOrder.save()
                    .then(savedOrder => {
                        clearCart(req.user.id);
                        return res.status(201).send({message: "Successfully Added Order",savedOrder});
                    })
                    .catch(saveErr => {
                        console.error("Error in saving the order:", saveErr);
                        return res.status(500).send({error: 'Failed to save the order'});
                    });
                } else {
                    return res.status(200).send({ message: 'No items found in cart.' });
                }  
            })
            .catch(err => {
                console.error("Error in finding or saving cart: ", err);
                res.status(500).send({error: "Error finding or saving cart."});
            });

        } else {
            req.body.cartItems.forEach(newCartItem => {
                const foundIndex = existingCart.cartItems.findIndex(el => el.productId === newCartItem.productId);
                if (foundIndex !== -1) {
                    existingCart.cartItems[foundIndex].quantity += newCartItem.quantity;
                    existingCart.cartItems[foundIndex].subtotal += newCartItem.subtotal;
                } else {
                    existingCart.cartItems.push(newCartItem);
                }
            });

            existingCart.totalPrice += req.body.totalPrice;

            existingCart.save()
            .then(savedCart => {
                console.log({message: "Successfully Added to Cart", savedCart})
                return Cart.findOne({userId : req.user.id});
            })
            .then(existingCart => {
                console.log(existingCart);
                if (!existingCart) {
                    return res.status(404).send({error : 'Cart not found'});
                } 

                if(existingCart.cartItems.length !== 0) {
                    let newOrder = new Order({
                        userId: req.user.id,
                        productsOrdered : existingCart.cartItems,
                        totalPrice : existingCart.totalPrice
                    });

                    return newOrder.save()
                    .then(savedOrder => {
                        clearCart(req.user.id);
                        return res.status(201).send({message: "Successfully Added Order",savedOrder});
                    })
                    .catch(saveErr => {
                        console.error("Error in saving the order:", saveErr);
                        return res.status(500).send({error: 'Failed to save the order'});
                    });
                } else {
                    return res.status(200).send({ message: 'No items found in cart.' });
                }  
            })
        }

    })
    .catch(findErr=>{
        console.error("Error in finding the cart", findErr)
        console.log({error: 'Error finding the cart'})
    })

    // Original code
    /*return Cart.findOne({userId : req.user.id})
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
            .then(savedOrder => {
                clearCart(req.user.id);
                return res.status(201).send({message: "Successfully Added Order",savedOrder})
            })
            .catch(saveErr => {
                console.error("Error in saving the order:", saveErr);
                return res.status(500).send({error: 'Failed to save the order'})
            });
        } else {
            return res.status(200).send({ message: 'No items found in cart.' });
        }  
    })
    .catch(err => {
    	console.error("Error in finding cart: ", err)
    	res.status(500).send({error: "Error finding cart."})
    });*/
}

module.exports.getUserOrder = (req, res) => {

    return Order.find({userId: req.user.id})
    .then(orders => {
        if(orders.length > 0){
            return res.status(200).send({orders});
        } else {
            return res.status(200).send({ message: 'No orders found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all user orders: ", err)
        return res.status(500).send({error: "Error finding user orders"})
    });
};



module.exports.getAllOrder = (req, res) => {

    return Order.find({})
    .then(orders => {
        if(orders.length > 0){
            return res.status(200).send({orders});
        } else {
            return res.status(200).send({ message: 'No orders found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all orders: ", err)
        return res.status(500).send({error: "Error finding orders"})
    });
};