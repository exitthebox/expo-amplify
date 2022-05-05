import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";

import tw from "twrnc";

const { width } = Dimensions.get("window");

const Home = () => {
  const [user, setUser] = useState({});

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome! {user.username}</Text>

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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
export default Home;
