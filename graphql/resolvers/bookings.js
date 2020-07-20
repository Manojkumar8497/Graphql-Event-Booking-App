// Booking model
const Booking = require("../../model/booking");

// Helper methods
const { transformBooking, transformEvent } = require("../resolvers/helpers");

module.exports = {
    bookings: async (req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        }
        catch (err) {
            return err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        try {
            const { eventId } = args;
            const booking = await Booking({
                event: eventId,
                user: "5f12d45d053e1e1efc5479c2"
            })
            const result = await booking.save();
            return transformBooking(result);
        }
        catch (err) {
            return err;
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        try {
            const { bookingId } = args;
            const booking = await Booking.findOne({ _id: bookingId }).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: bookingId });
            return event;
        }
        catch (err) {
            return err;
        }
    }
}