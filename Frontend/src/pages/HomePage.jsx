import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert } from 'react-bootstrap'

import NavBar from '../../components/RB/NavBar.jsx'
import PostCard from '../../components/RB/PostCard.jsx'
import UserSearchCard from '../../components/RB/UserSearchCard.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [submittedSearch, setSubmittedSearch] = useState(initialSearch)
  const [userResults, setUserResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchErrorMessage, setSearchErrorMessage] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadFeedPosts() {
      if (!isSupabaseConfigured) {
        setErrorMessage('Add your Supabase environment variables to load the feed.')
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
        setErrorMessage('Could not load the feed.')
      } finally {
        setLoading(false)
      }
    }

    loadFeedPosts()
  }, [])

  function handleSearch(searchValue) {
    setSubmittedSearch(searchValue)

    if (searchValue) {
      setSearchParams({ search: searchValue })
    } else {
      setSearchParams({})
    }
  }

  useEffect(() => {
    async function loadUserResults() {
      if (!submittedSearch) {
        setUserResults([])
        setSearchErrorMessage('')
        return
      }

      if (!isSupabaseConfigured) {
        setSearchErrorMessage('Add your Supabase environment variables to search users.')
        return
      }

      try {
        setSearchLoading(true)
        setSearchErrorMessage('')

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('username', `%${submittedSearch}%`)
          .limit(8)

        if (error) {
          throw error
        }

        setUserResults(data ?? [])
      } catch (error) {
        console.error(error)
        setSearchErrorMessage('Could not search users.')
      } finally {
        setSearchLoading(false)
      }
    }

    loadUserResults()
  }, [submittedSearch])

  return (
    <div className="home-page">
      <NavBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {submittedSearch && (
        <section className="user-search-results">
          <div className="user-search-results-inner">
            <h2 className="fs-5 mb-1">User Results</h2>
            <p className="text-muted small mb-3">Profiles matching "{submittedSearch}"</p>
            {searchLoading && (
              <p className="text-muted text-center">Searching users...</p>
            )}
            {searchErrorMessage && (
              <Alert variant="warning">{searchErrorMessage}</Alert>
            )}
            {!searchLoading && !searchErrorMessage && userResults.length === 0 && (
              <p className="text-muted text-center">No users found.</p>
            )}
            <div className="user-search-list">
              {userResults.map((user) => (
                <UserSearchCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </section>
      )}

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
