import React, { useEffect, useContext } from "react";
import { Text } from "react-native";
// import WebRTC from "../contexts/WebRTC";

function VideoChat({ route, navigation }) {
  const { firstParam } = route.params;

  // const WebRTCStuff = useContext(WebRTC)

  useEffect(() => {
    // console.log(WebRTCStuff.test);
  }, []);

  return <Text>VideoChat screen {JSON.stringify(firstParam)}</Text>;
}

export default VideoChat;
