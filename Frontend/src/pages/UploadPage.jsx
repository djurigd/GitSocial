import { Card, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import CreatePostForm from '../../components/RB/CreatePostForm.jsx'

// Direct fallback for the same form used by the navbar modal
export default function UploadPage() {
  const navigate = useNavigate()

  return (
    <Container className="mx-auto my-3 p-3 bg-white">
      <h1 className="text-dark text-left my-2">Post a Project</h1>
      <p className="text-secondary text-left mb-4">Share your work with the community</p>

      <Card className="border-light-subtle mb-4 p-3">
        <CreatePostForm onPostCreated={(postId) => navigate(`/post/${postId}`)} />
      </Card>
    </Container>
  )
}
