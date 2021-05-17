import { gql } from '@apollo/client';

export const GET_MY_ROOM_LIST = gql`
  query getMyRoomList($userId: ID!) {
    getMyRoomList(userId: $userId) {
      _id
      name
      userNum
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

export const GET_CHAT_LIST = gql`
  query getChatList($roomId: ID!) {
    getChatList(roomId: $roomId) {
      _id
      user {
        _id
        nickname
        profileThumbnailImageURL
      }
      isSystem
      content
      fileType
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
