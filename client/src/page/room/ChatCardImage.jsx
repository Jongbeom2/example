import React, { Suspense } from 'react';
import { useImage } from 'react-image';

function ImageComponent({ srcList, ...rest }) {
  const { src } = useImage({
    srcList,
  });

  return <img src={src} {...rest} />;
}

export default function ChatCardImage({ srcList, ...rest }) {
  return (
    <Suspense fallback={null}>
      <ImageComponent srcList={srcList} {...rest} />
    </Suspense>
  );
}
