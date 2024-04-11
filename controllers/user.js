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



//Retrieve userdetails
module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        result.password = "";
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
  
	  res.status(200).json({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };