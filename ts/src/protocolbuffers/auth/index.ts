import { AuthServiceClient } from "./auth_grpc_pb";
import { User, AuthUser } from "./auth_pb";

const client = new AuthServiceClient("0.0.0.0:50051", null, null);

export const getAuthUser = (email: string) =>
  new Promise<AuthUser>((res, rej) => {
    const user = new User();
    user.setEmail(email);
    client.getAuthUser(user, (err, value) => {
      if (err) {
        rej(err);
      } else {
        res(value);
      }
    });
  });

export const createUser = (email: string, password: string) =>
  new Promise<User>((res, rej) => {
    const user = new AuthUser();
    user.setEmail(email);
    user.setPassword(password);
    client.createUser(user, (err, value) => {
      if (err) {
        rej(err);
      } else {
        res(value);
      }
    });
  });
