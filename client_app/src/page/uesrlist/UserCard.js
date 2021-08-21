import React, {useState} from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {REACT_APP_STORAGE_URL, REACT_APP_STORAGE_RESIZED_URL} from '@env';
import invalidImage from 'src/res/img/invalid_image.png';
const styles = StyleSheet.create({
  root: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    marginLeft: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
const UserCard = ({navigation, user}) => {
  const [sourceIdx, setSourceIdx] = useState(0);
  const sourceList = [
    REACT_APP_STORAGE_RESIZED_URL + user?.profileImageURL,
    REACT_APP_STORAGE_URL + user?.profileImageURL,
    Image.resolveAssetSource(invalidImage).uri,
  ];
  const onPress = () => {
    navigation.navigate('user', {
      userId: user._id,
    });
  };
  const onError = () => {
    setSourceIdx(prev => prev + 1);
  };
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Image
        style={styles.avatar}
        source={{uri: sourceList[sourceIdx]}}
        onError={onError}
      />
      <Text style={styles.nickname}>{user?.nickname}</Text>
    </TouchableOpacity>
  );
};
export default React.memo(UserCard);
