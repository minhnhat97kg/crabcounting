import React, { useState } from "react";
import {} from "react-native";

export const Context = React.createContext();

export default Provider = (props) => {
  const [config, updateConfig] = useState({
    host: "http://b9da9c48bc3b.ngrok.io",
    token: null,
  });

  return (
    <Context.Provider value={{ config, updateConfig }}>
      {props.children}
    </Context.Provider>
  );
};
