import { useState, useEffect } from 'react';
import {createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function LogIn() {
  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    async function handleAuth() {
      const { data: { user }} = await supabase.auth.getUser();
      setUserData(user);
    }

    handleAuth();

    const { data: { subscription }} = supabase.auth.onAuthStateChange((event, session) => {
      setUserData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  });

  async function githubAuth(){
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error(`Login Error: ${error.message}`);
    }
  }

  if (userData) {
    console.log(`User Data: ${userData}`);
    console.log("User authenticated");
  }

  return(
    <>
      <div>
        <h1>Log in</h1>
        <button onClick={githubAuth}>
        
        </button>
      </div>
    </>
  );
}