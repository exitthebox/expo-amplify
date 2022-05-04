import { Amplify } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import config from "./aws-exports";
import { withAuthenticator, Authenticator } from "aws-amplify-react-native";
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
