import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap'

import { isSupabaseConfigured, supabase } from '../../src/lib/supabase.js'
import { getCurrentAppUserId } from '../../src/lib/authProfile.js'
import { normalizeTagName } from './tagUtils.js'

const TITLE_MIN = 3
const TITLE_MAX = 60
const DESC_MIN = 10
const DESC_MAX = 160
const TAGS_MAX = 5

function inferLanguage(filename) {
  const extension = filename.split('.').pop()?.toLowerCase()
  const languages = {
    css: 'CSS',
    html: 'HTML',
    js: 'JavaScript',
    jsx: 'JavaScript',
    json: 'JSON',
    md: 'Markdown',
    py: 'Python',
    ts: 'TypeScript',
    tsx: 'TypeScript',
  }

  return languages[extension] ?? extension?.toUpperCase() ?? 'Text'
}

async function getOrCreateTagId(tagName) {
  const { data: existingTag, error: selectError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tagName)
    .maybeSingle()

  if (selectError) {
    throw selectError
  }

  if (existingTag?.id) {
    return existingTag.id
  }

  const { data: insertedTag, error: insertError } = await supabase
    .from('tags')
    .insert({ name: tagName })
    .select('id')
    .single()

  if (insertError) {
    throw insertError
  }

  return insertedTag.id
}

function CreatePostForm({ onCancel, onPostCreated }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [files, setFiles] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validated, setValidated] = useState(false)
  const submittingRef = useRef(false)

  const tagsArray = [
    ...new Set(tagsInput.split(',').map(normalizeTagName).filter(Boolean)),
  ].slice(0, TAGS_MAX)

  function handleTagsChange(event) {
    const newValue = event.target.value
    const currentTags = newValue.split(',').map((tag) => tag.trim()).filter(Boolean)

    if (currentTags.length > TAGS_MAX && newValue.endsWith(',')) {
      return
    }

    setTagsInput(newValue)
  }

  async function handleUpload(event) {
    event.preventDefault()
    event.stopPropagation()

    if (submittingRef.current) {
      return
    }

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Project sharing is unavailable right now.')
      setValidated(true)
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setErrorMessage('')

    let createdPostId = null

    try {
      // Posts reference the app profile row so profiles, feeds, and comments agree.
      const userId = await getCurrentAppUserId()

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          description: desc.trim(),
          visibility: 'public',
          user_id: userId,
        })
        .select('id')
        .single()

      if (postError) throw postError
      createdPostId = post.id

      // Store file bytes first, then save file metadata for the code viewer.
      const postFiles = await Promise.all(
        files.map(async (file) => {
          const storagePath = `post-${post.id}/${file.name}`

          const { error: uploadError } = await supabase.storage
            .from('project-files')
            .upload(storagePath, file, { upsert: true })

          if (uploadError) throw uploadError

          return {
            post_id: post.id,
            filename: file.name,
            language: inferLanguage(file.name),
            storage_path: storagePath,
          }
        })
      )

      if (postFiles.length > 0) {
        const { error: filesError } = await supabase.from('files').insert(postFiles)
        if (filesError) throw filesError
      }

      if (tagsArray.length > 0) {
        // Tags are reused across posts to keep search/filter data normalized.
        const tagIds = await Promise.all(tagsArray.map(getOrCreateTagId))

        const postTags = tagIds.map((tagId) => ({
          post_id: post.id,
          tag_id: tagId,
        }))

        const { error: postTagsError } = await supabase.from('post_tags').insert(postTags)
        if (postTagsError) throw postTagsError
      }

      onPostCreated(post.id)
    } catch (error) {
      console.error(error)

      if (createdPostId) {
        onPostCreated(createdPostId)
        return
      }

      setErrorMessage('We could not share your project. Please try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
      setValidated(true)
    }
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleUpload}>
      {errorMessage && (
        <Alert className="mb-3" variant="danger">
          {errorMessage}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="formPostTitle">
        <Form.Label className="text-dark">Title</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Give your project a title"
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Please enter at least {TITLE_MIN} characters for your title.
        </Form.Control.Feedback>
        <Form.Text className={`d-block text-end mt-1 ${TITLE_MAX - title.length === 0 ? 'text-danger' : 'text-muted'}`}>
          {TITLE_MAX - title.length} characters remaining
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostDescription">
        <Form.Label className="text-dark">Project Description</Form.Label>
        <Form.Control
          required
          className="form-post-description"
          as="textarea"
          placeholder="Describe your project..."
          minLength={DESC_MIN}
          maxLength={DESC_MAX}
          value={desc}
          onChange={(event) => setDesc(event.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Please enter at least {DESC_MIN} characters for your description.
        </Form.Control.Feedback>
        <Form.Text className={`d-block text-end mt-1 ${DESC_MAX - desc.length === 0 ? 'text-danger' : 'text-muted'}`}>
          {DESC_MAX - desc.length} characters remaining
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostTags">
        <Form.Label className="text-dark">Tags</Form.Label>
        <InputGroup>
          <InputGroup.Text><i className="bi bi-hash" /></InputGroup.Text>
          <Form.Control
            required
            type="text"
            placeholder="Ex: react, typescript, bootstrap"
            value={tagsInput}
            onChange={handleTagsChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide at least one tag.
          </Form.Control.Feedback>
        </InputGroup>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <Form.Text className="text-muted">Use commas to separate tags</Form.Text>
          <Form.Text className={TAGS_MAX - tagsArray.length === 0 ? 'text-danger' : 'text-muted'}>
            {TAGS_MAX - tagsArray.length} tags remaining
          </Form.Text>
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostFiles">
        <Form.Label className="text-dark">File(s)</Form.Label>
        <Form.Control
          required
          type="file"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
        <Form.Control.Feedback type="invalid">
          Please include at least one project file.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Selected files will be visible in the post's CodeViewer.
        </Form.Text>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <Button variant="outline-secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          <i className="bi bi-upload me-2"/>
          {submitting ? 'Uploading...' : 'Upload post'}
        </Button>
      </div>
    </Form>
  )
}

export default CreatePostForm
