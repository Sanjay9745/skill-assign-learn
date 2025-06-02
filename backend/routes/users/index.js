const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const controller = require('./users');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/protected', auth.userAuth, controller.protected);
router.get('/profile', auth.userAuth, controller.getUserProfile);
router.put('/update', auth.userAuth, controller.updateUserProfile);
router.delete('/delete', auth.userAuth, controller.deleteUser);

module.exports = router;