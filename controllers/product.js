const Product = require("../models/Product");
const User = require("../models/User");


module.exports.addProduct = (req, res) => {

    console.log(req.body);
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({name: req.body.name})
    .then(existingProduct => {
        if (existingProduct){
            return res.status(409).send({error: "Product already exists"})
        }
        return newProduct.save()
        .then(savedProduct => {
            return res.status(201).send({savedProduct})
        })
        .catch(saveErr => {
            console.error("Error in saving the product:", saveErr);
            return res.status(500).send({error: 'Failed to save the product'})
        });
    })
    .catch(findErr=>{
        console.error("Error in finding the product", findErr)
        return res.status(500).send({error: 'Error finding the product'})
    })

    

    try {
        let newProduct = new Product({
            name : req.body.name,
            description : req.body.description,
            price : req.body.price
        });

        return newProduct.save()
        .then(result => res.send(result))
        .catch(err => res.send(err));
    } catch (err) {
        console.log(err)
        res.send("Error in variables");
    }
}; 


module.exports.getAllProducts = (req, res) => {

    return Product.find({})
    .then(products => {
        if(products.length > 0){
            return res.status(200).send({products});
        } else {
            return res.status(200).send({ message: 'No product found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all the products: ", err)
        return res.status(500).send({error: "Error finding the product"})
    });
};

module.exports.getAllActive = (req, res) => {

    Product.find({ isActive: true })
    .then(products => {
        
        if (products.length > 0){
            return res.status(200).send({products})
        }else{
            return res.status(200).send({message: "No active product found."})
        }
    }).catch(err => {
        console.error("Error in finding active product: ", err)
        return res.status(500).send({error: 'Error in finding active product.'})
    });

};