import { Badge, Card, Stack } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import defaultAvatar from '../../src/Pixel_Default_Profile_Avatar.png'
import { normalizeTagName } from './tagUtils.js'

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

  function openProfile(event) {
    event.stopPropagation()

    if (post.userId) {
      navigate(`/profile/${post.userId}`)
    }
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
        <img
          src={post.avatarUrl?.trim() || defaultAvatar}
          className="profile-avatar me-2"
          alt=""
          onError={(event) => {
            event.currentTarget.src = defaultAvatar
          }}
        />
        <button
          className="btn btn-link p-0 text-decoration-none fw-bold text-dark"
          type="button"
          onClick={openProfile}
        >
          {post.username}
        </button>
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
              #{normalizeTagName(tag)}
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

export default PostCard
