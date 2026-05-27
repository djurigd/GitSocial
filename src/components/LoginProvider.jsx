import { useState } from 'react';
import { LoginContext } from './LoginContext'

function LoginProvider({ children }) {
  const [username, setUsername] = useState("");

  function handleAuth(user) {
    setUsername(user);
  }

  return(
    <LoginContext.Provider value={{ username, handleAuth }} >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;