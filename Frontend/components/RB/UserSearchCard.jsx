import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function UserSearchCard({ user }) {
  const navigate = useNavigate()
  const cleanBio = user.bio?.trim()
  const previewBio = cleanBio && cleanBio.length > 60
    ? `${cleanBio.slice(0, 57)}...`
    : cleanBio

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
      <Card.Body className="d-flex align-items-center">
        {user.avatar_url ? (
          <img src={user.avatar_url} className="profile-avatar me-3" alt="" />
        ) : (
          <div className="profile-avatar me-3" aria-hidden="true">
            {user.username?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        )}
        <div className="d-flex flex-column gap-1 w-100">
          <div className="fw-bold text-dark">{user.username ?? 'Unknown user'}</div>
          {user.github_username && (
            <div className="text-muted small d-flex align-items-center lh-sm">
              <i className="bi bi-github me-1 flex-shrink-0 text-secondary"/>
              <span>@{user.github_username}</span>
            </div>
          )}
          {previewBio && (
            <div className="user-search-summary text-secondary small lh-sm text-truncate">
              <em>{previewBio}</em>
            </div>
          )}
          {!user.github_username && !previewBio && (
            <div className="text-muted small fst-italic">GitSocial user</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default UserSearchCard
