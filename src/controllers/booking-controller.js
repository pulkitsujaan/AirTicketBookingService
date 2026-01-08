const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services/index')

const bookingService = new BookingService();
const { createChannel, publishMessage } = require('../utils/messageQueue')
const {REMINDER_BINDING_KEY} = require('../config/serverConfig')
class BookingController{
    constructor(){
    }

    async sendMessageToQueue(req, res){
        const channel = await createChannel();
        const payload = {
            data:{
                subject:'This is a new ticket',
                content:'Some queue will subscribe this',
                recepientEmail:'cs11912@gmail.com',
                notificationTime:'2026-01-09T00:39:00'
            },
            service:'CREATE_TICKET'
        }
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event',
        })
    }

    async create (req,res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed the booking',
                success:true,
                err:{},
                data:response
            })
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                message: error.message,
                success:false,
                err:error.explanation,
                data:{}
            })
        }
    }
    
    
    async update (req,res) {
        try {
            const response = await bookingService.updateBooking(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully updated the booking',
                success:true,
                err:{},
                data:response
            })
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                message: error.message,
                success:false,
                err:error.explanation,
                data:{}
            })
        }
    }
}

module.exports = BookingController