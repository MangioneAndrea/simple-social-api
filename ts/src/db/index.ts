import Auth from "../../protocolbuffers/auth/auth_pb";

export const host = "http://localhost:8080"

const client = new Auth.AuthServicePromiseClient(host, null, null);