import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
} from 'react-bootstrap'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import logo from '../pixel_logo.png'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validated, setValidated] = useState(false)
  const needsPostSignIn = searchParams.get('reason') === 'post'
  const trimmedEmail = email.trim()
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)
  const isFormValid = isEmailValid && password.length > 0

  async function handleEmailLogin(event) {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)
    setErrorMessage('')

    if (!event.currentTarget.checkValidity() || !isFormValid) {
      return
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Sign in is unavailable right now.')
      return
    }

    try {
      setSubmitting(true)

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (error) throw error

      navigate('/')
    } catch (error) {
      console.error(error)
      setErrorMessage('We could not sign you in. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGitHubAuth(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!isSupabaseConfigured) {
      setErrorMessage('GitHub sign in is unavailable right now.')
      return
    }

    try {
      setSubmitting(true)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error(error)
      setErrorMessage('We could not open GitHub sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Container className="d-flex flex-column align-items-center py-5">
        <Link to="/" className="auth-brand text-decoration-none">
          <img src={logo} className="auth-logo" alt="GitSocial logo" />
          <span>GitSocial</span>
        </Link>

        <Card className="auth-card p-3 bg-white border-dark-subtle shadow-sm mx-auto w-100">
          <Card.Body>
            <Card.Title className="text-center fs-2 mb-3 fw-semibold">
              Log in
            </Card.Title>
            <p className="text-muted text-center small mb-4">
              Continue with GitHub to access your GitSocial account.
            </p>

            {needsPostSignIn && (
              <Alert variant="info">Please log in before creating a post.</Alert>
            )}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleEmailLogin}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label className="fw-medium">Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  isInvalid={validated && !isEmailValid}
                  isValid={isEmailValid}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label className="fw-medium">Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  isInvalid={validated && password.length === 0}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your password.
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="post-project-button fw-bold w-100 mb-3"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Logging in...' : 'Log in'}
              </Button>
            </Form>

            <div className="auth-divider text-muted small mb-3">or</div>

            <Button
              variant="dark"
              type="button"
              className="fw-bold w-100"
              disabled={submitting}
              onClick={handleGitHubAuth}
            >
              <i className="bi bi-github me-2" />
              {submitting ? 'Opening GitHub...' : 'Log in with GitHub'}
            </Button>

            <div className="text-center mt-3">
              <span className="text-muted small">New to GitSocial? </span>
              <Link to="/signup" className="text-decoration-none small fw-semibold">
                Sign up
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default LoginPage
