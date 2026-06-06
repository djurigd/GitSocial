import { Modal } from 'react-bootstrap'

import CreatePostForm from './CreatePostForm.jsx'

function CreatePostModal({ onHide, onPostCreated, show }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Post a Project</Modal.Title>
          <p className="text-secondary mb-0">Share your work with the community</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <CreatePostForm onCancel={onHide} onPostCreated={onPostCreated} />
      </Modal.Body>
    </Modal>
  )
}

export default CreatePostModal
