const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { ObjectId } = require('mongodb')


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
    return Cart.findOne({userId: req.user.id})
    .then(cart => {
        if(cart){
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

module.exports.updateQuantity = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        
        if (cart) {
            const cartItem = cart.cartItems.find((item) => item.productId === req.body.productId);
            let price = await getProductPrice(req.body.productId); // Wait for the price
            if (cartItem) {
                cartItem.quantity = req.body.quantity;
                cartItem.subtotal = req.body.quantity * price; // Calculate subtotal using the awaited price
            } else {
                const subtotal = req.body.quantity * price; // Calculate subtotal using the awaited price
                cart.cartItems.push({
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    subtotal: subtotal
                });
            }
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
            const updatedCart = await cart.save();
            res.send(updatedCart);
        } else {
            res.status(404).send({ error: "Cart not found" });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error in updating a cart.' });
    }
}

async function getProductPrice(productId) {
    const newProductId = new ObjectId(productId)
    console.log(newProductId)
    try {
        const product = await Product.findById(newProductId);
        console.log(productId)
        console.log(product)
        return product.price;
    } catch (error) {
        console.log(error)
        return 0; 
    }
}
