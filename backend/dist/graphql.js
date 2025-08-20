"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingAppSDK = void 0;
exports.getSdk = getSdk;
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
// SDK类
class MeetingAppSDK {
    constructor(client) {
        this.client = client;
    }
    // 用户相关操作
    async GetUserByUsername(variables) {
        return this.client.request(GET_USER_BY_USERNAME, variables);
    }
    async GetUserById(variables) {
        return this.client.request(GET_USER_BY_ID, variables);
    }
    async CreateUser(variables) {
        return this.client.request(CREATE_USER, variables);
    }
    async UpdateUserPassword(variables) {
        return this.client.request(UPDATE_USER_PASSWORD, variables);
    }
    async DeleteUser(variables) {
        return this.client.request(DELETE_USER, variables);
    }
    // 房间相关操作
    async GetRoomById(variables) {
        return this.client.request(GET_ROOM_BY_ID, variables);
    }
    async CreateRoom(variables) {
        return this.client.request(CREATE_ROOM, variables);
    }
    async GetRoomsByCreator(variables) {
        return this.client.request(GET_ROOMS_BY_CREATOR, variables);
    }
    // 文件相关操作
    async CreateFile(variables) {
        return this.client.request(CREATE_FILE, variables);
    }
    async GetFilesByRoom(variables) {
        return this.client.request(GET_FILES_BY_ROOM, variables);
    }
    async GetFileById(variables) {
        return this.client.request(GET_FILE_BY_ID, variables);
    }
    async GetFileByRoomAndName(variables) {
        return this.client.request(GET_FILE_BY_ROOM_AND_NAME, variables);
    }
    async DeleteFile(variables) {
        return this.client.request(DELETE_FILE, variables);
    }
    async SearchFiles(variables) {
        return this.client.request(SEARCH_FILES, variables);
    }
    // 消息相关操作
    async CreateMessage(variables) {
        return this.client.request(CREATE_MESSAGE, variables);
    }
    async GetMessagesByRoom(variables) {
        return this.client.request(GET_MESSAGES_BY_ROOM, variables);
    }
    async DeleteMessage(variables) {
        return this.client.request(DELETE_MESSAGE, variables);
    }
}
exports.MeetingAppSDK = MeetingAppSDK;
// 创建SDK实例的工厂函数
function getSdk(client) {
    return new MeetingAppSDK(client);
}
//# sourceMappingURL=graphql.js.map