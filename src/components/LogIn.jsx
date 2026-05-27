import { useState, useEffect } from 'react';

export function LogIn() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function handleAuth() {
      if (token) {
        const response = fetch('https://api.github.com/user', {
          headers: { Authorization: token },
        });
        const data = response.json();
        setUserData(data);

      } else if (code) {
        const response = fetch(`http://localhost:3000/oauth/redirect?code=${code}&state=test_state`);
        const data = response.json();
        setUserData(data.userData);
        localStorage.setItem("token", `${data.tokenType} ${data.token}`);
      }
    }

    handleAuth();
  }, [code]);

  function githubAuth(){
    const redirect_uri = 'http://localhost:3000/test';
    const scope = 'read:user';

    const url = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}`;
  
    window.location.href = url;
  }

  if (userData) {
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