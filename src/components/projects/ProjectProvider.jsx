import { ProjectContext } from "./ProjectContext";
import { useState, useEffect } from "react";
import { useProfile } from "../ProfileContext";

export function ProjectProvider({ children }) {
  const { login } = useProfile();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    async function getRepos() {
      const response = await fetch(`https://api.github.com/users/${login}/repos`);

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