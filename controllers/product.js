const Product = require("../models/Product");

module.exports.getSingleProduct = (req, res) => {
	Course.findById(req.params.courseId)
	.then(product => {
	    if (product){
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

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new: true})
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
        .then(archivedProduct => {
            if (archivedProduct) {
                res.status(200).send({
                    message : 'Product archived successfully',
                    archiveCourse : archivedProduct
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
        .then(activatedProduct => {
            if (activatedProduct) {
                return res.status(200).send({
                message : 'Product activated successfully',
                activatedProduct: activatedProduct
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