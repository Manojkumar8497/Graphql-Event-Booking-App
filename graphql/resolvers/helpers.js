// Event model
const Event = require("../../model/event");
// User model
const User = require("../../model/user");
// DataLoader
const DataLoader = require('dataloader');
// Event Loader
const eventLoader = new DataLoader(eventIds => {
    return getEvents(eventIds);
});
// User Loader
const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
});

// Getting user based on ID
const getUser = async (userID) => {
    try {
        const user = await userLoader.load(userID.toString());
        return { ...user._doc, createdEvents: () => eventLoader.loadMany(user.createdEvents) };
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
        const event = await eventLoader.load(eventId);
        return event;
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