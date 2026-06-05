import { useState, useEffect } from 'react';
import {createClient } from '@supabase/supabase-js';
import styles from '../styles/Login.module.css';
import bcrypt from 'bcryptjs';

// Supabase client for querying
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const salt = bcrypt.genSaltSync(10); // Password hashing

// Login component
export function LogIn() {
  // States for user's Github data, site's username and password
  const [userData, setUserData] = useState(undefined);
  const [user_name, setUser_name] = useState(localStorage.getItem('pending_username') || '');
  const [password, setPassword] = useState(localStorage.getItem('pending_password') || '');

  // Side effect for handling Github OAuth via Supabase
  useEffect(() => {
    // Handle OAuth via Supabase
    async function handleAuth() {
      const { data: { user }} = await supabase.auth.getUser();
      setUserData(user);
    }

    handleAuth();

    // Supabase subscription
    const { data: { subscription }} = supabase.auth.onAuthStateChange((event, session) => {
      setUserData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // GitHub OAuth
  async function githubAuth(e){
    e.preventDefault();
    localStorage.setItem('pending_username', user_name);
    localStorage.setItem('pending_password', password);

    // Sign in with OAuth (will redirect to different page soon)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });

    // Error checking
    if (error) {
      console.error(`Login Error: ${error.message}`);
    }
  }

  // Upsert user into the database
    async function upsertUser(hashedPassword) {
      // Get session for fetching GitHub user API
      const { data: { session } } = await supabase.auth.getSession();
      console.log('session', session)
      console.log('provider_token', session?.provider_token)

      // Fetch user API
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${session.provider_token}`
        }
      });

      const github_api_user = await response.json();

      // Upsert user into database
      const { error } = await supabase.from('users')
        .upsert({
          username: user_name, 
          email: userData.email, 
          password_hash: hashedPassword, 
          github_id: userData.user_metadata.provider_id, 
          github_username: userData.user_metadata.user_name, 
          avatar_url: userData.user_metadata.avatar_url,
          bio: github_api_user.bio
        }, { onConflict: 'github_id' });

        // Error checking
        if (error) {
          console.error(error);
        }
        localStorage.removeItem('pending_username');
        localStorage.removeItem('pending_password');
    }

  useEffect(() => {

    // If user's GitHub data exist, upsert into database
    async function handleUpsert() {
      console.log('handleUpsert fired', { userData, password });
      if (userData && password) {
        console.log('upserting...');
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, salt);
        await upsertUser(hashedPassword);
      }
    } 

    handleUpsert();
    
  }, [userData]);

  

  return(
    <>
      <div>
        <h1>Log in</h1>
        <form>
          <label htmlFor='username'>Username</label>
          <input id='username' type='text' placeholder='username' onChange={(e) => setUser_name(e.target.value)} />

          <label htmlFor='password'>Password</label>
          <input id='password' type='text' placeholder='password' onChange={(e) => setPassword(e.target.value)} />

          <button id={styles.login_button} onClick={(e) => githubAuth(e)}>
            <img id={styles.github_logo} src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-white-icon.png' />
            Login via GitHub
          </button>
        </form>
      </div>
    </>
  );
}