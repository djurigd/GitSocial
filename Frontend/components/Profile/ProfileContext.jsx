import { createContext, useContext } from "react";

// Create context and use context as useProfile
export const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);