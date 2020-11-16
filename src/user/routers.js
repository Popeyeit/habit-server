const express = require('express');
const userRouter = express.Router();
const { handleValidate } = require('../helpers/validate');

const {
  registerUser,
  loginUser,
  authorize,
  logoutUser,
  currentUser,
  updateSubscription,
  checkUniqueEmail,
  updateAvatar,
  verifyEmail,
} = require('./controllers');
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  updateAvatarSchema,
} = require('./schemes');
userRouter.post(
  '/register',
  handleValidate(registerSchema),
  checkUniqueEmail,
  registerUser,
);
userRouter.get('/verify/:verificationToken', verifyEmail);
userRouter.post('/login', handleValidate(loginSchema), loginUser);
userRouter.get('/current', authorize, currentUser);
userRouter.post('/logout', authorize, logoutUser);
// userRouter.patch(
//   '/update-subscription',
//   authorize,
//   handleValidate(updateSubscriptionSchema),
//   updateSubscription,
// );
// userRouter.patch(
//   '/avatars',
//   authorize,
//   handleValidate(updateAvatarSchema),
//   updateAvatar,
// );

module.exports = userRouter;
