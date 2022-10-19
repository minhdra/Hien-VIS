const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerValidator, changePasswordValidator } = require('../validations/auth');
const { ObjectId } = require('mongodb');

class UserController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sort;
    const myQuery = {
      id: { $exists: true },
      username: { $regex: `.*${req.body.username}.*`, $options: 'i' },
      email: { $regex: `.*${req.body.email}.*`, $options: 'i' },
      firstName: { $regex: `.*${req.body.firstName}.*`, $options: 'i' },
      lastName: { $regex: `.*${req.body.lastName}.*`, $options: 'i' },
      active: true,
    };
    User.find(myQuery)
      .sort(sort ? { username: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }
  
  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    User.findOne(myQuery)
      .then((user) => {
        if (user)
          return res.json({
            _id: user._id,
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        return res.status(404).json({
          message: 'User not founded!'
        })
      })
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // update
  async update(req, res) {
    User.findOne({ _id: ObjectId(req.body._id) }).then(user => {
      if (!user) return res.status(404).json({ message: 'User not founded!' });
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.avatar = req.body.avatar;
      user.email = req.body.email;
      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });
        else res.status(200).json({ message: 'Updated successful!' });
      });
    }).catch(err => res.status(422).json({ message: 'Cannot find' }));
  }

  // Login
  async login(req, res) {
    const user = await User.findOne({username: req.body.username, active: true});
    if (!user) return res.status(422).json('Username or Password is not correct');

    const checkPassword = await bcrypt.compare(req.body.password, user.password);

    if (!checkPassword) return res.status(422).json('Username or Password is not correct');
    
    const message = `User ${user.username} logging...`;
    return res.json({data: user, message});
  }
  
  // Register
  async register(req, res) {
    await User.find()
      .sort({ id: -1 })
      .limit(1)
      .then(async (data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        const { error } = registerValidator(req.body);

        if (error) return res.status(422).json({ message: error.details[0].message });

        const checkUsernameExist = await User.findOne({ username: req.body.username });

        if (checkUsernameExist) return res.status(422).json({ message: 'Username is exist' });

        const checkEmailExist = await User.findOne({ email: req.body.email });

        if (checkEmailExist) return res.status(422).json({ message: 'Email is exist' });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
          id: newId,
          username: req.body.username,
          firstName: req.body.firstName ?? '',
          lastName: req.body.lastName ?? '',
          avatar: req.body.avatar ?? '',
          email: req.body.email,
          password: hashPassword,
        });

        user.save((err, user) => {
          if (err) {
            return res.status(400).json('Cannot save!');
          } else {
            return res.status(200).json('Register successful!');
          }
        });
      });
  }

  // Change password
  async changePassword(req, res) {
    const myQuery = { id: req.body.id, active: true };
    const user = await User.findOne(myQuery);
    if (!user) return res.status(422).json('User not found!');

    const { error } = changePasswordValidator(req.body);

    if (error) return res.status(422).send(error.details[0].message);
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    user.password = hashPassword;
    user.save((err) => {
      if (err) return res.status(400).json('Error saving password!');
      else
        return res.status(200).json('Changed password successful!');
    });
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    User.findOne(myQuery)
      .then((user) => {
        if (user) {
          user.active = false;
          user.save((err) => {
            if (err) return res.status(400).json('Error deleting user');
            else
              return res
                .status(200)
                .json(`Successfully deleted user: ${user.username}`);
          });
        } else return res.status(404).json('User not found');
      })
      .catch((err) => res.status(404).json(`Error!!!`));
  }
}

module.exports = new UserController();
