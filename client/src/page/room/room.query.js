import { gql } from '@apollo/client';

export const GET_MY_ROOM_LIST = gql`
  query getMyRoomList($userId: ID!) {
    getMyRoomList(userId: $userId) {
      _id
      name
      userNum
      recentMessageContent
    }
  }
`;

export const GET_ROOM_LIST = gql`
  query getRoomList($userId: ID!) {
    getRoomList(userId: $userId) {
      _id
      name
      userNum
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput: $createRoomInput) {
      _id
    }
  }
`;

export const UPDATE_USER_ADD_ROOM = gql`
  mutation updateUserAddRoom($updateUserAddRoomInput: UpdateUserAddRoomInput!) {
    updateUserAddRoom(updateUserAddRoomInput: $updateUserAddRoomInput) {
      _id
    }
  }
`;

export const UPDATE_USER_REMOVE_ROOM = gql`
  mutation updateUserRemoveRoom(
    $updateUserRemoveRoomInput: UpdateUserRemoveRoomInput!
  ) {
    updateUserRemoveRoom(
      updateUserRemoveRoomInput: $updateUserRemoveRoomInput
    ) {
      _id
    }
  }
`;

export const GET_CHAT_LIST = gql`
  query getChatList($roomId: ID!, $skip: Int!, $size: Int!) {
    getChatList(roomId: $roomId, skip: $skip, size: $size) {
      _id
      user {
        _id
        nickname
        profileThumbnailImageURL
      }
      isSystem
      content
      imageURL
      thumbnailImageURL
      fileURL
      createdAt
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation createChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      _id
    }
  }
`;

export const CHAT_CREATED = gql`
  subscription($roomId: ID!) {
    chatCreated(roomId: $roomId) {
      _id
      user {
        _id
        nickname
        profileThumbnailImageURL
      }
      isSystem
      content
      imageURL
      thumbnailImageURL
      fileURL
      createdAt
    }
  }
`;
