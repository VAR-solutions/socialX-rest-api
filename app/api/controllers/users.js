const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");

module.exports = {
   create: function (req, res, next) {
      userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password, username: req.body.username }, function (err, result) {
         if (err) {
            return res.status(400).json({
               error: true,
               message: "Error in signup!!! Try Again."
            });
         }
         else {
            res.json({
               error: false,
               message: "User added successfully!!!",
               data: null
            });
         }
      });
   },

   authenticate: function (req, res, next) {
      userModel.findOne({ email: req.body.email }, function (err, userInfo) {
         if (userInfo) {
            if (err) {
               return res.status(400).json({
                  error: true,
                  message: "Error in signing in!!! Try Again."
               });
            } else {
               if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                  const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'));
                  res.json({
                     error: false,
                     message: "User found. Login Successful",
                     data: userInfo,
                     token: token
                  });
               } else {
                  res.json({
                     error: true,
                     message: "Invalid email or password!",
                     data: null
                  });
               }
            }
         }
         else {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            })
         }
      });
   },
   getUsers: function (req, res, next) {
      userModel.find({}, { password: 0 }).sort({username: -1}).exec( function (err, r) {
         if (err || r == null) {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            });
         }
         else {
            res.json({
               error: false,
               message: "Users found!!!",
               data: r
            });
         }
      })
   },
   updateProfile: function (req, res, next) {
      console.log(req.body)
      let location = req.body.location;
      let dob = req.body.dob;
      let mobile = req.body.mobile;
      userModel.findByIdAndUpdate(req.body.userId, { $set: { location: location, dob: dob, mobile: mobile } }, { new: true }, (err, r) => {
         if (err) {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            });
         }
         else {
            res.json({
               error: false,
               message: "Profile Updated",
               data: r
            });
         }
      })
   },
   updateDp: function (req, res, next) {
      userModel.findOneAndUpdate({ username: req.body.username }, { $set: { dp: { data: fs.readFileSync(req.file.path), contentType: 'image/png' } } }, { new: true }, (err, r) => {
         if (err || r == null) {
            return res.status(400).json({
               error: true,
               message: "Error!!!"
            });
         }
         else {
            res.json({
               error: false,
               message: "DP updated",
               data: r
            });
         }
      })
   },
   getUser: function (req, res, next) {
      userModel.findOne({ username: req.params.username }, { password: 0 }, (err, r) => {
         if (err || r == null) {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            });
         }
         else {
            res.json({
               error: false,
               message: "User found!!!",
               data: r
            });
         }
      })
   },

   followUser: function (req, res, next) {
      let followingUsers = [];
      let user1 = "";
      userModel.findById(req.body.userId, (er1, r) => {
         if (er1 || r == null) {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            });
         }
         else {
            followingUsers = Array.from(r.following);
            user1 = r.username
            userModel.findOne({ username: req.body.user2 }, (er2, rr) => {
               if (er2 || rr == null) {
                  return res.status(400).json({
                     error: true,
                     message: "User2 not found!"
                  })
               }
               else {
                  let followersUser2 = [];
                  followersUser2 = Array.from(rr.followers)
                  if (req.body.user2 == user1) {
                     res.status(400).json({
                        error: true,
                        message: "Invalid Request!"
                     })
                  }
                  else {
                     if (followingUsers.indexOf(req.body.user2) >= 0) {
                        return res.status(400).json({
                           error: true,
                           message: "User2 already followed!"
                        })
                     }
                     else {
                        followingUsers.push(req.body.user2)
                        let s = new Set(followingUsers)
                        followingUsers = Array.from(s)
                        userModel.findByIdAndUpdate(req.body.userId, { $set: { following: followingUsers } }, { new: true }, (er, rs) => {
                           if (er) {
                              return res.status(400).json({
                                 error: true,
                                 message: "Error following User!"
                              })
                           }
                           else {
                              if (followersUser2.indexOf(user1) >= 0) {
                                 res.status(400).json({
                                    error: true,
                                    message: "Invalid Request"
                                 })
                              }
                              else {
                                 followersUser2.push(user1)
                                 let ss = new Set(followersUser2)
                                 followersUser2 = Array.from(ss)
                                 userModel.findOneAndUpdate({ username: req.body.user2 }, { $set: { followers: followersUser2 } }, { new: true }, (err, re) => {
                                    if (err) {
                                       return res.status(400).json({
                                          error: true,
                                          message: "Error following user!"
                                       })
                                    }
                                    else {
                                       res.json({
                                          error: false,
                                          message: "User followed successfully!"
                                       })
                                    }
                                 })
                              }
                           }
                        })
                     }
                  }
               }
            })
         }
      })
   },

   unfollowUser: function (req, res, next) {
      let followingUsers = [];
      let user1 = "";
      userModel.findById(req.body.userId, (er1, r) => {
         if (er1 || r == null) {
            return res.status(400).json({
               error: true,
               message: "User not found!"
            });
         }
         else {
            followingUsers = Array.from(r.following);
            user1 = r.username
            userModel.findOne({ username: req.body.user2 }, (er2, rr) => {
               if (er2 || rr == null) {
                  return res.status(400).json({
                     error: true,
                     message: "User2 not found!"
                  })
               }
               else {
                  let followersUser2 = [];
                  followersUser2 = Array.from(rr.followers)
                  if (req.body.user2 == user1) {
                     res.status(400).json({
                        error: true,
                        message: "Invalid Request!"
                     })
                  }
                  else {
                     if (followingUsers.indexOf(req.body.user2) == -1) {
                        return res.status(400).json({
                           error: true,
                           message: "User2 already unfollowed!"
                        })
                     }
                     else {
                        userModel.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.user2 } }, { new: true }, (er, rs) => {
                           if (er) {
                              return res.status(400).json({
                                 error: true,
                                 message: "Error unfollowing User!"
                              })
                           }
                           else {
                              if (followersUser2.indexOf(user1) == -1) {
                                 res.status(400).json({
                                    error: true,
                                    message: "Invalid Request"
                                 })
                              }
                              else {
                                 userModel.findOneAndUpdate({ username: req.body.user2 }, { $pull: { followers: user1 } }, { new: true }, (err, re) => {
                                    if (err) {
                                       return res.status(400).json({
                                          error: true,
                                          message: "Error unfollowing user!"
                                       })
                                    }
                                    else {
                                       res.json({
                                          error: false,
                                          message: "User unfollowed successfully!"
                                       });
                                    }
                                 });
                              }
                           }
                        })
                     }
                  }
               }
            })
         }
      })
   },

   getFollowers: function (req, res, next) {
      userModel.findOne({ username: req.params.username }, (err, r) => {
         if (r) {
            if (err) {
               res.status(400).json({
                  error: true,
                  message: "Error getting followers!!!",
                  data: null
               });
            } else {
               res.json({
                  error: false,
                  message: "Followers found.",
                  data: r.followers
               });
            }
         }
         else {
            res.status(400).json({
               error: true,
               message: "User not found!"
            })
         }
      })
   },

   getFollowings: function (req, res, next) {
      userModel.findOne({ username: req.params.username }, (err, r) => {
         if (r) {
            if (err) {
               return res.status(400).json({
                  error: true,
                  message: "Error getting followings!!!",
                  data: null
               });
            } else {
               res.json({
                  error: false,
                  message: "Following found",
                  data: r.following
               });
            }
         }
         else {
            return res.status(400).json({
               error: true,
               message: "User not found!",
            });
         }
      })
   },

   suggestionsToFollow: function (req, res, next) {
      let allUsers = [];
      let myFollowing = [];
      let suggestions = [];
      userModel.find((err, users) => {
         if (err || users == null) {
            res.json({
               error: true,
               message: "Error getting users!"
            });
         }
         else {
            for (let user of users) {
               allUsers.push(user.username)
            }
            userModel.findOne({ username: req.params.username }, (er, userdata) => {
               if (err || userdata == null) {
                  res.json({
                     error: true,
                     message: "User not found!!!",
                     data: null
                  });
               }
               else {
                  myFollowing = Array.from(userdata.following)
                  suggestions = allUsers.filter(x => !myFollowing.includes(x));
                  suggestions = suggestions.filter(function (val, index, suggestions) {
                     return val != req.params.username
                  })
                  res.json({
                     error: false,
                     message: "Suggestions to follow...",
                     data: suggestions
                  });
               }

            })
         }
      })
   }
}