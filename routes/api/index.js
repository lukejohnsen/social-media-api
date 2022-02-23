const router = require('express').Router();
const thoughtRoute = require('./thought-routes');
const userRoute = require('./user-routes');

router.use('/user', userRoute);
router.use('/thoughts', thoughtRoute);

module.exports = router;