import {gql} from '@apollo/client';

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
      recentMessageContent
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput: $createRoomInput) {
      _id
      name
      userNum
      recentMessageContent
    }
  }
`;

export const UPDATE_USER_ADD_ROOM = gql`
  mutation updateUserAddRoom($updateUserAddRoomInput: UpdateUserAddRoomInput!) {
    updateUserAddRoom(updateUserAddRoomInput: $updateUserAddRoomInput) {
      _id
      name
      userNum
      recentMessageContent
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
      name
      userNum
      recentMessageContent
    }
  }
`;

export const GET_CHAT_LIST = gql`
  query getChatList($roomId: ID!, $lastId: ID, $size: Int!) {
    getChatList(roomId: $roomId, lastId: $lastId, size: $size) {
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
      fileName
      isArchived
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
  subscription ($roomId: ID!) {
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
      fileName
      createdAt
    }
  }
`;

export const ARCHIVE_CHAT = gql`
  mutation archiveChat($archiveChatInput: ArchiveChatInput!) {
    archiveChat(archiveChatInput: $archiveChatInput) {
      _id
    }
  }
`;
