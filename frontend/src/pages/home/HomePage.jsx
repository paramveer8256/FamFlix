import React from "react";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import { useAuthUserStore } from "../../store/authUser.js";

const HomePage = () => {
  const { user } = useAuthUserStore(); // Get the user from the store
  return <>{user ? <HomeScreen /> : <AuthScreen />}</>;
};

export default HomePage;
