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
         if(userInfo) {
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
         }
         else{
            return res.status(400).json({
               error: "User not found!!!"
            })
         }
      });
   },
   getUsers: function(req,res,next){
      userModel.find({},function (err,r) {
         if (err) {
            next(err);
        } else {
            res.json({ status: "success", message: "Users found!!!", data: { User: r } });
        }
      })
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
   },

   followUser: function(req, res, next) {
      let followingUsers= [];
      let user1 = "";
      userModel.findById(req.body.userId, (err, r) => {
         if(err) {
            return res.status(400).json({
               error: err
            });
         }
         else{
            followingUsers = Array.from(r.following);
            user1 = r.username
            if(followingUsers.indexOf(req.body.user2) == -1){
               followingUsers.push(req.body.user2);
               let s = new Set(followingUsers)
               followingUsers = Array.from(s)
               userModel.findByIdAndUpdate(req.body.userId, {$set: {following: followingUsers}}, {new: true}, (er, rs) => {
                  if(er){
                     return res.status(400).json({
                        error: er
                     });
                  }
                  else{
                     followersUser2 = [];
                     userModel.findOne({username: req.body.user2}, (e, rr)=> {
                        followersUser2 = Array.from(rr.followers);
                        if(followersUser2.indexOf(user1) == -1) {
                           followersUser2.push(user1)
                           s = new Set(followersUser2)
                           followersUser2 = Array.from(s)
                           userModel.findOneAndUpdate({username: req.body.user2}, {$set: {followers: followersUser2}}, {new: true}, (eee, rrr) => {
                              if(eee){
                                 return res.status(400).json({
                                    error: eee
                                 });
                              }
                              else{
                                 res.json({ status: "success", message: "User followed successfully!!!", data: null });
                              }
                           })
                        }
                        else{
                           res.json({ status: "failure", message: "User2 already has this follower!!!", data: null });
                        }
                     })
                  }
               })
            }
            else{
               res.json({ status: "failure", message: "User already followed!!!", data: null });
            }
         }
      })
   },

   unfollowUser: function(req, res, next) {
      let followingUsers= [];
      let user1 = "";
      userModel.findById(req.body.userId, (err, r) => {
         if(err) {
            return res.status(400).json({
               error: err
            });
         }
         else{
            followingUsers = Array.from(r.following);
            user1 = r.username
            if(followingUsers.indexOf(req.body.user2) >= 0){
               userModel.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.user2}}, {new: true}, (er, rs) => {
                  if(er){
                     return res.status(400).json({
                        error: er
                     });
                  }
                  else{
                     followersUser2 = [];
                     userModel.findOne({username: req.body.user2}, (e, rr)=> {
                        followersUser2 = Array.from(rr.followers);
                        if(followersUser2.indexOf(user1) >= 0) {
                           userModel.findOneAndUpdate({username: req.body.user2}, {$pull: {followers: user1}}, {new: true}, (eee, rrr) => {
                              if(eee){
                                 return res.status(400).json({
                                    error: eee
                                 });
                              }
                              else{
                                 res.json({ status: "success", message: "User unfollowed successfully!!!", data: null });
                              }
                           })
                        }
                        else{
                           res.json({ status: "failure", message: "User2 not has this follower!!!", data: null });
                        }
                     })
                  }
               })
            }
            else{
               res.json({ status: "failure", message: "User already unfollowed!!!", data: null });
            }
         }
      })
   },

   getFollowers: function(req, res, next){
      userModel.findOne({username: req.params.username}, (err, r) => {
         if (err) {
            return res.status(400).json({
               error: err
            });
         } else {
            res.json(r.followers);
         }
      })
   },

   getFollowings: function(req, res, next){
      userModel.findOne({username: req.params.username}, (err, r) => {
         if (err) {
            return res.status(400).json({
               error: err
            });
         } else {
            res.json(r.following);
         }
      })
   },

   suggestionsToFollow: function(req, res, next){
      let allUsers = [];
      let myFollowing = [];
      let suggestions = [];
      userModel.find((err, users) => {
         if(err){
            next(err)
         }
         else{
            for(let user of users) {
               allUsers.push(user.username)
            }
            userModel.findOne({username: req.params.username}, (er, followings) => {
               if(err){
                  return res.status(400).json({
                     error: er
                  });
               }
               else{
                  myFollowing = Array.from(followings.following)
                  suggestions = allUsers.filter(x => !myFollowing.includes(x));
                  suggestions = suggestions.filter(function(val, index, suggestions){
                     return val != req.params.username
                  })
                  res.json(suggestions)
               }

            })
         }
      })
   }
}