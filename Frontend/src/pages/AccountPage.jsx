import {
  Button,
  Card,
  Container,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import logo from '../pixel_logo.png'
import defaultAvatar from '../Pixel_Default_Profile_Avatar.png'
import { signOut, useAuthProfile } from '../lib/authProfile.js'

function AccountPage() {
  const { authUser, profile, loading } = useAuthProfile()

  async function handleSignOut() {
    await signOut()
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
              Account
            </Card.Title>

            {loading && <p className="text-muted text-center">Loading account...</p>}

            {!loading && !authUser && (
              <>
                <p className="text-muted text-center small mb-4">
                  Log in if you already have a profile, or sign up to create one.
                </p>

                <div className="d-grid gap-2">
                  <Button as={Link} to="/login" variant="dark" className="fw-bold">
                    Log in
                  </Button>
                  <Button as={Link} to="/signup" className="post-project-button fw-bold">
                    Sign up
                  </Button>
                </div>
              </>
            )}

            {!loading && authUser && (
              <div className="text-center">
                <img
                  src={profile?.avatar_url?.trim() || defaultAvatar}
                  className="account-avatar mb-3"
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = defaultAvatar
                  }}
                />
                <p className="fw-bold mb-1">{profile?.username ?? authUser.email}</p>
                <p className="text-muted small mb-4">{authUser.email}</p>
                <div className="d-grid gap-2">
                  {profile?.id && (
                    <Button as={Link} to={`/profile/${profile.id}`} className="post-project-button fw-bold">
                      View profile
                    </Button>
                  )}
                  <Button variant="outline-dark" type="button" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default AccountPage
