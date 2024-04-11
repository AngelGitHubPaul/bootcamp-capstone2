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
    const userId = req.body.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: 'User updated as admin successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while updating user as admin.' });
    }
}