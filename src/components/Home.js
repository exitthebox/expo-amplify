import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Button,
  Platform,
} from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";

import tw from "twrnc";

const { width } = Dimensions.get("window");

const Home = () => {
  const [user, setUser] = useState({});
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();

    const meUser = {
      id: attributes.sub,
      email: attributes.email,
      birthdate: attributes.birthdate,
      name: attributes.name,
      locale: attributes.locale,
    };
    // console.log(attributes);

    registerForPushNotificationsAsync()
      .then((token) => {
        // console.log("token: ", token);
        Object.assign(meUser, { expoToken: token });
        console.log(meUser);
        setExpoPushToken(token);
      })
      .catch((error) => console.log(error));

    Auth.currentAuthenticatedUser()
      .then(async (cognitoUser) => {
        meUser.username = cognitoUser.username;
        console.log("meUser", meUser);

        const isUser = await API.graphql({
          query: queries.getAppUser,
          variables: { id: meUser.id },
        });
        if (isUser.data.getAppUser !== null) {
          console.log("AppUser not null");
        } else {
          console.log("AppUser null");
          const newUser = await API.graphql(
            graphqlOperation(mutations.createAppUser, { input: meUser })
          );
          console.log("new user added", meUser.id);
        }
        setUser(meUser);

        // const newTodo = await API.graphql({
        //   query: mutations.createTodo,
        //   variables: { input: todoDetails },
        // });
      })
      .catch((error) => console.log(error));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const todoDetails = {
    name: "Todo 1 test",
    description: "Learn AWS appsync",
  };

  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const happyBirthdayConnect = async () => {
    // function to choose random user with a birthday

    // grab all the users with that birthday

    // put them into a numbered array

    // find random number

    // pull the user with that random number

    // send a push notification to them to connect

    // connect via video

    try {
      console.log("happy birthday");
    } catch (error) {
      console.error(error);
    }
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome! {user.username}</Text>
        <Pressable style={styles.button} onPress={() => happyBirthdayConnect()}>
          <Text style={styles.buttonText}>Happy Birthday</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>

        <Text style={tw.style("text-lg", "bg-blue-100")}>
          Tailwind Hello world!{"\n"}Tailwind Hello world!
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    paddingVertical: 20,
  },
  header: {
    // display: "flex",
    // flexDirection: "row",
    // justifyContent: "space-between",
    padding: 20,
    width: width,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    // padding: 20,
    // margin: 20,
  },
  button: {
    backgroundColor: "#ff9900",
    padding: 10,
    borderRadius: 6,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
export default Home;
