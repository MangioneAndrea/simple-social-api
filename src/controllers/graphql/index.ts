import {Express} from "express";
import {graphqlHTTP} from "express-graphql";
import {buildSchema} from "graphql";
import * as Query from './resolvers/queries'

export default function (app: Express) {
    app.use('/graphql', graphqlHTTP({
        graphiql: true,
        schema: buildSchema(`
            ${Query.schema}
        `),
        rootValue: {
            ...Query.resolvers
        }
    }))
}