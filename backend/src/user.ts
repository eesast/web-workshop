import express from "express";
import jwt from "jsonwebtoken";
import authenticate from "./authenticate";
import { sdk as graphql } from "./index";

// Pre-set some validation methods

const validatePassword = (password: string): boolean => {
  return password.length >= 4 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};

const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};



interface userJWTPayload {
  uuid: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
  };
}

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password-login");
  }
  //databaseHW:2.3
  if (!validatePassword(password)) {
    return res.status(422).send( "密码必须至少4个字符，且包含字母和数字");
  }


  try {
    console.log("test3");
    const queryResult = await graphql.getUsersByUsername({ username: username });
    console.log("test2");
    if (queryResult.user.length === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    const user = queryResult.user[0];
    if (user.password !== password) {
      return res.status(401).send("401 Unauthorized: Password does not match");
    }

    console.log("test1");

    const payload: userJWTPayload = {
      uuid: user.uuid,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "user",
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).send("422 Unprocessable Entity: Missing username or password-register");
  }

  //databaseHW:2.3
  if (!validatePassword(password)) {
    return res.status(422).send( "密码必须至少4个字符，且包含字母和数字");
  }
  if (!validateUsername(username)) {
    return res.status(422).send("用户名必须至少3个字符，最多20个字符，且只能包含字母、数字、下划线");
  }


  try {
    const queryResult = await graphql.getUsersByUsername({ username: username });
    if (queryResult.user.length !== 0) {
      return res.status(409).send("409 Conflict: User already exists");
    }
    const mutationResult = await graphql.addUser({ username: username, password: password });
    const payload: userJWTPayload = {
      uuid: mutationResult.insert_user_one?.uuid,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "user",
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.get("/delete",authenticate,async(req,res)=>
{

  try {

    const authHeader = req.get("Authorization");
    const token = authHeader!.substring(7);
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as userJWTPayload;
    console.log("decoded");
    const userUuid = decoded.uuid;
    //databaseHW:2.3
    if (!validateUUID(userUuid)) {
      return res.status(422).send("422 Unprocessable Entity: Invalid uuid");
    }

    //先删除信息，退出房间
    const mutationResult1 = await graphql.deleteMessageByUsername({user_uuid: userUuid });
    const mutationResult2 = await graphql.quitRoom({user_uuid: userUuid });

    //最后再删除用户
    const mutationResult = await graphql.deleteUser({ uuid: userUuid });
    if (mutationResult.delete_user?.affected_rows === 0) {
      return res.status(404).send("404 Not Found: User does not exist");
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
})

export default router;
