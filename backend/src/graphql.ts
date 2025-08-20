import { GraphQLClient } from "graphql-request";

// GraphQL查询和变更定义
const GET_USER_BY_USERNAME = `
  query GetUserByUsername($username: String!) {
    user(where: {username: {_eq: $username}}) {
      uuid
      username
      password
    }
  }
`;

const GET_USER_BY_ID = `
  query GetUserById($uuid: uuid!) {
    user_by_pk(uuid: $uuid) {
      uuid
      username
    }
  }
`;

const CREATE_USER = `
  mutation CreateUser($username: String!, $password: String!) {
    insert_user_one(object: {username: $username, password: $password}) {
      uuid
      username
    }
  }
`;

const UPDATE_USER_PASSWORD = `
  mutation UpdateUserPassword($uuid: uuid!, $password: String!) {
    update_user_by_pk(pk_columns: {uuid: $uuid}, _set: {password: $password}) {
      uuid
      username
    }
  }
`;

const DELETE_USER = `
  mutation DeleteUser($uuid: uuid!) {
    delete_user_by_pk(uuid: $uuid) {
      uuid
      username
    }
  }
`;

const GET_ROOM_BY_ID = `
  query GetRoomById($uuid: uuid!) {
    room_by_pk(uuid: $uuid) {
      uuid
      name
      description
      creator
    }
  }
`;

const CREATE_ROOM = `
  mutation CreateRoom($name: String!, $description: String, $creator: uuid!) {
    insert_room_one(object: {name: $name, description: $description, creator: $creator}) {
      uuid
      name
      description
      creator
    }
  }
`;

const GET_ROOMS_BY_CREATOR = `
  query GetRoomsByCreator($creator: uuid!) {
    room(where: {creator: {_eq: $creator}}) {
      uuid
      name
      description
      created_at
    }
  }
`;

const CREATE_FILE = `
  mutation CreateFile($room: uuid!, $filename: String!, $filepath: String!, $filesize: Int!, $filetype: String!, $uploader: uuid!) {
    insert_file_one(object: {room: $room, filename: $filename, filepath: $filepath, filesize: $filesize, filetype: $filetype, uploader: $uploader}) {
      uuid
      filename
      filesize
      filetype
      uploader
    }
  }
`;

const GET_FILES_BY_ROOM = `
  query GetFilesByRoom($room: uuid!) {
    file(where: {room: {_eq: $room}}) {
      uuid
      filename
      filesize
      filetype
      uploader
      created_at
    }
  }
`;

const GET_FILE_BY_ID = `
  query GetFileById($uuid: uuid!) {
    file_by_pk(uuid: $uuid) {
      uuid
      filename
      filepath
      filesize
      filetype
      uploader
    }
  }
`;

const GET_FILE_BY_ROOM_AND_NAME = `
  query GetFileByRoomAndName($room: uuid!, $filename: String!) {
    file(where: {room: {_eq: $room}, filename: {_eq: $filename}}) {
      uuid
      filename
      filepath
      filesize
      filetype
      uploader
    }
  }
`;

const DELETE_FILE = `
  mutation DeleteFile($uuid: uuid!) {
    delete_file_by_pk(uuid: $uuid) {
      uuid
      filename
    }
  }
`;

const SEARCH_FILES = `
  query SearchFiles($room: uuid!, $filename: String!) {
    file(where: {room: {_eq: $room}, filename: {_ilike: $filename}}) {
      uuid
      filename
      filesize
      filetype
      uploader
      created_at
    }
  }
`;

const CREATE_MESSAGE = `
  mutation CreateMessage($room: uuid!, $content: String!, $sender: uuid!) {
    insert_message_one(object: {room: $room, content: $content, sender: $sender}) {
      uuid
      content
      sender
      created_at
    }
  }
`;

const GET_MESSAGES_BY_ROOM = `
  query GetMessagesByRoom($room: uuid!) {
    message(where: {room: {_eq: $room}}, order_by: {created_at: asc}) {
      uuid
      content
      sender
      created_at
      user {
        username
      }
    }
  }
`;

