const express = require('express');
const {BookingController} = require('../../controllers/index')
const bookingController = new BookingController();

const router = express.Router();

router.post('/bookings',bookingController.create);
router.patch('/bookings/:id',bookingController.update);
router.post('/publish', bookingController.sendMessageToQueue);
module.exports = router;