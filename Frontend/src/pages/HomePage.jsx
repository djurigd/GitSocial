import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'

import NavBar from '../../components/RB/NavBar.jsx'
import PostCard from '../../components/RB/PostCard.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadFeedPosts() {
      if (!isSupabaseConfigured) {
        setErrorMessage('The feed is unavailable right now.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErrorMessage('')

        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            user_id,
            title,
            description,
            created_at,
            users (
              username,
              avatar_url
            ),
            files (
              id,
              filename,
              language
            ),
            comments (
              id
            ),
            post_tags (
              tags (
                name
              )
            )
          `)
          .eq('visibility', 'public')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        const formattedPosts = (data ?? []).map((post) => ({
          id: post.id,
          userId: post.user_id,
          title: post.title,
          description: post.description,
          createdAt: post.created_at,
          username: post.users?.username ?? 'Unknown user',
          avatarUrl: post.users?.avatar_url,
          files: post.files ?? [],
          tags:
            post.post_tags
              ?.map((postTag) => postTag.tags?.name)
              .filter(Boolean) ?? [],
          commentCount: post.comments?.length ?? 0,
        }))

        setPosts(formattedPosts)
      } catch (error) {
        console.error(error)
        setErrorMessage('We could not load the feed. Please refresh and try again.')
      } finally {
        setLoading(false)
      }
    }

    loadFeedPosts()
  }, [])

  return (
    <div className="home-page">
      <NavBar />

      <h1 className="feed-title text-center my-2">Home Feed</h1>
      <p className="text-gray text-center mb-2">
        Discover amazing projects from the community
      </p>

      <main className="feed-content">
        <div className="feed-list">
          {loading && <p className="text-muted text-center">Loading posts...</p>}
          {errorMessage && <Alert variant="warning">{errorMessage}</Alert>}
          {!loading && !errorMessage && posts.length === 0 && (
            <p className="text-muted text-center">No public posts found.</p>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default HomePage
