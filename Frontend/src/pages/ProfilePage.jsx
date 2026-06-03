import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import NavBar from '../../components/RB/NavBar.jsx'

function ProfilePage() {
  const { userId } = useParams()
  const displayUsername = userId ? 'selected user' : 'current user'

  return (
    <div className="home-page">
      <NavBar />
      <Container className="py-4">
        <h1 className="fs-3 mb-0">Viewing user {displayUsername}</h1>
        {/* TODO: Placeholder until profile page work is integrated. */}
      </Container>
    </div>
  )
}

export default ProfilePage
