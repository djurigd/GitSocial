import { createContext, useContext } from "react";

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);