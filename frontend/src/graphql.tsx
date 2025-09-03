import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  timestamp: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "message" */
export type Message = {
  __typename?: 'message';
  content: Scalars['String']['output'];
  created_at: Scalars['timestamp']['output'];
  /** An object relationship */
  room: Room;
  room_uuid: Scalars['uuid']['output'];
  /** An object relationship */
  user: User;
  user_uuid: Scalars['uuid']['output'];
  uuid: Scalars['uuid']['output'];
};

/** aggregated selection of "message" */
export type Message_Aggregate = {
  __typename?: 'message_aggregate';
  aggregate?: Maybe<Message_Aggregate_Fields>;
  nodes: Array<Message>;
};

export type Message_Aggregate_Bool_Exp = {
  count?: InputMaybe<Message_Aggregate_Bool_Exp_Count>;
};

export type Message_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Message_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "message" */
export type Message_Aggregate_Fields = {
  __typename?: 'message_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Max_Fields>;
  min?: Maybe<Message_Min_Fields>;
};


/** aggregate fields of "message" */
export type Message_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "message" */
export type Message_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Message_Max_Order_By>;
  min?: InputMaybe<Message_Min_Order_By>;
};

/** input type for inserting array relation for remote table "message" */
export type Message_Arr_Rel_Insert_Input = {
  data: Array<Message_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Message_On_Conflict>;
};

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type Message_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Bool_Exp>>;
  _not?: InputMaybe<Message_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Bool_Exp>>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  room?: InputMaybe<Room_Bool_Exp>;
  room_uuid?: InputMaybe<Uuid_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  user_uuid?: InputMaybe<Uuid_Comparison_Exp>;
  uuid?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "message" */
export enum Message_Constraint {
  /** unique or primary key constraint on columns "uuid" */
  MessagePkey = 'message_pkey'
}

/** input type for inserting data into table "message" */
export type Message_Insert_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  room?: InputMaybe<Room_Obj_Rel_Insert_Input>;
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Message_Max_Fields = {
  __typename?: 'message_max_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  room_uuid?: Maybe<Scalars['uuid']['output']>;
  user_uuid?: Maybe<Scalars['uuid']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "message" */
export type Message_Max_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  room_uuid?: InputMaybe<Order_By>;
  user_uuid?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Min_Fields = {
  __typename?: 'message_min_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  room_uuid?: Maybe<Scalars['uuid']['output']>;
  user_uuid?: Maybe<Scalars['uuid']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "message" */
export type Message_Min_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  room_uuid?: InputMaybe<Order_By>;
  user_uuid?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "message" */
export type Message_Mutation_Response = {
  __typename?: 'message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Message>;
};

/** on_conflict condition type for table "message" */
export type Message_On_Conflict = {
  constraint: Message_Constraint;
  update_columns?: Array<Message_Update_Column>;
  where?: InputMaybe<Message_Bool_Exp>;
};

/** Ordering options when selecting data from "message". */
export type Message_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  room?: InputMaybe<Room_Order_By>;
  room_uuid?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  user_uuid?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message */
export type Message_Pk_Columns_Input = {
  uuid: Scalars['uuid']['input'];
};

/** select columns of table "message" */
export enum Message_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RoomUuid = 'room_uuid',
  /** column name */
  UserUuid = 'user_uuid',
  /** column name */
  Uuid = 'uuid'
}

/** input type for updating data in table "message" */
export type Message_Set_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "message" */
export type Message_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Stream_Cursor_Value_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "message" */
export enum Message_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RoomUuid = 'room_uuid',
  /** column name */
  UserUuid = 'user_uuid',
  /** column name */
  Uuid = 'uuid'
}

