import { useState } from 'react'
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Row,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import logo from '../../src/pixel_logo.png'
import defaultAvatar from '../../src/Pixel_Default_Profile_Avatar.png'
import CreatePostModal from './CreatePostModal.jsx'
import UserSearchCard from './UserSearchCard.jsx'
import { useAuthProfile } from '../../src/lib/authProfile.js'
import { isSupabaseConfigured, supabase } from '../../src/lib/supabase.js'

function NavBar() {
  const navigate = useNavigate()
  const { authUser, profile } = useAuthProfile()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchErrorMessage, setSearchErrorMessage] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  async function handleSearchSubmit(event) {
    event.preventDefault()
    const trimmedSearch = searchTerm.trim()

    if (!trimmedSearch) {
      setSearchResults([])
      setSearchErrorMessage('')
      setShowSearchResults(false)
      return
    }

    if (!isSupabaseConfigured) {
      setSearchErrorMessage('Search is unavailable right now.')
      setShowSearchResults(true)
      return
    }

    try {
      setSearchLoading(true)
      setSearchErrorMessage('')
      setShowSearchResults(true)

      // Search profiles by username and show results in the navbar dropdown.
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', `%${trimmedSearch}%`)
        .limit(6)

      if (error) throw error

      setSearchResults(data ?? [])
    } catch (error) {
      console.error(error)
      setSearchErrorMessage('We could not search users. Please try again.')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  function handlePostCreated(postId) {
    setShowCreatePost(false)
    navigate(`/post/${postId}`)
  }

  function handleNewPostClick() {
    if (!authUser) {
      navigate('/login?reason=post')
      return
    }

    setShowCreatePost(true)
  }

  const accountLabel = profile?.username ?? 'Account'

  return (
    <>
      <Navbar className="feed-navbar border-bottom position-relative" bg="white">
        <Container fluid className="px-3 px-md-4">
          <Row className="align-items-center gy-3 w-100">
            <Col xs={12} lg={3}>
              <Navbar.Brand className="d-flex align-items-center mb-0" href="/">
                <img src={logo} className="nav-logo" alt="GitSocial logo" />
                GitSocial
              </Navbar.Brand>
            </Col>

            <Col xs={12} md={7} lg={4} className="mx-lg-auto">
              <Form className="nav-search-form d-flex" role="search" onSubmit={handleSearchSubmit}>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-at" /></InputGroup.Text>
                  <Form.Control
                    className="me-2"
                    type="search"
                    placeholder="Search users..."
                    aria-label="Search users"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0 || searchErrorMessage) {
                        setShowSearchResults(true)
                      }
                    }}
                  />
                </InputGroup>
                <Button variant="outline-dark" type="submit" aria-label="Search">
                  <i className="bi bi-search" />
                </Button>
              </Form>

              {showSearchResults && (
                <div className="nav-search-results shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small">User results</span>
                    <Button
                      variant="link"
                      className="p-0 text-muted small text-decoration-none"
                      type="button"
                      onClick={() => setShowSearchResults(false)}
                    >
                      Close
                    </Button>
                  </div>
                  {searchLoading && (
                    <p className="text-muted text-center small mb-0">Searching users...</p>
                  )}
                  {searchErrorMessage && (
                    <Alert variant="warning" className="py-2 mb-0">{searchErrorMessage}</Alert>
                  )}
                  {!searchLoading && !searchErrorMessage && searchResults.length === 0 && (
                    <p className="text-muted text-center small mb-0">No users found.</p>
                  )}
                  <div className="user-search-list">
                    {searchResults.map((user) => (
                      <UserSearchCard key={user.id} user={user} />
                    ))}
                  </div>
                </div>
              )}
            </Col>

            <Col xs={12} md={5} lg={5} className="d-flex justify-content-md-end gap-2">
              <Button
                className="post-project-button"
                type="button"
                onClick={handleNewPostClick}
              >
                <i className="bi bi-pencil-square me-2" />
                New Post
              </Button>
              <Button
                className="account-nav-button"
                variant="outline-dark"
                type="button"
                onClick={() => navigate('/account')}
              >
                {authUser && (
                  <img
                    src={profile?.avatar_url?.trim() || defaultAvatar}
                    className="account-nav-avatar me-2"
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = defaultAvatar
                    }}
                  />
                )}
                <span className="account-nav-label">{authUser ? 'Account' : 'Account'}</span>
                {authUser && (
                  <span className="account-nav-username">{accountLabel}</span>
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <CreatePostModal
        show={showCreatePost}
        onHide={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}

export default NavBar
