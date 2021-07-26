import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Dialog, Portal} from 'react-native-paper';
import {Dimensions} from 'react-native';
const styles = StyleSheet.create({
  root: {},
});
const PopupImage = ({
  visible,
  onDismiss,
  sourceList = [],
  imageWidth = Dimensions.get('window').width * 0.88,
  ...rest
}) => {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const onLoad = () => {
    Image.getSize(sourceList[sourceIdx], (width, height) => {
      setImageHeight((imageWidth * height) / width);
    });
  };
  const onError = () => {
    setSourceIdx(prev => prev + 1);
  };
  const closeDialog = useCallback(() => {
    onDismiss();
  }, [onDismiss]);
  return (
    <Portal style={styles.root}>
      <Dialog visible={visible} onDismiss={closeDialog}>
        <Image
          style={[{height: imageHeight, width: imageWidth}, styles.root]}
          source={{uri: sourceList[sourceIdx]}}
          onLoad={onLoad}
          onError={onError}
          {...rest}
        />
      </Dialog>
    </Portal>
  );
};
export default PopupImage;
