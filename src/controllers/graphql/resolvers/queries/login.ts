import {Auth} from "../../../../services"

export const name = 'login';
export const params= '(email: String!, password: String!)'
export const result = 'String';

export function resolver(email: string, password: string): String {
    return Auth.login(email, password);
}