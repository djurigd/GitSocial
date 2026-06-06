import styles from '../../src/styles/Projects.module.css'
import { useProject } from './ProjectContext';

export function Projects() {
  const { repos } = useProject();

  if (repos.length === 0) {
    return(
      <h3>This user has no repos.</h3>
    );
  }

  return(
    <>
      <div id={styles.project_container}>
        { repos.map((repo) => (
          <div key={repo.id} id={styles.project}>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
            <div id={styles.display_misc}>
              <span>&#9733; Star • {repo.stargazers_count} Fork • {repo.forks_count}</span>
              <span>Last Updated: {repo.updated_at}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
