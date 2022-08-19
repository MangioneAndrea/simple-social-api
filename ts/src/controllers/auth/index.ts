import * as Services from "../../services"

export const login = ({email, password}: { email: string, password: string }) => {
    console.log(email, password)
    return Services.Auth.login(email, password);
}