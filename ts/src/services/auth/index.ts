import crypto from "crypto";
import jwt from "jsonwebtoken";import grpc from "@grpc/grpc-js";
import { AuthServiceClientImpl } from "../../protocolbuffers/auth";

const grpcServerUrl = "0.0.0.0:50051";

const Client = grpc.makeGenericClientConstructor({}, "AuthService", {});
const client = new Client(grpcServerUrl, grpc.credentials.createInsecure());

function request(
  service: string,
  method: string,
  data: Uint8Array
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    client.makeUnaryRequest(
      service + "/" + method,
      (message: Uint8Array) => message.buffer as Buffer,
      (message: Uint8Array) => message,
      data,
      (err: Error | null, response: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(response as Uint8Array);
        }
      }
    );
  });
}
export const AuthService = new AuthServiceClientImpl({ request });

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

export const login = async (email: string, password: string) => {
  const user = await AuthService.GetAuthUser( {email});
  //db.getCollection("users").findOne({email});
  if (!user) throw new Error("User not found");
  if (!compare(user.getPassword(), password)) throw new Error("Wrong password");
  return jwt.sign({ email }, examplePrivateKey, { algorithm: "RS256" });
};
export const verify = (token: string) => {
  return jwt.verify(token, examplePrivateKey, { algorithms: ["RS256"] });
};

export const register = (email: string, password: string) => {
  const hashedPwd = hashPassword(password, randomsalt());
  return createUser(email, hashedPwd);
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
