import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import defaultAvatar from '../../src/Pixel_Default_Profile_Avatar.png'

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
      <Card.Body className="d-flex align-items-center text-start">
        <img
          src={user.avatar_url?.trim() || defaultAvatar}
          className="profile-avatar me-3"
          alt=""
          onError={(event) => {
            event.currentTarget.src = defaultAvatar
          }}
        />
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
