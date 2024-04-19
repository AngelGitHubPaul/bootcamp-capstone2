const Product = require("../models/Product");

module.exports.addProduct = (req, res) => {

    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    return Product.findOne({name: req.body.name})
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



module.exports.getSingleProduct = (req, res) => {
	Product.findById(req.params.productId)
	.then(product => {
	    if(product){
	        return res.status(200).send({product})
	    }else{
	        return res.status(404).send({error : 'Product not found'})
	    }
	})
	.catch(findErr => {
		console.error("Error in finding Product: ", findErr);
		res.status(500).send({error : 'Error finding Product'})
	});
}

module.exports.updateProduct = (req, res) => {
	let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(updatedProduct => {

        if(updatedProduct) {
            res.status(200).send({
                message : 'Product updated successfully',
                updatedProduct : updatedProduct
            });
        } else {
            res.status(404).send({error : 'Product not found'})
        }
    })
    .catch(err => {
        console.error("Error in updating a product: ", err)
        res.status(500).send({error : 'Error in updating a product.'})
    });
}

module.exports.archiveProduct = (req, res) => {
    let updateActiveField = {
        isActive: false
    }

    if(!req.user.isAdmin){
        return res.status(403).send(false)
    } else {
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(archiveProduct => {
            if (archiveProduct) {
                res.status(200).send({
                    message : 'Product archived successfully',
                    archiveProduct : archiveProduct
                });
            } else {
                res.status(404).send({error : 'Product not found'});
            }
        })
        .catch(err => res.status(500).send({error : 'Failed to archive product'}));
    }
    
};

module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    if(!req.user.isAdmin){
        return res.status(403).send(false)
    } else {
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(activateProduct => {
            if (activateProduct) {
                return res.status(200).send({
                message : 'Product activated successfully',
                activateProduct: activateProduct
            });
            } else {
                return res.status(404).send({error: "Product not found"});
            }
        })
        .catch (err => {
            console.error("Error in activating the product", err)
            return res.status(500).send({error: 'Failed to activating a product'})
        })
    } 
    
};

module.exports.searchByName = async (req, res) => {
  try {
    const { name } = req.body;

    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });

    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports.searchByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        return res.status(200).send({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
};
