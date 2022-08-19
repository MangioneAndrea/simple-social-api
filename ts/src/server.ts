import {loadSchema} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader"
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import {graphqlHTTP} from "express-graphql";
import express from 'express'

import * as controllers from './controllers'


const port = 8080;
const app = express();

const schema = await loadSchema(`${dirname(fileURLToPath(import.meta.url))}/../../graphql/schema.graphql`, {
    loaders: [new GraphQLFileLoader()]
});


app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: controllers,
    graphiql: true
}))


app.listen(port, () => {
    console.log(`server started! Port: ${port}`)
});