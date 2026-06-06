# GitSocial
GitSocial is a GitHub / Social Media hybrid dedicated to upcoming devs.

Streamlining:
- Sharing programming projects
- Uploading and browsing code files
- Viewing project details
- Leaving comments and feedback
- Finding new projects from other developers

## Instructions on How to Build Project
This project uses:
- @octokit/graphql & @octokit/rest
- @supabase/supabase-js
- bootstrap & bootstrap-icons
- react
- react-bootstrap
- react-dom
- react-router-dom

To build the project:
1. Use `schema.sql` to build the database schema in Supabase
2. Copy `.env.example` to your `.env`
3. Fill in your values for in `.env`
  - `VITE_GHP` - a GitHub Personal Access Token (Repository Metadata read only permission)
  - `VITE_SUPABASE_URL` - found in Supabase project settings
  - `VITE_SUPABASE_ANON_KEY` - found in Supabase project settings
4. Run these following commands:
  - `npm install`
  - `npm run dev`

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
