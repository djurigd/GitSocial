# GitSocial
A website that is dedicated to extending GitHub as a social media platform.

## Current Frontend Flow

The active Vite application starts from `Frontend/src/main.jsx` and renders
`Frontend/src/App.jsx`. The routes in `App.jsx` connect the home feed, post
viewer, profile pages, upload page, login page, signup page, and account page.

Authentication is handled through Supabase in `Frontend/src/lib/authProfile.js`.
That helper keeps Supabase Auth users separate from GitSocial profile rows:

- Supabase Auth stores the signed-in session and email/OAuth identity.
- The `users` table stores the GitSocial profile used by posts, comments,
  profile pages, avatars, and usernames.
- Post and comment creation call `getCurrentAppUserId()` so new content is
  attached to the signed-in user's GitSocial profile row.

The navbar handles account entry, post creation, and user search. Users who are
not signed in are sent to the login page before creating a post. Signed-in users
see their account avatar when available; otherwise the app shows
`Frontend/src/Pixel_Default_Profile_Avatar.png` as a consistent fallback.

## Error Handling

Public-facing error messages are intentionally short and user-friendly. Detailed
Supabase errors stay in the developer console so debugging information is
available without exposing raw service messages in the UI.
