const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");


module.exports.addToCart = (req, res) => {
    if(req.user.isAdmin){
        return res.status(403).send({error: "Admin is forbidden"});
    }

	let newCart = new Cart({
        userId: req.user.id,
        cartItems : req.body.cartItems,
        totalPrice : req.body.totalPrice
    });

    return Cart.findOne({userId: req.user.id})
    .then(existingCart => {
        if (!existingCart){
            return newCart.save()
            .then(savedCart => {
                return res.status(201).send({message: "Successfully Added to Cart",savedCart})
            })
            .catch(saveErr => {
                console.error("Error in saving the cart:", saveErr);
                return res.status(500).send({error: 'Failed to save the cart'})
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
                return res.status(200).send({message: "Successfully Added to Cart", savedCart})
            })
            .catch(saveErr => {
                console.error("Error in saving the cart:", saveErr);
                return res.status(500).send({error: 'Failed to save the cart'})
            });
        }

        
    })
    .catch(findErr=>{
        console.error("Error in finding the cart", findErr)
        return res.status(500).send({error: 'Error finding the cart'})
    })
}



module.exports.getCart = (req, res) => {

    return Cart.findOne({})
    .then(cart => {
        if(cart.length > 0){
            return res.status(200).send({cart});
        } else {
            return res.status(200).send({ message: 'No cart found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all cart: ", err)
        return res.status(500).send({error: "Error finding cart"})
    });
};

module.exports.updateQuantity = (req, res) => {
    // console.log(req.user.id)
    return Cart.findOne({userId: req.user.id})
    .then(cart => {
        if(cart) {
            const cartItem = cart.CartItems.find((item) => item.productId === req.body.productId)
            if (cartItem) {
                cartItem.quantity = req.body.quantity
                cartItem.subtotal = req.body.quantity * getProductPrice(req.body.productId) 
            } else {
                const subtotal = req.body.quantity * getProductPrice(req.body.productId) 

                cart.cartItems.push({
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    subtotal: subtotal
                })
            }
            cart.totalPrice = cart.CartItems.subtotal.reduce((a, b) => a + b, 0)
            Cart.save().then(updatedCart => {
                res.send(updatedCart)
            }).catch(err => res.status(500).send({error: 'Error in updating a cart.'})
            )
        } else {
            res.status(404).send({error: "Cart not found"})
        }
    })

}
function getProductPrice(productId) {
    return Product.findById(productId).then(product => product.price).catch(error => error)
}
