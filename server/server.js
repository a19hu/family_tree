// https://github.com/bradtraversy/project-mgmt-graphql/blob/main/.env.example
const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./schema/schema');
const ConnectDB = require('./config/db');
const port = process.env.PORT || 4000;
const cors = require('cors');

const app = express();
ConnectDB();




app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, 
}));

app.listen(port, () => {
    console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
