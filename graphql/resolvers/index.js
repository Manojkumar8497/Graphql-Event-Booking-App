const authResolver = require("./auth");
const bookingResolver = require("./bookings");
const eventResolver = require("./events");

// merge all the resolver into root resolver
const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
}

module.exports = rootResolver;