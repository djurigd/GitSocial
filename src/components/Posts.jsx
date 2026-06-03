import { useState } from 'react';

import styles from '../styles/Posts.module.css'

export function Posts({ username }) {
  const posts = [
    {
      title: "Created JSX",
      description: "Hi, I created a JSX file!",
      created_at: "2026-05-29",
      updated_at: "2026-05-29"
    },
    {
      title: "Use JSX",
      description: "Hi, you should use a JSX file!",
      created_at: "2026-05-29",
      updated_at: "2026-05-29"
    },
    {
      title: "Hi!",
      description: "Hi!",
      created_at: "2026-05-29",
      updated_at: "2026-05-29"
    }
  ];

  // Update with Postpage integration
  return(
    <>
      <div id={styles.post_container}>
        { posts.map((post, index) => (
          <div key={index} id={styles.post}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <span>Created at: {post.created_at} / Updated at: {post.updated_at}</span>
          </div>
        ))}
      </div>
    </>
  )
}