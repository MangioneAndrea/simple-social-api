import * as Services from "../../services"

export const jwt = ({email, password}: { email: string, password: string }, context: any) => {
    return Services.Auth.login(email, password);
}

export const register = ({email, password}: { email: string, password: string }, context: any) => {
    return Services.Auth.register(email, password);
}