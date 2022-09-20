import crypto from "crypto"
import jwt from 'jsonwebtoken'
import db from "../../db";

// Just random key... we don't really care for security :D
const examplePrivateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIBOQIBAAJAVGB3WG7UL1ZmEDoonu4A4kGLtli899SJqd/Hj4tlTFZgeC21ulQA\n" +
    "bo0nbcAzukCEjvrnO0lCBO45QRHWJnRAIQIDAQABAkBPWhGjR0eh5T1DUY7WOLr4\n" +
    "DfCY4seEw4tcCSqiotP3f8fGq+eClbUF3lNHqQ7mS0UrMI20A35KDtq/qCCyhtoB\n" +
    "AiEAmGV7hm1G59Zcebn9E8MdRB5wGfE4OeHV/tXIx/ppEjECIQCNvRnZLeC6vhtC\n" +
    "Dw5NREbZkiMkZS8rL8ZbvJu3xoQg8QIhAI4Y8hjiA99gbVHDLksi/0Lo7rYByd+O\n" +
    "yC6ZwGFXCGnBAiAflaAI8Vw+wNY6Jji9pxVSrmn+Vj3olcDR+HmKvkX7QQIgKmLb\n" +
    "2C06hRdjSHR11IfQftWD7Rr9lRFeSVrGGWao3rI=\n" +
    "-----END RSA PRIVATE KEY-----"

export const login = (email: string, password: string) => {
    const user = db.getCollection("users").findOne({email});
    if (!user) throw new Error("User not found");
    if (!compare(user.password, password)) throw new Error("Wrong password");
    return jwt.sign({email}, examplePrivateKey, {algorithm: 'RS256'});
}
export const verify = (token: string) => {
    return jwt.verify(token, examplePrivateKey, {algorithms: ['RS256']});
}

export const register = (email: string, password: string) => {
    const hashedPwd = hashPassword(password, randomsalt());
    db.getCollection("users").insert({email, password: hashedPwd});
}

const randomsalt = () => crypto.randomBytes(16)
    .toString('hex')
    .slice(0, 16);


const compare = (hash: string, password: string): boolean => {
    const salt = hash.split(".")[0]
    const res = hashPassword(password, salt);
    return res === hash;
}

const hashPassword = (password: string, salt: string) => {
    const value = crypto.createHmac('sha512', salt).update(password).digest('hex');
    return `${salt}.${value}`
}