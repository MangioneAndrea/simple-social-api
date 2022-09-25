import {Request} from "express";
import * as services from "../services";
import {JwtPayload} from "jsonwebtoken";

const assertLoggedIn = (req: Request): JwtPayload => {
    try {
        const {authorization} = req.headers
        const jwt = authorization.substring(7)
        return  services.Auth.verify(jwt) as JwtPayload
    } catch (e) {
        console.error(e)
        throw new Error("Not authorized")
    }
}

export const graphqlContext = (req: Request) => {
    return {
        req,
        assertLoggedIn() {
            return assertLoggedIn(req)
        }
    }
}