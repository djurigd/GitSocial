import { PostContext } from "./PostContext";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Provider for user posts
export function PostProvider({ username, children }) {
  const [posts, setPosts] = useState([]); // Amount of post user has

  // Get the user's post
  useEffect(() => {
    async function getPosts() {
      // Query user's posts
      const { data, error } = await supabase.from('posts')
        .select('*, users!inner(username)')
        .eq('users.username', username)
        .eq('visibility', 'public');

      if (error) {
        console.error(error);
      } else {
        setPosts(data);
      }
    }

    getPosts();
  }, [username]);



  return(
    <PostContext.Provider value={{ posts }}>
      {children}
    </PostContext.Provider>
  )
}