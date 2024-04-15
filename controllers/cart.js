const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");



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
