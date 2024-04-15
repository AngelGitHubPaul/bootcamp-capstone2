const Cart = require("../models/Cart");

module.exports.addToCart = (req, res) => {
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

module.exports.updateCartQuantity = (req, res) => {

}