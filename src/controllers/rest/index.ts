import express from 'express'
import bodyParser from 'body-parser'
import {Auth} from "../../services"

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

app.post("/login", (req: express.Request, res: express.Response) => {
    const {user, password} = req.body;
    if (!user) {
        res.status(401).json({error: "You must provide a user"})
        return
    }
    if (!password) {
        res.status(401).json({error: "You must provide a password"})
        return
    }

    const jwt = Auth.login(user, password);

    res.status(200).json({jwt})
})

app.post("/verifyToken", (req: express.Request, res: express.Response) => {
    const {token} = req.body;
    if (!token) {
        res.status(401).json({error: "You must provide a token"})
        return
    }

    const decoded = Auth.verify(token);

    res.status(200).json(decoded)
})


const port = 8080;
app.listen(port, () => {
    console.log(`server started! Port: ${port}`)
});