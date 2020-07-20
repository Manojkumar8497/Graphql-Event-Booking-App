// Event model
const Event = require("../../model/event");
// User model
const User = require("../../model/user");
// Helper methods
const { getUser, transformEvent } = require("../resolvers/helpers");

module.exports = {
    /**
     * Getting all events
     */
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            })
        }
        catch (err) {
            console.log(err);
        }
    },
    /**
     * Create a single event
     */
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        try {
            const inputData = args.eventInput;
            const event = new Event({
                title: inputData.title,
                description: inputData.description,
                price: +inputData.price,
                creator: req.userId
            });
            const result = await event.save();
            const user = await User.findOne({ _id: req.userId })
            if (!user) {
                return new Error("User not found");
            }
            user.createdEvents.push(result._id);
            await user.save();
            return { ...result._doc, creator: getUser.bind(this, result._doc.creator) };
        }
        catch (err) {
            console.log(err);
        }
    }
}