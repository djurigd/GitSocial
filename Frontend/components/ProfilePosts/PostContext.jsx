import { createContext, useContext } from "react";

// Context for user post
export const PostContext = createContext(null);
export const usePost = () => useContext(PostContext);