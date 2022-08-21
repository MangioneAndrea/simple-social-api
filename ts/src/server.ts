import {loadSchema} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader"
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import {graphqlHTTP} from "express-graphql";
import express, {NextFunction, Request, Response} from 'express'

import * as controllers from './controllers'
import * as middlewares from "./middlewares";

const port = 8080;
const app = express();

const schema = await loadSchema(`${dirname(fileURLToPath(import.meta.url))}/../../graphql/schema.graphql`, {
    loaders: [new GraphQLFileLoader()]
});

app.use(express.json())

app.use("/graphql", (req: Request, res: Response) => graphqlHTTP({
    schema: schema,
    rootValue: controllers,
    graphiql: true,
    context: middlewares.graphqlContext(req)
})(req, res))


app.listen(port, () => {
    console.log(`server started! Port: ${port}`)
});