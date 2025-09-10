import { GraphQLClient } from "graphql-request";
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
export declare class MeetingAppSDK {
    private client;
    constructor(client: GraphQLClient);
    GetUserByUsername(variables: {
        username: string;
    }): Promise<{
        user: User[];
    }>;
    GetUserById(variables: {
        uuid: string;
    }): Promise<{
        user_by_pk: User;
    }>;
    CreateUser(variables: {
        username: string;
        password: string;
    }): Promise<{
        insert_user_one: User;
    }>;
    UpdateUserPassword(variables: {
        uuid: string;
        password: string;
    }): Promise<{
        update_user_by_pk: User;
    }>;
    DeleteUser(variables: {
        uuid: string;
    }): Promise<{
        delete_user_by_pk: User;
    }>;
    GetRoomById(variables: {
        uuid: string;
    }): Promise<{
        room_by_pk: Room;
    }>;
    CreateRoom(variables: {
        name: string;
        description?: string;
        creator: string;
    }): Promise<{
        insert_room_one: Room;
    }>;
    GetRoomsByCreator(variables: {
        creator: string;
    }): Promise<{
        room: Room[];
    }>;
    CreateFile(variables: {
        room: string;
        filename: string;
        filepath: string;
        filesize: number;
        filetype: string;
        uploader: string;
    }): Promise<{
        insert_file_one: File;
    }>;
    GetFilesByRoom(variables: {
        room: string;
    }): Promise<{
        file: File[];
    }>;
    GetFileById(variables: {
        uuid: string;
    }): Promise<{
        file_by_pk: File;
    }>;
    GetFileByRoomAndName(variables: {
        room: string;
        filename: string;
    }): Promise<{
        file: File[];
    }>;
    DeleteFile(variables: {
        uuid: string;
    }): Promise<{
        delete_file_by_pk: File;
    }>;
    SearchFiles(variables: {
        room: string;
        filename: string;
    }): Promise<{
        file: File[];
    }>;
    CreateMessage(variables: {
        room: string;
        content: string;
        sender: string;
    }): Promise<{
        insert_message_one: Message;
    }>;
    GetMessagesByRoom(variables: {
        room: string;
    }): Promise<{
        message: Message[];
    }>;
    DeleteMessage(variables: {
        uuid: string;
    }): Promise<{
        delete_message_by_pk: Message;
    }>;
}
export declare function getSdk(client: GraphQLClient): MeetingAppSDK;
//# sourceMappingURL=graphql.d.ts.map