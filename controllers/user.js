const User = require("../models/User");
const auth = require('../auth');
const bcrypt = require("bcrypt");

module.exports.loginUser = (req, res) => {

	if(req.body.email.includes("@")){

		return User.findOne({email: req.body.email})
		.then(result => {
			if(result == null){
				return res.status(404).send({error: 'No Email Found'});

			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect){
					return res.status(200).send({access: auth.createAccessToken(result)});
				} else {
					return res.status(401).send({error: 'Email and password do not match'});
				}

			}
		}).catch(err => res.status(500).send({error: 'Error in find' }));
	}else{
		return res.status(400).send({error: 'Invalid in email'})
	}
	
}

module.exports.setAsAdmin = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.tatus(404).send({ message: 'User not found.' });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).send({ message: 'User updated as admin successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating user as admin.' });
    }
}

//User Registration
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: "Email invalid" });
    }
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    } else {
    	let newUser = new User({
    		firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		email: req.body.email,
    		mobileNo: req.body.mobileNo,
    		password: bcrypt.hashSync(req.body.password, 10)
    	})

    	return newUser.save()
    	.then((result) => res.status(201).send({ message: "Registered Successfully" }))
    	.catch(err => {
    		console.error("Error in saving: ", err)
            return res.status(500).send({ error: "Error in save"})		            
    	});
    }

}

module.exports.findUser = (req, res) => {
	const userId = req.body.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        user.password = "";
        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user", err)
        return res.status(500).send({ error: 'Failed to fetch user' })
    });
};

//Retrieve userdetails
module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        user.password = "";
        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};



// Update password
module.exports.resetPassword = async (req, res) => {
	try {
	  const { newPassword } = req.body;
	  const { id } = req.user; 
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
	  await User.findByIdAndUpdate(id, { password: hashedPassword });
  
	  res.status(200).send({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Internal server error' });
	}
  };
