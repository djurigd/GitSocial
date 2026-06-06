import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../pixel_logo.png'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

function SignUpPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validated, setValidated] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkedUsername, setCheckedUsername] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)

  const passwordRules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const isPasswordValid = Object.values(passwordRules).every(Boolean)
  const trimmedUsername = username.trim()
  const trimmedEmail = email.trim()
  const isUsernameLongEnough = trimmedUsername.length >= 3
  const isUsernameAvailable = usernameAvailable === true && checkedUsername === trimmedUsername
  const isUsernameTaken = usernameAvailable === false && checkedUsername === trimmedUsername
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)
  const isFormValid =
    isUsernameLongEnough &&
    isUsernameAvailable &&
    isEmailValid &&
    isPasswordValid &&
    !checkingUsername

  useEffect(() => {
    if (!isUsernameLongEnough || !isSupabaseConfigured) {
      setUsernameAvailable(null)
      setCheckedUsername('')
      setCheckingUsername(false)
      return undefined
    }

    // Debounce username checks so typing does not fire a database query per key.
    const timeoutId = window.setTimeout(async () => {
      try {
        setCheckingUsername(true)

        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('username', trimmedUsername)
          .maybeSingle()

        if (error) throw error

        setCheckedUsername(trimmedUsername)
        setUsernameAvailable(!data)
      } catch (error) {
        console.error(error)
        setCheckedUsername('')
        setUsernameAvailable(null)
      } finally {
        setCheckingUsername(false)
      }
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [isUsernameLongEnough, trimmedUsername])

  async function handleEmailSignUp(event) {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)
    setErrorMessage('')
    setSuccessMessage('')

    const form = event.currentTarget
    const formUsername = form.elements.signupUsername.value.trim()
    const formEmail = form.elements.signupEmail.value.trim()
    const formPassword = form.elements.signupPassword.value
    const formEmailIsValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formEmail)

    if (
      !form.checkValidity() ||
      formUsername !== trimmedUsername ||
      formEmail !== trimmedEmail ||
      formPassword !== password ||
      !formEmailIsValid ||
      !isFormValid
    ) {
      return
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Account creation is unavailable right now.')
      return
    }

    try {
      setSubmitting(true)

      const { data, error } = await supabase.auth.signUp({
        email: formEmail,
        password: formPassword,
        options: {
          // The database trigger can use this metadata when creating the profile row.
          data: {
            username: formUsername,
          },
        },
      })

      if (error) throw error

      if (data.session) {
        navigate('/')
        return
      }

      setSuccessMessage('Check your email to finish signing up.')
    } catch (error) {
      console.error(error)
      if (error.status === 429 || error.code === 'over_request_rate_limit') {
        setErrorMessage('Too many signup attempts. Please wait a minute and try again.')
      } else if (error.message?.toLowerCase().includes('email')) {
        setErrorMessage('Please enter a valid email address.')
      } else {
        setErrorMessage('We could not create your account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGitHubSignUp(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!isSupabaseConfigured) {
      setErrorMessage('GitHub sign up is unavailable right now.')
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
      setErrorMessage('We could not open GitHub sign up. Please try again.')
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
              Sign up
            </Card.Title>
            <p className="text-muted text-center small mb-4">
              Create an account with email or continue with GitHub.
            </p>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleEmailSignUp}>
              <Form.Group className="mb-3" controlId="signupUsername">
                <Form.Label className="fw-medium">GitSocial username</Form.Label>
                <Form.Control
                  required
                  minLength={3}
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setUsernameAvailable(null)
                    setCheckedUsername('')
                  }}
                  isInvalid={validated && (!isUsernameLongEnough || isUsernameTaken)}
                  isValid={isUsernameLongEnough && isUsernameAvailable}
                />
                <Form.Control.Feedback type="invalid">
                  {isUsernameTaken
                    ? 'This username is already taken.'
                    : 'Please enter at least 3 characters.'}
                </Form.Control.Feedback>
                {checkingUsername && (
                  <Form.Text className="text-muted">Checking username...</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupEmail">
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

              <Form.Group className="mb-3" controlId="signupPassword">
                <Form.Label className="fw-medium">Password</Form.Label>
                <Form.Control
                  required
                  minLength={8}
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  isInvalid={validated && !isPasswordValid}
                />
                <Form.Control.Feedback type="invalid">
                  Please meet the password requirements.
                </Form.Control.Feedback>
              </Form.Group>

              <div className="mb-3 small">
                {Object.entries({
                  length: 'At least 8 characters',
                  lowercase: 'One lowercase letter',
                  uppercase: 'One uppercase letter',
                  number: 'One number',
                  special: 'One special character',
                }).map(([rule, label]) => (
                  <div
                    key={rule}
                    className={passwordRules[rule] ? 'text-success' : 'text-danger'}
                  >
                    <i className={`bi ${passwordRules[rule] ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`} />
                    {label}
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                className="post-project-button fw-bold w-100 mb-3"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Creating account...' : 'Create account'}
              </Button>
            </Form>

            <div className="auth-divider text-muted small mb-3">or</div>

            <Button
              variant="dark"
              type="button"
              className="fw-bold w-100"
              disabled={submitting}
              onClick={handleGitHubSignUp}
            >
              <i className="bi bi-github me-2" />
              {submitting ? 'Opening GitHub...' : 'Sign up with GitHub'}
            </Button>

            <div className="text-center mt-3">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-decoration-none small fw-semibold">
                Log in
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default SignUpPage
