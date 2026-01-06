const {BookingRepository} = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');
const repository = require('../repository/index');
class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await fetch(getFlightRequestURL);
            const flightResponseBody = await response.json();
            const flightData = flightResponseBody.data;
            let priceOfFlight = flightData.price;
            if(data.noOfSeats>flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient Seats in the flight');
            }

            const totalCost = priceOfFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await fetch(updateFlightRequestURL, {
                method:'PATCH',
                body:JSON.stringify({totalSeats: flightData.totalSeats - booking.noOfSeats}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const finalBooking = await this.bookingRepository.updateBooking(booking.id, {status:"Booked"});
            return finalBooking;
        } catch (error) {
            if(error.name == 'RepositoryError' || 'ValidationError') throw error;
            throw new ServiceError;
        }
    }

    async updateBooking(bookingId, data){
        try {
            const booking = await this.bookingRepository.getBooking(bookingId);
            const flightId = booking.flightId;
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await fetch(getFlightRequestURL);
            const flightResponseBody = await response.json();
            const flightData = flightResponseBody.data;
            if(data.status){
                if(data.status!=booking.status){
                    if(data.status=='Cancelled'){
                        await fetch(updateFlightRequestURL, {
                        method:'PATCH',
                        body:JSON.stringify({totalSeats: flightData.totalSeats + booking.noOfSeats}),
                        headers: {
                            'Content-Type': 'application/json'
                        }});
                    }
                    if(data.status=='Booked'){
                        await fetch(updateFlightRequestURL, {
                        method:'PATCH',
                        body:JSON.stringify({totalSeats: flightData.totalSeats - booking.noOfSeats}),
                        headers: {
                            'Content-Type': 'application/json'
                        }});
                    }
            }         
        }
            const updatedBooking = await this.bookingRepository.updateBooking(bookingId, data);
            return updatedBooking;
        } catch (error) {
            console.log(error);
            if(error.name == 'RepositoryError' || 'ValidationError') throw error;
            throw new ServiceError;
        }
    }

}

module.exports = BookingService;