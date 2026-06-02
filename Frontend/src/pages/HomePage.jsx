import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Navbar,
  Row,
  Badge,
  Stack,
} from 'react-bootstrap'

import logo from '../pixel_logo.png'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function formatPostTime(createdAt) {
  const postedAt = new Date(createdAt)
  const elapsedMs = Date.now() - postedAt.getTime()
  const minuteMs = 60 * 1000
  const hourMs = 60 * minuteMs
  const dayMs = 24 * hourMs

  if (elapsedMs < 2 * minuteMs) {
    return 'just now'
  }

  if (elapsedMs < hourMs) {
    return `${Math.floor(elapsedMs / minuteMs)} minutes ago`
  }

  if (elapsedMs < dayMs) {
    const hours = Math.floor(elapsedMs / hourMs)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }

  if (elapsedMs < 7 * dayMs) {
    const days = Math.floor(elapsedMs / dayMs)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }

  return postedAt.toLocaleDateString()
}

function PostCard({ post }) {
  const navigate = useNavigate()

  function openPost() {
    navigate(`/post/${post.id}`)
  }

  function handlePostKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPost()
    }
  }

  return (
    <Card
      className="feed-card p-3 p-md-4"
      role="button"
      tabIndex={0}
      onClick={openPost}
      onKeyDown={handlePostKeyDown}
    >
      <div className="d-flex align-items-center mb-3">
        {post.avatarUrl ? (
          <img src={post.avatarUrl} className="profile-avatar me-2" alt="" />
        ) : (
          <div className="profile-avatar me-2" aria-hidden="true">
            {post.username.charAt(0).toUpperCase()}
          </div>
        )}
        <a
          href="#"
          className="text-decoration-none fw-bold text-dark"
          onClick={(event) => event.stopPropagation()}
        >
          {post.username}
        </a>
        <small className="text-muted ms-2">
          {formatPostTime(post.createdAt)}
        </small>
      </div>

      <Card.Title as="h2" className="fs-5"> {post.title}  </Card.Title>
      <Card.Text>{post.description}</Card.Text>

      {post.files.length > 0 && (
        <div className="file-preview my-3">
          <i className="filetype bi bi-file-earmark-code" aria-hidden="true" />
          <span className="file-name ms-2">{post.files[0].filename}</span>
        </div>
      )}

      <ul className="post-tag list-unstyled d-flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag) => (
          <li key={tag}>
            <Badge bg={null}>
              #{tag}
            </Badge>
          </li>
        ))}
      </ul>

      <Stack direction="horizontal" gap={2} className="post-engagement">
        <Badge pill bg={null} className="comment-count">
          <i className="bi bi-chat me-1" />
          {post.commentCount}
        </Badge>
      </Stack>
    </Card>
  )
}

function UserSearchCard({ user }) {
  const navigate = useNavigate()
  const profileSummary = user.bio || user.github_username || 'GitSocial user'
  const previewSummary =
    profileSummary.length > 80 ? `${profileSummary.slice(0, 77)}...` : profileSummary

  function openProfile() {
    navigate(`/profile/${user.id}`)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProfile()
    }
  }

  return (
    <Card
      className="user-search-card"
      role="button"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={handleKeyDown}
    >
      <Card.Body className="d-flex align-items-center p-3">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            className="profile-avatar me-3"
            alt=""
          />
        ) : (
          <div className="profile-avatar me-3" aria-hidden="true">
            {user.username?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        )}
        <div>
          <div className="fw-bold text-dark">{user.username ?? 'Unknown user'}</div>
          <div className="user-search-summary text-muted small">{previewSummary}</div>
        </div>
      </Card.Body>
    </Card>
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
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

        let query = supabase.from('posts').select(`
            id,
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

        const { data, error } = await query

        if (error) {
          throw error
        }

        const formattedPosts = (data ?? []).map((post) => ({
          id: post.id,
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

  function handleSearchSubmit(event) {
    event.preventDefault()
    setSubmittedSearch(searchTerm.trim())
  }

  return (
    <div className="home-page">
      <Navbar className="feed-navbar border-bottom" bg="white">
        <Container fluid className="px-3 px-md-4">
          <Row className="align-items-center gy-3 w-100">
            <Col xs={12} lg={3}>
              <Navbar.Brand className="d-flex align-items-center mb-0" href="/">
                <img src={logo} className="nav-logo" alt="GitSocial logo" />
                GitSocial
              </Navbar.Brand>
            </Col>

            <Col xs={12} md={7} lg={4} className="mx-lg-auto">
              <Form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                <Form.Control
                  className="me-2"
                  type="search"
                  placeholder="Search users..."
                  aria-label="Search users"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Button variant="outline-dark" type="submit" aria-label="Search">
                  <i className="bi bi-search" />
                </Button>
              </Form>
            </Col>

            <Col xs={12} md={5} lg={5} className="d-flex justify-content-md-end gap-2">
              <Button className="post-project-button" type="button">
                <i className="bi bi-plus-circle me-2" />
                Post Project
              </Button>
              <Button variant="outline-dark" type="button">
                <i className="bi bi-house-door me-2" />
                Home
              </Button>
              <Button variant="outline-dark" type="button">
                <i className="bi bi-person-circle me-2" />
                Profile
              </Button>
            </Col>
          </Row>
        </Container>
      </Navbar>
      
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

      <h1 className="feed-title text-center my-4">Home Feed</h1>
      <p className="text-gray text-center mb-4">
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
