import * as Login from './login'

const allQueries = [Login];

export const schema =
    `type Query{
        ${allQueries.map(({name, params, result}) => `${name}${params}: ${result}`).join("\n")}
    } `;

export const resolvers = allQueries.reduce((resolvers, query) => ({
    ...resolvers,
    [query.name]: query.resolver
}), {});