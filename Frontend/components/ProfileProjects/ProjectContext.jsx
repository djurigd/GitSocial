import { createContext, useContext } from "react";

// Context for user projects
export const ProjectContext = createContext(null);
export const useProject = () => useContext(ProjectContext);