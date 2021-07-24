# **Prettier Eslint 세팅**

### **세팅 과정**

1. Extension 설치

- Prettier, Eslint extension 설치함.

2. VS Code 설정

- Ctrl + Shift + p 입력함.
- Preferences: Open Settings (JSON) 입력함.
- settings.json 다음과 같이 수정함.

```jsx
{
  // Set the default
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.fontSize": 14,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
}
```

3. VS Code 재시작

### **Prettier Eslint와 관련된 package.json 설정**

- package.json에는 eslint-config-prettier가 설치되어 있어야함. eslint와 prettier 충돌을 막기 위해 설치함.
- package.json에는 prettier가 설치되어 있어야함. yarn pretty 스크립트를 실행하기 위함.

# **이슈**

### **이슈1**

- Xcode에서 release 빌드 시 빌드 에러가남.
- 새로운 프로젝트에서는 안났는데, 기존 프로젝트 사용할때 발생함.
- Xcode에서 warning다 없애고 빌드하니 에러가 발생하지 않음.

### **이슈2**

- @react-native-seoul/kakao-login 패키지를 설치하면 빌드 에러가남.

```jsx
ndefined symbols for architecture x86_64:
"Swift._ArrayBuffer._copyContents(initializing: Swift.UnsafeMutableBufferPointer<A>) -> (Swift.IndexingIterator<Swift._ArrayBuffer<A>>, Swift.Int)", referenced from:
generic specialization <serialized, Swift._ArrayBuffer<Swift.Int8>> of Swift._copyCollectionToContiguousArray<A where A: Swift.Collection>(A) -> Swift.ContiguousArray<A.Element> in libAlamofire.a(NetworkReachabilityManager.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

- 패키지 문제가 아니라 특정 패키지를 다운받아서 사용할 때 생기는 Xcode 12.5 버그임.
- ios/client_app.xcodeproj/project.pbxproj 파일의 특정 코드를 해결함.(진짜 해결 방법인지는 아직 확인 안되는데, 아직은 이 방법 뿐임).

[https://github.com/react-native-seoul/react-native-kakao-login/issues/230](https://github.com/react-native-seoul/react-native-kakao-login/issues/230)

[https://github.com/facebook/react-native/issues/31179#issuecomment-829568297](https://github.com/facebook/react-native/issues/31179#issuecomment-829568297)

### **이슈3**

- react-native-nmap 패키지를 설치하면 빌드 에러가남.

```jsx
Undefined symbols for architecture x86_64:
  "_OBJC_CLASS_$_NMFCameraPosition", referenced from:
      objc-class-ref in libreact-native-nmap.a(RCTConvert+NMFMapView.o)
  "_OBJC_METACLASS_$_NMFNaverMapView", referenced from:
      _OBJC_METACLASS_$_RNNaverMapView in libreact-native-nmap.a(RNNaverMapView.o)
  "_OBJC_CLASS_$_NMFAlignType", referenced from:
      objc-class-ref in libreact-native-nmap.a(RCTConvert+NMFMapView.o)
  "_OBJC_CLASS_$_NMFPolygonOverlay", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPolygonOverlay.o)
  "_OBJC_CLASS_$_NMFPolylineOverlay", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPolylineOverlay.o)
  "_OBJC_CLASS_$_NMGLatLng", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapCircleOverlay.o)
      objc-class-ref in libreact-native-nmap.a(RCTConvert+NMFMapView.o)
  "_OBJC_CLASS_$_NMFCircleOverlay", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapCircleOverlay.o)
  "_OBJC_CLASS_$_NMFNaverMapView", referenced from:
      _OBJC_CLASS_$_RNNaverMapView in libreact-native-nmap.a(RNNaverMapView.o)
  "_OBJC_CLASS_$_NMGPolygon", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPolygonOverlay.o)
  "_OBJC_CLASS_$_NMGLatLngBounds", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapViewManager.o)
      objc-class-ref in libreact-native-nmap.a(RCTConvert+NMFMapView.o)
  "_NMF_LAYER_GROUP_TRAFFIC", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_NMF_LAYER_GROUP_BICYCLE", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_NMF_LAYER_GROUP_CADASTRAL", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_NMF_LAYER_GROUP_BUILDING", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_NMF_LAYER_GROUP_MOUNTAIN", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_OBJC_CLASS_$_NMFCameraUpdate", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapViewManager.o)
      objc-class-ref in libreact-native-nmap.a(RCTConvert+NMFMapView.o)
  "_OBJC_CLASS_$_NMFOverlayImage", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapMarker.o)
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPathOverlay.o)
  "_OBJC_CLASS_$_NMGLineString", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPathOverlay.o)
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPolylineOverlay.o)
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPolygonOverlayManager.o)
  "_OBJC_CLASS_$_NMFPath", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapPathOverlay.o)
  "_NMF_LAYER_GROUP_TRANSIT", referenced from:
      ___68-[RNNaverMapViewManager setLayerGroupEnabled:withGroup:withEnabled:]_block_invoke in libreact-native-nmap.a(RNNaverMapViewManager.o)
  "_OBJC_CLASS_$_NMFMarker", referenced from:
      objc-class-ref in libreact-native-nmap.a(RNNaverMapMarker.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

- 패키지 문제가 아니라 패키지를 사용할 때 pod로 NMapsMap를 설치하는데, NMapsMap 특정 버전에 버그가 있는 듯함.
- ios/Podfile에 NMapsMap 버전을 명시하여 해결함.

[https://github.com/navermaps/ios-map-sdk#%EB%8C%80%EC%9A%A9%EB%9F%89-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EB%B0%9B%EA%B8%B0-%EC%9C%84%ED%95%B4-git-lfs-%EC%84%A4%EC%B9%98%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4](https://github.com/navermaps/ios-map-sdk#%EB%8C%80%EC%9A%A9%EB%9F%89-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EB%B0%9B%EA%B8%B0-%EC%9C%84%ED%95%B4-git-lfs-%EC%84%A4%EC%B9%98%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4)

[https://github.com/QuadFlask/react-native-naver-map/issues/42#issuecomment-749524390](https://github.com/QuadFlask/react-native-naver-map/issues/42#issuecomment-749524390)

### **이슈4**

- react-native-paper 패키지의 Dialog를 사용할 때 Keyboard가 Dialog를 가림. 하지만 Dialog와 KeyboardAvoidingView와 함께 쓸 수 없음.
- Android는 알아서 처리해주는데 IOS의 경우 처리를 해줘야함.
- react-native-paper에서는 따로 개선을 해주고 있지 않는 상황이라 우선 Dialog의 위치를 옮겨 해결함.

[https://github.com/callstack/react-native-paper/issues/2172#issuecomment-725769818](https://github.com/callstack/react-native-paper/issues/2172#issuecomment-725769818)

# **참고 웹사이트**

### **App Icon, Image 생성**

[https://appicon.co/](https://appicon.co/)

### **개인정보 처리방침 생성**

[https://www.privacy.go.kr/a3sc/per/inf/perInfStep01.do](https://www.privacy.go.kr/a3sc/per/inf/perInfStep01.do)

### **사용자 이용 약관**

[https://ftc.go.kr/solution/skin/doc.html?fn=6e43130ccee6f1a2611c5f4e85877cde2d4b54a754404ed2045a05309310db98&rs=/fileupload/data/result/BBSMSTR_000000002320](https://ftc.go.kr/solution/skin/doc.html?fn=6e43130ccee6f1a2611c5f4e85877cde2d4b54a754404ed2045a05309310db98&rs=/fileupload/data/result/BBSMSTR_000000002320)

### **ios 스크린샷 사양**

[https://help.apple.com/app-store-connect/#/devd274dd925](https://help.apple.com/app-store-connect/#/devd274dd925)