const DELETE_MESSAGE = `
  mutation DeleteMessage($uuid: uuid!) {
    delete_message_by_pk(uuid: $uuid) {
      uuid
      content
    }
  }
`;

// SDK类型定义
export interface User {
  uuid: string;
  username: string;
  password?: string;
}

export interface Room {
  uuid: string;
  name: string;
  description?: string;
  creator: string;
  created_at?: string;
}

export interface File {
  uuid: string;
  filename: string;
  filepath?: string;
  filesize: number;
  filetype: string;
  uploader: string;
  created_at?: string;
}

export interface Message {
  uuid: string;
  content: string;
  sender: string;
  created_at: string;
  user?: {
    username: string;
  };
}

// SDK类
export class MeetingAppSDK {
  constructor(private client: GraphQLClient) {}

  // 用户相关操作
  async GetUserByUsername(variables: { username: string }) {
    return this.client.request<{ user: User[] }>(GET_USER_BY_USERNAME, variables);
  }

  async GetUserById(variables: { uuid: string }) {
    return this.client.request<{ user_by_pk: User }>(GET_USER_BY_ID, variables);
  }

  async CreateUser(variables: { username: string; password: string }) {
    return this.client.request<{ insert_user_one: User }>(CREATE_USER, variables);
  }

  async UpdateUserPassword(variables: { uuid: string; password: string }) {
    return this.client.request<{ update_user_by_pk: User }>(UPDATE_USER_PASSWORD, variables);
  }

  async DeleteUser(variables: { uuid: string }) {
    return this.client.request<{ delete_user_by_pk: User }>(DELETE_USER, variables);
  }

  // 房间相关操作
  async GetRoomById(variables: { uuid: string }) {
    return this.client.request<{ room_by_pk: Room }>(GET_ROOM_BY_ID, variables);
  }

  async CreateRoom(variables: { name: string; description?: string; creator: string }) {
    return this.client.request<{ insert_room_one: Room }>(CREATE_ROOM, variables);
  }

  async GetRoomsByCreator(variables: { creator: string }) {
    return this.client.request<{ room: Room[] }>(GET_ROOMS_BY_CREATOR, variables);
  }

  // 文件相关操作
  async CreateFile(variables: { room: string; filename: string; filepath: string; filesize: number; filetype: string; uploader: string }) {
    return this.client.request<{ insert_file_one: File }>(CREATE_FILE, variables);
  }

  async GetFilesByRoom(variables: { room: string }) {
    return this.client.request<{ file: File[] }>(GET_FILES_BY_ROOM, variables);
  }

  async GetFileById(variables: { uuid: string }) {
    return this.client.request<{ file_by_pk: File }>(GET_FILE_BY_ID, variables);
  }

  async GetFileByRoomAndName(variables: { room: string; filename: string }) {
    return this.client.request<{ file: File[] }>(GET_FILE_BY_ROOM_AND_NAME, variables);
  }

  async DeleteFile(variables: { uuid: string }) {
    return this.client.request<{ delete_file_by_pk: File }>(DELETE_FILE, variables);
  }

  async SearchFiles(variables: { room: string; filename: string }) {
    return this.client.request<{ file: File[] }>(SEARCH_FILES, variables);
  }

  // 消息相关操作
  async CreateMessage(variables: { room: string; content: string; sender: string }) {
    return this.client.request<{ insert_message_one: Message }>(CREATE_MESSAGE, variables);
  }

  async GetMessagesByRoom(variables: { room: string }) {
    return this.client.request<{ message: Message[] }>(GET_MESSAGES_BY_ROOM, variables);
  }

  async DeleteMessage(variables: { uuid: string }) {
    return this.client.request<{ delete_message_by_pk: Message }>(DELETE_MESSAGE, variables);
  }
}

// 创建SDK实例的工厂函数
export function getSdk(client: GraphQLClient): MeetingAppSDK {
  return new MeetingAppSDK(client);
}
