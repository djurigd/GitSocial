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
  - `VITE_GHP` - a GitHub Personal Access Token (Metadata read only permission)
  - `VITE_SUPABASE_URL` - found in Supabase project settings
  - `VITE_SUPABASE_ANON_KEY` - found in Supabase project settings
4. Run these following commands:
  - `npm install`
  - `npm run dev`