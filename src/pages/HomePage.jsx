import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
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

function PostCard({ post, onTagClick }) {
  return (
    <Card className="feed-card p-3 p-md-4">
      <div className="d-flex align-items-center mb-3">
        {post.avatarUrl ? (
          <img src={post.avatarUrl} className="profile-avatar me-2" alt="" />
        ) : (
          <div className="profile-avatar me-2" aria-hidden="true">
            {post.username.charAt(0).toUpperCase()}
          </div>
        )}
        <a href="#" className="text-decoration-none fw-bold text-dark">
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
            <Badge bg={null} onClick={() => onTagClick(tag)}>
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

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMode, setSearchMode] = useState('users')
  const [submittedSearch, setSubmittedSearch] = useState({ mode: 'users', term: '' })
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

        const searchingUsers = submittedSearch.mode === 'users' && submittedSearch.term
        const searchingTags = submittedSearch.mode === 'tags' && submittedSearch.term
        const userRelation = searchingUsers ? 'users!inner' : 'users'
        const matchingTagsSelection = searchingTags
          ? ', matching_post_tags:post_tags!inner ( tags!inner ( name ) )'
          : ''

        let query = supabase.from('posts').select(`
            id,
            title,
            description,
            created_at,
            ${userRelation} (
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
            ${matchingTagsSelection}
          `)
          .eq('visibility', 'public')
          .order('created_at', { ascending: false })

        if (searchingUsers) {
          query = query.ilike('users.username', `%${submittedSearch.term.trim()}%`)
        }

        if (searchingTags) {
          const tags = submittedSearch.term
            .split(/\s+/)
            .map((tag) => tag.replace(/^#/, '').trim())
            .filter(Boolean)

          if (tags.length > 0) {
            query = query.in('matching_post_tags.tags.name', tags)
          }
        }

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
  }, [submittedSearch])

  function handleSearchSubmit(event) {
    event.preventDefault()
    setSubmittedSearch({ mode: searchMode, term: searchTerm.trim() })
  }


  function addTagToSearch(tag) {
    const hashtag = `#${tag}`

    if (searchMode !== 'tags') {
      setSearchMode('tags')
      setSearchTerm(hashtag)
      return
    }

    setSearchTerm((currentTerm) => {
      const terms = currentTerm.trim().split(/\s+/).filter(Boolean)

      if (terms.includes(hashtag)) {
        return currentTerm
      }

      return [...terms, hashtag].join(' ')
    })
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
                <InputGroup className="me-2">
                  <Form.Select
                    className="search-mode-select"
                    aria-label="Search category"
                    value={searchMode}
                    onChange={(event) => setSearchMode(event.target.value)}
                  >
                    <option value="users">Users</option>
                    <option value="tags">Tags</option>
                  </Form.Select>
                  <Form.Control
                    type="search"
                    placeholder={searchMode === 'tags' ? 'Search tags...' : 'Search users...'}
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </InputGroup>
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
            <PostCard key={post.id} post={post} onTagClick={addTagToSearch} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default HomePage
