import { Amplify } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import config from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import Home from "./components/Home";

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withAuthenticator(App);
