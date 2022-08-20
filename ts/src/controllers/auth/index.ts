import * as Services from "../../services"

export const login = ({email, password}: { email: string, password: string }) => {
    return Services.Auth.login(email, password);
}

export const register = ({email, password}: { email: string, password: string }) => {
    return Services.Auth.register(email, password);
}