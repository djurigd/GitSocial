import { useState, useEffect } from 'react';
import {createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wqasdhamgcvwwlfkafmn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYXNkaGFtZ2N2d3dsZmthZm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjUxNDUsImV4cCI6MjA5Mzg0MTE0NX0.ogfW-38A8Hy1Y_GowHRaNCn8MyHmgU1mPyB13EqeEYU'
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