import {Auth} from "../../services"
import express, {Express} from "express";

export default function (app: Express) {
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

}