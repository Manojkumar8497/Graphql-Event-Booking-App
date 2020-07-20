// Event model
const Event = require("../../model/event");
// User model
const User = require("../../model/user");

// Getting user based on ID
const getUser = async (userID) => {
    try {
        const user = await User.findById(userID);
        return { ...user._doc, createdEvents: getEvents.bind(this, user.createdEvents) };
    }
    catch (err) {
        return err;
    }
}

// Getting event based on ID
const getEvents = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch (err) {
        return err;
    }
}

// Getting single event
const getEvent = async (eventId) => {
    try {
        const event = await Event.findOne({ _id: eventId });
        return transformEvent(event);
    }
    catch (err) {
        return err;
    }
}

// Transforming the event data
const transformEvent = (event) => {
    return {
        ...event._doc,
        creator: getUser.bind(this, event.creator)
    }
}

// Transforming the booking data
const transformBooking = booking => {
    return {
        ...booking._doc,
        event: getEvent.bind(this, booking._doc.event),
        user: getUser.bind(this, booking._doc.user)
    }
}

exports.getUser = getUser;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;