import React, { useState } from "react";
import {} from "react-native";

export const Context = React.createContext();

export default Provider = (props) => {
  const [config, updateConfig] = useState({
    host: "http://localhost:5000",
    token: null,
  });

  return (
    <Context.Provider value={{ config, updateConfig }}>
      {props.children}
    </Context.Provider>
  );
};
