import express from 'express'
import bodyParser from 'body-parser'

import initGraphql from './graphql'
import initRest from './rest'

const app = express();
// parse various different custom JSON types as JSON
app.use(bodyParser.json({type: 'application/*+json'}))
// parse some custom thing into a Buffer
app.use(bodyParser.raw({type: 'application/vnd.custom-type'}))
// parse an HTML body into a string
app.use(bodyParser.text({type: 'text/html'}))
app.use(bodyParser.urlencoded({
    extended: true
}));

initGraphql(app)
initRest(app)

