"use client";
import React from 'react';
export default function signin() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handlesubmit = async (e) => {
      console.log(username,password);
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/route/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify({   "username":username,
  "passwordhash": password }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            alert('Login successful!');
        } else {
            alert('Login failed: ' + data.message);
        }
    };
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit = {handlesubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}