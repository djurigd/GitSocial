import styles from '../styles/Posts.module.css'
import { usePost } from './PostContext'

export function Posts() {
  const { posts } = usePost();

  // Update with Postpage integration
  return(
    <>
      <div id={styles.post_container}>
        { posts.map((post) => (
          <div key={post.id} id={styles.post}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <span>Created at: {post.created_at} / Updated at: {post.updated_at}</span>
          </div>
        ))}
      </div>
    </>
  )
}