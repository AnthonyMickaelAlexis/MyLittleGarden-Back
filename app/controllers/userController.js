const userDataMapper = require('../models/user');
const helperController = require('./helperController');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {

    // get login user
    loginUser(req,res) {
        try {
            res.send('loginUserPost');
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },
    // test getting allusers
    async getAllUsers(_, res) {
        const users = await userDataMapper.findAll();
        return res.json(users);
    },

    
    // post login user
    async loginUserConnection(req,res) {
        try {

           const user = await userDataMapper.findByUserName(req.body.user_name);

           if (!user) {
               return res.status(401).json({message:"Ce compte n'existe pas !"})
           };
          
           const validPassword = await bcrypt.compare(req.body.password, user.password);
           
           if (!validPassword) {
            return res.status(401).json({message : ' Mauvais mot de passe'})
        };

        const token = jwt.sign({
            id: user.id,
            user_name: user.user_name,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
            }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_DURING});

            res.json({access_token: token});


        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },





    // get register user
    async registeredUser(req,res) {
        try {
            res.send('loginUserPost');
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    // post register user
    async registerUserPost(req,res) {
        try {
            let salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const dataUser =
            {
                user_name : req.body.user_name,
                firstname : req.body.firstname,
                lastname : req.body.lastname, 
                email : req.body.email, 
                password : hashedPassword
            };
            await userDataMapper.insert(dataUser);
            res.json(dataUser);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    // get user profil
    async getUserProfil(req, res, next) {
        try{
            const userId = parseInt(req.params.user, 10);
            if (Number.isNaN(userId)) {
                return next();
            }

            const user = await userDataMapper.findByPK(userId);
            if (!user) {
                return next();
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    // patch user profil
    async patchUserProfil(req, res, next) {
        try {

            const user = await userDataMapper.findByPK(req.params.userid);
            if (!user) {
                return next();
            }

            let salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const dataUser =
            {
                user_name : req.body.user_name,
                firstname : req.body.firstname,
                lastname : req.body.lastname, 
                email : req.body.email, 
                password : hashedPassword
            };
            

            const savedUser = await userDataMapper.update(req.params.userid, dataUser);
            return res.json(savedUser);

        
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    // delete user from database
    async deleteUser(req, res, next) {
        try {
            
            const userId = parseInt(req.params.user, 10);
            if (Number.isNaN(userId)) {
                return next();
            }

            await userDataMapper.delete(userId);
            
            res.send(`utilisateur ${userId} a bien était supprimé`);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

};

module.exports = userController;