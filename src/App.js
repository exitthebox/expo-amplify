import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { withAuthenticator, Authenticator } from "aws-amplify-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import config from "./aws-exports";
import Home from "./components/Home";
import VideoChat from "./components/VideoChat";

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="VideoChat" component={VideoChat} />
      </Stack.Navigator>
      {/* <View style={styles.container}>
        <Home />
        <StatusBar style="auto" />
      </View> */}
    </NavigationContainer>
  );
}

const signUpConfig = {
  header: "My birthday app sign up",
  hideAllDefaults: true,
  defaultCountryCode: "1",
  signUpFields: [
    {
      label: "Birthday",
      key: "birthdate",
      required: true,
      displayOrder: 1,
      type: "date",
    },
    {
      label: "First Name",
      key: "name",
      required: true,
      displayOrder: 2,
      type: "string",
    },
    {
      label: "Country",
      key: "locale",
      required: true,
      displayOrder: 3,
      type: "string",
    },
    {
      label: "User name",
      key: "username",
      required: true,
      displayOrder: 4,
      type: "string",
    },
    {
      label: "Email",
      key: "email",
      required: true,
      displayOrder: 5,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 6,
      type: "password",
    },
  ],
};

const usernameAttributes = "User name";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes,
});
