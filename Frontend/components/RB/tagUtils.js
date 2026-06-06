/*
Helper function to normalize tag names by trimming whitespace, converting to lowercase, and replacing spaces with underscores
Used in:
i) CreatePostForm.jsx --> when saving new tags (into the DB, for new projects)
ii) PostCard.jsx --> when displaying loaded tags (all that gets displayed)
*/
export function normalizeTagName(tag) {
  return tag.trim().toLowerCase().replace(/\s+/g, '_')
}
