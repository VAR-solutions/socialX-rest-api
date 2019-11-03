const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
   create: function (req, res, next) {

      userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password, username: req.body.username }, function (err, result) {
         if (err)
            next(err);
         else
            res.json({ status: "success", message: "User added successfully!!!", data: null });

      });
   },
   authenticate: function (req, res, next) {
      userModel.findOne({ email: req.body.email }, function (err, userInfo) {
         if (err) {
            next(err);
         } else {
            if (bcrypt.compareSync(req.body.password, userInfo.password)) {
               const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'));
               res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
            } else {
               res.json({ status: "error", message: "Invalid email/password!!!", data: null });
            }
         }
      });
   },
   updateProfile: function (req, res, next) {
      let location = req.body.location;
      let dob = req.body.dob;
      let mobile = req.body.mobile;
      userModel.findByIdAndUpdate(req.body.userId, { $set: { location: location, dob: dob, mobile: mobile } }, { new: true }, (err, r) => {
         if (err) {
            return res.status(400).json({
               error: err
            });
         } else {
            res.json(r);
         }
      })
      // console.log(req.body)
   },
   getUser: function (req, res, next) {
      userModel.findOne({ username: req.params.username }, (err, r) => {
         if (err) {
            return res.status(400).json({
               error: err
            });
         } else {
            res.json(r);
         }
      })
   }
}