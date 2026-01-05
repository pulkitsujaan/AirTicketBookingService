const { Booking } = require('../models/index');
const { AppError, ValidationError } = require('../utils/errors/index');
const {StatusCodes} = require('http-status-codes');

class BookingRepository{
    async create(data){
        try {
            const booking = await Booking.create(data);
            return booking;

        } catch (error) {
            if(error.name = 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create a Booking',
                'There was some issue, Please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    async updateBooking(bookingId, data){
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status){
                booking.status=data.status;
            }
            booking.save();
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot create a Booking',
                'There was some issue, Please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = BookingRepository;