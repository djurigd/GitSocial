import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

export function LogIn() {
  const [username, setUsername] = useState("");
  const [loggingIn, setLogginIn] = useState(false);
  const usernameInput = useRef();

  function handleSubmit(event){
    
  }

  useEffect(() => {
    async function userExists() {
      
    }
  });

  return(
    <>
    <div className={`${styles.container}`}>
      <h2>Login</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='username'>GitHub Username</label>
          <input type='text' id='username' ref={usernameInput} value={username} onChange={(e) => setUsername(e.target.value)}/>
          <button type='submit'>Log In</button>
        </form>
      </div>
    </div>
    </>
  );
}