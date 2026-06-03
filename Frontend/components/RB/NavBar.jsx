import { useState } from 'react'
import {
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
import CreatePostModal from './CreatePostModal.jsx'

function NavBar({ onSearch, searchTerm, setSearchTerm }) {
  const navigate = useNavigate()
  const [showCreatePost, setShowCreatePost] = useState(false)

  function handleSearchSubmit(event) {
    event.preventDefault()
    onSearch(searchTerm.trim())
  }

  function handlePostCreated(postId) {
    setShowCreatePost(false)
    navigate(`/post/${postId}`)
  }

  return (
    <>
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
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-at" /></InputGroup.Text>
                  <Form.Control
                    className="me-2"
                    type="search"
                    placeholder="Search users..."
                    aria-label="Search users"
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
              <Button
                className="post-project-button"
                type="button"
                onClick={() => setShowCreatePost(true)}
              >
                <i className="bi bi-pencil-square me-2" />
                New Post
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

      <CreatePostModal
        show={showCreatePost}
        onHide={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}

export default NavBar