export type Message_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Bool_Exp;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "message" */
  delete_message?: Maybe<Message_Mutation_Response>;
  /** delete single row from the table: "message" */
  delete_message_by_pk?: Maybe<Message>;
  /** delete data from the table: "room" */
  delete_room?: Maybe<Room_Mutation_Response>;
  /** delete single row from the table: "room" */
  delete_room_by_pk?: Maybe<Room>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "user_room" */
  delete_user_room?: Maybe<User_Room_Mutation_Response>;
  /** delete single row from the table: "user_room" */
  delete_user_room_by_pk?: Maybe<User_Room>;
  /** insert data into the table: "message" */
  insert_message?: Maybe<Message_Mutation_Response>;
  /** insert a single row into the table: "message" */
  insert_message_one?: Maybe<Message>;
  /** insert data into the table: "room" */
  insert_room?: Maybe<Room_Mutation_Response>;
  /** insert a single row into the table: "room" */
  insert_room_one?: Maybe<Room>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "user_room" */
  insert_user_room?: Maybe<User_Room_Mutation_Response>;
  /** insert a single row into the table: "user_room" */
  insert_user_room_one?: Maybe<User_Room>;
  /** update data of the table: "message" */
  update_message?: Maybe<Message_Mutation_Response>;
  /** update single row of the table: "message" */
  update_message_by_pk?: Maybe<Message>;
  /** update multiples rows of table: "message" */
  update_message_many?: Maybe<Array<Maybe<Message_Mutation_Response>>>;
  /** update data of the table: "room" */
  update_room?: Maybe<Room_Mutation_Response>;
  /** update single row of the table: "room" */
  update_room_by_pk?: Maybe<Room>;
  /** update multiples rows of table: "room" */
  update_room_many?: Maybe<Array<Maybe<Room_Mutation_Response>>>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update multiples rows of table: "user" */
  update_user_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
  /** update data of the table: "user_room" */
  update_user_room?: Maybe<User_Room_Mutation_Response>;
  /** update single row of the table: "user_room" */
  update_user_room_by_pk?: Maybe<User_Room>;
  /** update multiples rows of table: "user_room" */
  update_user_room_many?: Maybe<Array<Maybe<User_Room_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_MessageArgs = {
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_RoomArgs = {
  where: Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Room_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_RoomArgs = {
  where: User_Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Room_By_PkArgs = {
  room_uuid: Scalars['uuid']['input'];
  user_uuid: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_MessageArgs = {
  objects: Array<Message_Insert_Input>;
  on_conflict?: InputMaybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_OneArgs = {
  object: Message_Insert_Input;
  on_conflict?: InputMaybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RoomArgs = {
  objects: Array<Room_Insert_Input>;
  on_conflict?: InputMaybe<Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_OneArgs = {
  object: Room_Insert_Input;
  on_conflict?: InputMaybe<Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_RoomArgs = {
  objects: Array<User_Room_Insert_Input>;
  on_conflict?: InputMaybe<User_Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Room_OneArgs = {
  object: User_Room_Insert_Input;
  on_conflict?: InputMaybe<User_Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_MessageArgs = {
  _set?: InputMaybe<Message_Set_Input>;
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_By_PkArgs = {
  _set?: InputMaybe<Message_Set_Input>;
  pk_columns: Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_ManyArgs = {
  updates: Array<Message_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RoomArgs = {
  _set?: InputMaybe<Room_Set_Input>;
  where: Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Room_By_PkArgs = {
  _set?: InputMaybe<Room_Set_Input>;
  pk_columns: Room_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Room_ManyArgs = {
  updates: Array<Room_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_RoomArgs = {
  _set?: InputMaybe<User_Room_Set_Input>;
  where: User_Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Room_By_PkArgs = {
  _set?: InputMaybe<User_Room_Set_Input>;
  pk_columns: User_Room_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Room_ManyArgs = {
  updates: Array<User_Room_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_room" */
  user_room: Array<User_Room>;
  /** fetch aggregated fields from the table: "user_room" */
  user_room_aggregate: User_Room_Aggregate;
  /** fetch data from the table: "user_room" using primary key columns */
  user_room_by_pk?: Maybe<User_Room>;
};


export type Query_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessage_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Query_RootRoomArgs = {
  distinct_on?: InputMaybe<Array<Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Room_Order_By>>;
  where?: InputMaybe<Room_Bool_Exp>;
};


export type Query_RootRoom_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Room_Order_By>>;
  where?: InputMaybe<Room_Bool_Exp>;
};


export type Query_RootRoom_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Query_RootUser_RoomArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


export type Query_RootUser_Room_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


export type Query_RootUser_Room_By_PkArgs = {
  room_uuid: Scalars['uuid']['input'];
  user_uuid: Scalars['uuid']['input'];
};

/** columns and relationships of "room" */
export type Room = {
  __typename?: 'room';
  created_at: Scalars['timestamp']['output'];
  intro: Scalars['String']['output'];
  invite_code: Scalars['String']['output'];
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregate relationship */
  messages_aggregate: Message_Aggregate;
  name: Scalars['String']['output'];
  /** An array relationship */
  user_rooms: Array<User_Room>;
  /** An aggregate relationship */
  user_rooms_aggregate: User_Room_Aggregate;
  uuid: Scalars['uuid']['output'];
};


/** columns and relationships of "room" */
export type RoomMessagesArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomMessages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomUser_RoomsArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomUser_Rooms_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};

/** aggregated selection of "room" */
export type Room_Aggregate = {
  __typename?: 'room_aggregate';
  aggregate?: Maybe<Room_Aggregate_Fields>;
  nodes: Array<Room>;
};

/** aggregate fields of "room" */
export type Room_Aggregate_Fields = {
  __typename?: 'room_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Room_Max_Fields>;
  min?: Maybe<Room_Min_Fields>;
};


/** aggregate fields of "room" */
export type Room_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Room_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "room". All fields are combined with a logical 'AND'. */
export type Room_Bool_Exp = {
  _and?: InputMaybe<Array<Room_Bool_Exp>>;
  _not?: InputMaybe<Room_Bool_Exp>;
  _or?: InputMaybe<Array<Room_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  intro?: InputMaybe<String_Comparison_Exp>;
  invite_code?: InputMaybe<String_Comparison_Exp>;
  messages?: InputMaybe<Message_Bool_Exp>;
  messages_aggregate?: InputMaybe<Message_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  user_rooms?: InputMaybe<User_Room_Bool_Exp>;
  user_rooms_aggregate?: InputMaybe<User_Room_Aggregate_Bool_Exp>;
  uuid?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "room" */
export enum Room_Constraint {
  /** unique or primary key constraint on columns "invite_code" */
  RoomInviteCodeKey = 'room_invite_code_key',
  /** unique or primary key constraint on columns "name" */
  RoomNameKey = 'room_name_key',
  /** unique or primary key constraint on columns "uuid" */
  RoomPkey = 'room_pkey'
}

/** input type for inserting data into table "room" */
export type Room_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  invite_code?: InputMaybe<Scalars['String']['input']>;
  messages?: InputMaybe<Message_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']['input']>;
  user_rooms?: InputMaybe<User_Room_Arr_Rel_Insert_Input>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Room_Max_Fields = {
  __typename?: 'room_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  invite_code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Room_Min_Fields = {
  __typename?: 'room_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  invite_code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "room" */
export type Room_Mutation_Response = {
  __typename?: 'room_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Room>;
};

/** input type for inserting object relation for remote table "room" */
export type Room_Obj_Rel_Insert_Input = {
  data: Room_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Room_On_Conflict>;
};

/** on_conflict condition type for table "room" */
export type Room_On_Conflict = {
  constraint: Room_Constraint;
  update_columns?: Array<Room_Update_Column>;
  where?: InputMaybe<Room_Bool_Exp>;
};

/** Ordering options when selecting data from "room". */
export type Room_Order_By = {
  created_at?: InputMaybe<Order_By>;
  intro?: InputMaybe<Order_By>;
  invite_code?: InputMaybe<Order_By>;
  messages_aggregate?: InputMaybe<Message_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  user_rooms_aggregate?: InputMaybe<User_Room_Aggregate_Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: room */
export type Room_Pk_Columns_Input = {
  uuid: Scalars['uuid']['input'];
};

/** select columns of table "room" */
export enum Room_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Intro = 'intro',
  /** column name */
  InviteCode = 'invite_code',
  /** column name */
  Name = 'name',
  /** column name */
  Uuid = 'uuid'
}

/** input type for updating data in table "room" */
export type Room_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  invite_code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "room" */
export type Room_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Room_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Room_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  invite_code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "room" */
export enum Room_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Intro = 'intro',
  /** column name */
  InviteCode = 'invite_code',
  /** column name */
  Name = 'name',
  /** column name */
  Uuid = 'uuid'
}

export type Room_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Room_Set_Input>;
  /** filter the rows which have to be updated */
  where: Room_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table in a streaming manner: "message" */
  message_stream: Array<Message>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table in a streaming manner: "room" */
  room_stream: Array<Room>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_room" */
  user_room: Array<User_Room>;
  /** fetch aggregated fields from the table: "user_room" */
  user_room_aggregate: User_Room_Aggregate;
  /** fetch data from the table: "user_room" using primary key columns */
  user_room_by_pk?: Maybe<User_Room>;
  /** fetch data from the table in a streaming manner: "user_room" */
  user_room_stream: Array<User_Room>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
};


export type Subscription_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessage_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Subscription_RootMessage_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Message_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootRoomArgs = {
  distinct_on?: InputMaybe<Array<Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Room_Order_By>>;
  where?: InputMaybe<Room_Bool_Exp>;
};


export type Subscription_RootRoom_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Room_Order_By>>;
  where?: InputMaybe<Room_Bool_Exp>;
};


export type Subscription_RootRoom_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Subscription_RootRoom_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Room_Stream_Cursor_Input>>;
  where?: InputMaybe<Room_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  uuid: Scalars['uuid']['input'];
};


export type Subscription_RootUser_RoomArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


export type Subscription_RootUser_Room_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


export type Subscription_RootUser_Room_By_PkArgs = {
  room_uuid: Scalars['uuid']['input'];
  user_uuid: Scalars['uuid']['input'];
};


export type Subscription_RootUser_Room_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Room_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregate relationship */
  messages_aggregate: Message_Aggregate;
  password: Scalars['String']['output'];
  /** An array relationship */
  user_rooms: Array<User_Room>;
  /** An aggregate relationship */
  user_rooms_aggregate: User_Room_Aggregate;
  username: Scalars['String']['output'];
  uuid: Scalars['uuid']['output'];
};


/** columns and relationships of "user" */
export type UserMessagesArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserMessages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUser_RoomsArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUser_Rooms_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Room_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Room_Order_By>>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  messages?: InputMaybe<Message_Bool_Exp>;
  messages_aggregate?: InputMaybe<Message_Aggregate_Bool_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  user_rooms?: InputMaybe<User_Room_Bool_Exp>;
  user_rooms_aggregate?: InputMaybe<User_Room_Aggregate_Bool_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
  uuid?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint on columns "uuid" */
  UserPkey = 'user_pkey',
  /** unique or primary key constraint on columns "username" */
  UserUsernameKey = 'user_username_key'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  messages?: InputMaybe<Message_Arr_Rel_Insert_Input>;
  password?: InputMaybe<Scalars['String']['input']>;
  user_rooms?: InputMaybe<User_Room_Arr_Rel_Insert_Input>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  messages_aggregate?: InputMaybe<Message_Aggregate_Order_By>;
  password?: InputMaybe<Order_By>;
  user_rooms_aggregate?: InputMaybe<User_Room_Aggregate_Order_By>;
  username?: InputMaybe<Order_By>;
  uuid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  uuid: Scalars['uuid']['input'];
};

/** columns and relationships of "user_room" */
export type User_Room = {
  __typename?: 'user_room';
  /** An object relationship */
  room: Room;
  room_uuid: Scalars['uuid']['output'];
  /** An object relationship */
  user: User;
  user_uuid: Scalars['uuid']['output'];
};

/** aggregated selection of "user_room" */
export type User_Room_Aggregate = {
  __typename?: 'user_room_aggregate';
  aggregate?: Maybe<User_Room_Aggregate_Fields>;
  nodes: Array<User_Room>;
};

export type User_Room_Aggregate_Bool_Exp = {
  count?: InputMaybe<User_Room_Aggregate_Bool_Exp_Count>;
};

export type User_Room_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<User_Room_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<User_Room_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "user_room" */
export type User_Room_Aggregate_Fields = {
  __typename?: 'user_room_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Room_Max_Fields>;
  min?: Maybe<User_Room_Min_Fields>;
};


/** aggregate fields of "user_room" */
export type User_Room_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Room_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_room" */
export type User_Room_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Room_Max_Order_By>;
  min?: InputMaybe<User_Room_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_room" */
export type User_Room_Arr_Rel_Insert_Input = {
  data: Array<User_Room_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Room_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_room". All fields are combined with a logical 'AND'. */
export type User_Room_Bool_Exp = {
  _and?: InputMaybe<Array<User_Room_Bool_Exp>>;
  _not?: InputMaybe<User_Room_Bool_Exp>;
  _or?: InputMaybe<Array<User_Room_Bool_Exp>>;
  room?: InputMaybe<Room_Bool_Exp>;
  room_uuid?: InputMaybe<Uuid_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  user_uuid?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_room" */
export enum User_Room_Constraint {
  /** unique or primary key constraint on columns "user_uuid", "room_uuid" */
  UserRoomPkey = 'user_room_pkey'
}

/** input type for inserting data into table "user_room" */
export type User_Room_Insert_Input = {
  room?: InputMaybe<Room_Obj_Rel_Insert_Input>;
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type User_Room_Max_Fields = {
  __typename?: 'user_room_max_fields';
  room_uuid?: Maybe<Scalars['uuid']['output']>;
  user_uuid?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "user_room" */
export type User_Room_Max_Order_By = {
  room_uuid?: InputMaybe<Order_By>;
  user_uuid?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Room_Min_Fields = {
  __typename?: 'user_room_min_fields';
  room_uuid?: Maybe<Scalars['uuid']['output']>;
  user_uuid?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "user_room" */
export type User_Room_Min_Order_By = {
  room_uuid?: InputMaybe<Order_By>;
  user_uuid?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_room" */
export type User_Room_Mutation_Response = {
  __typename?: 'user_room_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Room>;
};

/** on_conflict condition type for table "user_room" */
export type User_Room_On_Conflict = {
  constraint: User_Room_Constraint;
  update_columns?: Array<User_Room_Update_Column>;
  where?: InputMaybe<User_Room_Bool_Exp>;
};

/** Ordering options when selecting data from "user_room". */
export type User_Room_Order_By = {
  room?: InputMaybe<Room_Order_By>;
  room_uuid?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  user_uuid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_room */
export type User_Room_Pk_Columns_Input = {
  room_uuid: Scalars['uuid']['input'];
  user_uuid: Scalars['uuid']['input'];
};

/** select columns of table "user_room" */
export enum User_Room_Select_Column {
  /** column name */
  RoomUuid = 'room_uuid',
  /** column name */
  UserUuid = 'user_uuid'
}

/** input type for updating data in table "user_room" */
export type User_Room_Set_Input = {
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_room" */
export type User_Room_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Room_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Room_Stream_Cursor_Value_Input = {
  room_uuid?: InputMaybe<Scalars['uuid']['input']>;
  user_uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_room" */
export enum User_Room_Update_Column {
  /** column name */
  RoomUuid = 'room_uuid',
  /** column name */
  UserUuid = 'user_uuid'
}

export type User_Room_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Room_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Room_Bool_Exp;
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  Password = 'password',
  /** column name */
  Username = 'username',
  /** column name */
  Uuid = 'uuid'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  Password = 'password',
  /** column name */
  Username = 'username',
  /** column name */
  Uuid = 'uuid'
}

export type User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type AddMessageMutationVariables = Exact<{
  user_uuid: Scalars['uuid']['input'];
  room_uuid: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
}>;


export type AddMessageMutation = { __typename?: 'mutation_root', insert_message_one?: { __typename?: 'message', uuid: any } | null };

export type GetMessagesByRoomSubscriptionVariables = Exact<{
  room_uuid: Scalars['uuid']['input'];
}>;


export type GetMessagesByRoomSubscription = { __typename?: 'subscription_root', message: Array<{ __typename?: 'message', uuid: any, content: string, created_at: any, user: { __typename?: 'user', uuid: any, username: string } }> };

export type AddRoomMutationVariables = Exact<{
  name: Scalars['String']['input'];
  intro: Scalars['String']['input'];
  invite_code: Scalars['String']['input'];
}>;


export type AddRoomMutation = { __typename?: 'mutation_root', insert_room_one?: { __typename?: 'room', uuid: any } | null };

export type GetJoinedRoomsQueryVariables = Exact<{
  user_uuid: Scalars['uuid']['input'];
}>;


export type GetJoinedRoomsQuery = { __typename?: 'query_root', user_room: Array<{ __typename?: 'user_room', room: { __typename?: 'room', uuid: any, name: string, intro: string, invite_code: string, created_at: any } }> };

export type GetRoomByInviteCodeQueryVariables = Exact<{
  invite_code: Scalars['String']['input'];
}>;


export type GetRoomByInviteCodeQuery = { __typename?: 'query_root', room: Array<{ __typename?: 'room', uuid: any }> };

export type JoinRoomMutationVariables = Exact<{
  user_uuid: Scalars['uuid']['input'];
  room_uuid: Scalars['uuid']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'mutation_root', insert_user_room_one?: { __typename?: 'user_room', user_uuid: any, room_uuid: any } | null };

export type AddUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AddUserMutation = { __typename?: 'mutation_root', insert_user_one?: { __typename?: 'user', uuid: any } | null };

export type GetUsersByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUsersByUsernameQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', uuid: any, password: string }> };


export const AddMessageDocument = gql`
    mutation addMessage($user_uuid: uuid!, $room_uuid: uuid!, $content: String!) {
  insert_message_one(
    object: {user_uuid: $user_uuid, room_uuid: $room_uuid, content: $content}
  ) {
    uuid
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      user_uuid: // value for 'user_uuid'
 *      room_uuid: // value for 'room_uuid'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const GetMessagesByRoomDocument = gql`
    subscription getMessagesByRoom($room_uuid: uuid!) {
  message(where: {room_uuid: {_eq: $room_uuid}}) {
    uuid
    user {
      uuid
      username
    }
    content
    created_at
  }
}
    `;

/**
 * __useGetMessagesByRoomSubscription__
 *
 * To run a query within a React component, call `useGetMessagesByRoomSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByRoomSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByRoomSubscription({
 *   variables: {
 *      room_uuid: // value for 'room_uuid'
 *   },
 * });
 */
export function useGetMessagesByRoomSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetMessagesByRoomSubscription, GetMessagesByRoomSubscriptionVariables> & ({ variables: GetMessagesByRoomSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetMessagesByRoomSubscription, GetMessagesByRoomSubscriptionVariables>(GetMessagesByRoomDocument, options);
      }
export type GetMessagesByRoomSubscriptionHookResult = ReturnType<typeof useGetMessagesByRoomSubscription>;
export type GetMessagesByRoomSubscriptionResult = Apollo.SubscriptionResult<GetMessagesByRoomSubscription>;
export const AddRoomDocument = gql`
    mutation addRoom($name: String!, $intro: String!, $invite_code: String!) {
  insert_room_one(object: {name: $name, intro: $intro, invite_code: $invite_code}) {
    uuid
  }
}
    `;
export type AddRoomMutationFn = Apollo.MutationFunction<AddRoomMutation, AddRoomMutationVariables>;

/**
 * __useAddRoomMutation__
 *
 * To run a mutation, you first call `useAddRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRoomMutation, { data, loading, error }] = useAddRoomMutation({
 *   variables: {
 *      name: // value for 'name'
 *      intro: // value for 'intro'
 *      invite_code: // value for 'invite_code'
 *   },
 * });
 */
export function useAddRoomMutation(baseOptions?: Apollo.MutationHookOptions<AddRoomMutation, AddRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddRoomMutation, AddRoomMutationVariables>(AddRoomDocument, options);
      }
export type AddRoomMutationHookResult = ReturnType<typeof useAddRoomMutation>;
export type AddRoomMutationResult = Apollo.MutationResult<AddRoomMutation>;
export type AddRoomMutationOptions = Apollo.BaseMutationOptions<AddRoomMutation, AddRoomMutationVariables>;
export const GetJoinedRoomsDocument = gql`
    query getJoinedRooms($user_uuid: uuid!) {
  user_room(where: {user_uuid: {_eq: $user_uuid}}) {
    room {
      uuid
      name
      intro
      invite_code
      created_at
    }
  }
}
    `;

/**
 * __useGetJoinedRoomsQuery__
 *
 * To run a query within a React component, call `useGetJoinedRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJoinedRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJoinedRoomsQuery({
 *   variables: {
 *      user_uuid: // value for 'user_uuid'
 *   },
 * });
 */
export function useGetJoinedRoomsQuery(baseOptions: Apollo.QueryHookOptions<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables> & ({ variables: GetJoinedRoomsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>(GetJoinedRoomsDocument, options);
      }
export function useGetJoinedRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>(GetJoinedRoomsDocument, options);
        }
export function useGetJoinedRoomsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>(GetJoinedRoomsDocument, options);
        }
export type GetJoinedRoomsQueryHookResult = ReturnType<typeof useGetJoinedRoomsQuery>;
export type GetJoinedRoomsLazyQueryHookResult = ReturnType<typeof useGetJoinedRoomsLazyQuery>;
export type GetJoinedRoomsSuspenseQueryHookResult = ReturnType<typeof useGetJoinedRoomsSuspenseQuery>;
export type GetJoinedRoomsQueryResult = Apollo.QueryResult<GetJoinedRoomsQuery, GetJoinedRoomsQueryVariables>;
export const GetRoomByInviteCodeDocument = gql`
    query getRoomByInviteCode($invite_code: String!) {
  room(where: {invite_code: {_eq: $invite_code}}) {
    uuid
  }
}
    `;

/**
 * __useGetRoomByInviteCodeQuery__
 *
 * To run a query within a React component, call `useGetRoomByInviteCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomByInviteCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomByInviteCodeQuery({
 *   variables: {
 *      invite_code: // value for 'invite_code'
 *   },
 * });
 */
export function useGetRoomByInviteCodeQuery(baseOptions: Apollo.QueryHookOptions<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables> & ({ variables: GetRoomByInviteCodeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>(GetRoomByInviteCodeDocument, options);
      }
export function useGetRoomByInviteCodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>(GetRoomByInviteCodeDocument, options);
        }
export function useGetRoomByInviteCodeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>(GetRoomByInviteCodeDocument, options);
        }
export type GetRoomByInviteCodeQueryHookResult = ReturnType<typeof useGetRoomByInviteCodeQuery>;
export type GetRoomByInviteCodeLazyQueryHookResult = ReturnType<typeof useGetRoomByInviteCodeLazyQuery>;
export type GetRoomByInviteCodeSuspenseQueryHookResult = ReturnType<typeof useGetRoomByInviteCodeSuspenseQuery>;
export type GetRoomByInviteCodeQueryResult = Apollo.QueryResult<GetRoomByInviteCodeQuery, GetRoomByInviteCodeQueryVariables>;
export const JoinRoomDocument = gql`
    mutation joinRoom($user_uuid: uuid!, $room_uuid: uuid!) {
  insert_user_room_one(object: {user_uuid: $user_uuid, room_uuid: $room_uuid}) {
    user_uuid
    room_uuid
  }
}
    `;
export type JoinRoomMutationFn = Apollo.MutationFunction<JoinRoomMutation, JoinRoomMutationVariables>;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      user_uuid: // value for 'user_uuid'
 *      room_uuid: // value for 'room_uuid'
 *   },
 * });
 */
export function useJoinRoomMutation(baseOptions?: Apollo.MutationHookOptions<JoinRoomMutation, JoinRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(JoinRoomDocument, options);
      }
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult = Apollo.MutationResult<JoinRoomMutation>;
export type JoinRoomMutationOptions = Apollo.BaseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables>;
export const AddUserDocument = gql`
    mutation addUser($username: String!, $password: String!) {
  insert_user_one(object: {username: $username, password: $password}) {
    uuid
  }
}
    `;
export type AddUserMutationFn = Apollo.MutationFunction<AddUserMutation, AddUserMutationVariables>;

/**
 * __useAddUserMutation__
 *
 * To run a mutation, you first call `useAddUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserMutation, { data, loading, error }] = useAddUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAddUserMutation(baseOptions?: Apollo.MutationHookOptions<AddUserMutation, AddUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, options);
      }
export type AddUserMutationHookResult = ReturnType<typeof useAddUserMutation>;
export type AddUserMutationResult = Apollo.MutationResult<AddUserMutation>;
export type AddUserMutationOptions = Apollo.BaseMutationOptions<AddUserMutation, AddUserMutationVariables>;
export const GetUsersByUsernameDocument = gql`
    query getUsersByUsername($username: String!) {
  user(where: {username: {_eq: $username}}) {
    uuid
    password
  }
}
    `;

/**
 * __useGetUsersByUsernameQuery__
 *
 * To run a query within a React component, call `useGetUsersByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUsersByUsernameQuery(baseOptions: Apollo.QueryHookOptions<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables> & ({ variables: GetUsersByUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>(GetUsersByUsernameDocument, options);
      }
export function useGetUsersByUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>(GetUsersByUsernameDocument, options);
        }
export function useGetUsersByUsernameSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>(GetUsersByUsernameDocument, options);
        }
export type GetUsersByUsernameQueryHookResult = ReturnType<typeof useGetUsersByUsernameQuery>;
export type GetUsersByUsernameLazyQueryHookResult = ReturnType<typeof useGetUsersByUsernameLazyQuery>;
export type GetUsersByUsernameSuspenseQueryHookResult = ReturnType<typeof useGetUsersByUsernameSuspenseQuery>;
export type GetUsersByUsernameQueryResult = Apollo.QueryResult<GetUsersByUsernameQuery, GetUsersByUsernameQueryVariables>;