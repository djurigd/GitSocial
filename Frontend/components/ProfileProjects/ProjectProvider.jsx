import { ProjectContext } from "./ProjectContext";
import { useState, useEffect } from "react";
import { useProfile } from "../Profile/ProfileContext";

// Provider for user projects
export function ProjectProvider({ children }) {
  const { login } = useProfile(); // User's GitHub username
  const [repos, setRepos] = useState([]); // List of user's repo

  // Get the user's list of projects
  useEffect(() => {
    async function getRepos() {
      const response = await fetch(`https://api.github.com/users/${login}/repos`);

      // If Status === 200
      if (response.ok) {
        setRepos(await response.json())
      } else {
        console.error(response.status);
      }
    }

    getRepos();
  }, [login]);

  return(
    <ProjectContext.Provider value={{ repos, username: login }}>
      {children}
    </ProjectContext.Provider>
  )
}