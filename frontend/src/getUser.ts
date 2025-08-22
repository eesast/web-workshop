import { jwtDecode } from "jwt-decode";

interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

export interface user {
  username: string;
  uuid: string;
}

const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload: userJWTPayload = jwtDecode(token);
  const username = localStorage.getItem("username");
  if (!username) return null;
  const user: user = {
    username: username,
    uuid: payload.uuid,
  };
  return user;
};

export default getUser;
