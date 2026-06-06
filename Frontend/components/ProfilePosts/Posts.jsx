import styles from '../../styles/Posts.module.css'
import { usePost } from './PostContext'

// User posts
export function Posts() {
  const { posts } = usePost();

  // If the user doesn't have any posts
  if (posts.length === 0) {
    return(
      <h3>This user has no posts.</h3>
    );
  }

  // Display user posts
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