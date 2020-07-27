const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// GraphQl
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolver = require('./graphql/resolvers/index');
// DB
const connectDB = require('./config/db');
// IsAuth
const checkAuth = require('./middleware/checkAuth');
// Initialize the express
const app = express();

// Body parser setup
app.use(bodyParser.json());

// CORS
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
//     if(req.method === 'OPTIONS'){
//         res.sendStatus(200);
//     }
//     next();
// })

// Authentication middleware
app.use(checkAuth);

// Graphql router configuration
app.use('/api/graphql', graphqlHTTP({
    // Schema
    schema: graphqlSchema,
    // Resolver Like an Controller in REST
    rootValue: graphqlResolver,
    graphiql: true
}));

// Port config
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server runs on port: ${PORT}`)
    connectDB();
});