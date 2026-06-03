import { useState, useEffect } from 'react';
import styles from '../styles/Projects.module.css'

export function Projects({ username }) {
  const repos = [
    {
      name: "MyFirstWebsite",
      description: "My first website ever",
      stargazerCount: 10,
      forkCount: 1,
      updatedAt: "2 days ago"
    },
    {
      name: "Pacman",
      description: "Recreates pacman game",
      stargazerCount: 100,
      forkCount: 13,
      updatedAt: "6 days ago"
    },
    {
      name: "Hi",
      description: "Hello",
      stargazerCount: 1,
      forkCount: 0,
      updatedAt: "1 month ago"
    }
  ]

  return(
    <>
      <div id={styles.project_container}>
        { repos.map((repo, index) => (
          <div key={index} id={styles.project}>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
            <div id={styles.display_misc}>
              <span>&#9733; Star • {repo.stargazerCount} Fork • {repo.forkCount}</span>
              <span>Last Updated: {repo.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}