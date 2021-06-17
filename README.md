# **이슈**

### **이슈1**

- @react-native-seoul/kakao-login을 설치하면 빌드 에러가남.

```jsx
ndefined symbols for architecture x86_64:
"Swift._ArrayBuffer._copyContents(initializing: Swift.UnsafeMutableBufferPointer<A>) -> (Swift.IndexingIterator<Swift._ArrayBuffer<A>>, Swift.Int)", referenced from:
generic specialization <serialized, Swift._ArrayBuffer<Swift.Int8>> of Swift._copyCollectionToContiguousArray<A where A: Swift.Collection>(A) -> Swift.ContiguousArray<A.Element> in libAlamofire.a(NetworkReachabilityManager.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

- 패키지 문제가 아니라 특정 패키지를 다운받아서 사용할 때 생기는 Xcode 12.5 버그임.
- 다음과 같은 방법을 이용하여 해결함 (진짜 해결 방법인지는 아직 확인 안되는데, 아직은 이 방법 뿐임).

[https://github.com/react-native-seoul/react-native-kakao-login/issues/230](https://github.com/react-native-seoul/react-native-kakao-login/issues/230)

[https://github.com/facebook/react-native/issues/31179#issuecomment-829568297](https://github.com/facebook/react-native/issues/31179#issuecomment-829568297)