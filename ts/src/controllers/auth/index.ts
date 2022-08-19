import * as Services from "../../services"

export const login = (email: string, password: string) => {
    return Services.Auth.login(email, password);
}