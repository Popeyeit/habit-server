const userModel = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promises: fsPromises } = require('fs');
const path = require('path');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (email, link) => ({
  to: `${email}`,
  from: process.env.EMAIL,
  subject: 'Confirm your email',
  text: 'Confirm your email',
  html: `<a href=${link}>link verification</a>`,
});

exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).uid;
    } catch (err) {
      next(err);
    }

    const user = await userModel.findById(userId);

    if (!user || token !== user.token) {
      res.status(401).json('Not authorized');
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};
const sendVerification = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
  try {
    const res = await sgMail.send(msg(email, verificationLink));
  } catch (error) {}
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await userModel.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json('User not found');
    }
    await userModel.findByIdAndUpdate(user.id, {
      verificationToken: '',
    });

    res.status(200).json('Success');
  } catch (error) {
    next(error);
  }
};
exports.registerUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      //   avatarURL: req.avatarURL,
      verificationToken: uuid.v4(),
    });

    await sendVerification(user.email, user.verificationToken);

    res.status(201).json({
      email: user.email,
      nickName: user.nickName,
      //   subscription: user.subscription,
      //   avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userDB = await userModel.getUserByEmail(email);
  if (!userDB) {
    return res.status(401).json('Email or password is wrong');
  }
  const { verificationToken } = userDB;
  if (verificationToken) {
    return res.status(403).json('Your email is not verified');
  }

  const isPasswordCorrect = await bcrypt.compare(password, userDB.password);
  if (!isPasswordCorrect) {
    return res.status(401).json('Email or password is wrong');
  }
  const token = await jwt.sign(
    {
      uid: userDB._id,
    },
    process.env.JWT_SECRET,
  );
  await userModel.updateUserToken(userDB._id, token);
  const user = { email: userDB.email, nickName: userDB.nickName };
  res.status(200).json({
    token,
    user,
    // subscription: user.subscription
  });
};
exports.currentUser = async (req, res, next) => {
  try {
    const { user } = req;
    res.status(200).json({
      email: user.email,
      nickName: user.nickName,
      //   subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
exports.logoutUser = async (req, res, next) => {
  try {
    const { user } = req;
    await userModel.updateUserToken(user._id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
// exports.updateSubscription = async (req, res, next) => {
//   try {
//     const { user } = req;

//     const result = await userModel.findByIdAndUpdate(
//       user._id,
//       {
//         subscription: req.body.subscription,
//       },
//       {
//         new: true,
//       },
//     );

//     res.status(200).json({
//       id: result._id,
//       email: result.email,
//       subscription: result.subscription,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateAvatar = async (req, res, next) => {
//   try {
//     const { user } = req;
//     const { file } = req;
//     const result = await userModel.findByIdAndUpdate(
//       user._id,
//       {
//         avatarURL: req.avatarURL,
//       },
//       {
//         new: true,
//       },
//     );
//     if (result) {
//       const fileName = path.parse(user.avatarURL).base;
//       await fsPromises.unlink(`public/images/${fileName}`);
//     }

//     res.status(200).json({
//       id: result._id,
//       email: result.email,
//       subscription: result.subscription,
//       avatarURL: result.avatarURL,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.checkUniqueEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json('Email in use');
    }
    next();
  } catch (error) {
    next(error);
  }
};
