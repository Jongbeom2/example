import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import PopupImage from 'src/component/PopupImage';
const styles = StyleSheet.create({
  root: {
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
const ChatCardImage = ({
  sourceList = [],
  imageWidth = 200,
  onLongPress,
  ...rest
}) => {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const onLoad = () => {
    Image.getSize(sourceList[sourceIdx], (width, height) => {
      setImageHeight((imageWidth * height) / width);
    });
  };
  const onError = () => {
    setSourceIdx(prev => prev + 1);
  };
  const onPress = () => {
    setOpen(true);
  };
  return (
    <>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <Image
          style={[{height: imageHeight, width: imageWidth}, styles.root]}
          source={{uri: sourceList[sourceIdx]}}
          onLoad={onLoad}
          onError={onError}
          {...rest}
        />
      </TouchableOpacity>
      <PopupImage
        sourceList={sourceList.slice(1)}
        visible={open}
        onDismiss={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
export default React.memo(ChatCardImage);
