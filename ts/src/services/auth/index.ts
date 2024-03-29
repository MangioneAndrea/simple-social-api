import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  AuthServiceClientImpl,
  AuthUser,
  User,
} from "../../protocolbuffers/auth";
import { request } from "../../protocolbuffers";

export const AuthService = new AuthServiceClientImpl({ request });

export const login = async (email: string, password: string) => {
  try {
    const u = User.fromJSON({ email });
    const user = await AuthService.GetAuthUser(u);
    if (!user) throw new Error("User not found");
    if (!compare(user.password, password)) throw new Error("email or password wrong");
    return jwt.sign({ email }, examplePrivateKey, { algorithm: "RS256" });
  } catch (e) {
    if (e.message.includes("no documents in result")) throw new Error("email or password wrong");
    throw e;
  }
};
export const verify = (token: string) => {
  return jwt.verify(token, examplePrivateKey, { algorithms: ["RS256"] });
};

export const register = async (email: string, pw: string) => {
  try {
    const password = hashPassword(pw, randomsalt());
    return await AuthService.CreateUser(AuthUser.fromJSON({ email, password }));
  } catch (e) {
    if (e.message.includes("E11000")) throw new Error("email already in use");
    throw e;
  }
};

const randomsalt = () => crypto.randomBytes(16).toString("hex").slice(0, 16);

const compare = (hash: string, password: string): boolean => {
  const salt = hash.split(".")[0];
  const res = hashPassword(password, salt);
  return res === hash;
};

const hashPassword = (password: string, salt: string) => {
  const value = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("hex");
  return `${salt}.${value}`;
};

// Just random key... we don't really care for security :D
const examplePrivateKey =
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIBOQIBAAJAVGB3WG7UL1ZmEDoonu4A4kGLtli899SJqd/Hj4tlTFZgeC21ulQA\n" +
  "bo0nbcAzukCEjvrnO0lCBO45QRHWJnRAIQIDAQABAkBPWhGjR0eh5T1DUY7WOLr4\n" +
  "DfCY4seEw4tcCSqiotP3f8fGq+eClbUF3lNHqQ7mS0UrMI20A35KDtq/qCCyhtoB\n" +
  "AiEAmGV7hm1G59Zcebn9E8MdRB5wGfE4OeHV/tXIx/ppEjECIQCNvRnZLeC6vhtC\n" +
  "Dw5NREbZkiMkZS8rL8ZbvJu3xoQg8QIhAI4Y8hjiA99gbVHDLksi/0Lo7rYByd+O\n" +
  "yC6ZwGFXCGnBAiAflaAI8Vw+wNY6Jji9pxVSrmn+Vj3olcDR+HmKvkX7QQIgKmLb\n" +
  "2C06hRdjSHR11IfQftWD7Rr9lRFeSVrGGWao3rI=\n" +
  "-----END RSA PRIVATE KEY-----";
