import * as Services from "../../services";

export const jwt = ({ email, password }: { email: string; password: string }) => {
  return Services.Auth.login(email, password);
};

export const register = async ( { email, password }: { email: string; password: string }) => {
  const sad = await Services.Auth.register(email, password);
  return sad;
};
