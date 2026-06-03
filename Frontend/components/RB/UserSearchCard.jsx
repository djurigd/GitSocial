import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

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
          <img src={user.avatar_url} className="profile-avatar me-3" alt="" />
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

export default UserSearchCard
