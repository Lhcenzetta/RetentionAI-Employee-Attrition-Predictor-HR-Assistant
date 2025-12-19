"use client";
import React from "react";
export default function RegistrePage() {
    const [username,setUsername]=React.useState("");
    const [password,setPassword]=React.useState("");
    const registrehundl= async (e) => {
        e.preventDefault();
        console.log(username,password);
        const response= await fetch("http://127.0.0.1:8000/route/registre",{
            method:"POST",
            headers: { "Content-Type": "application/json",
              "accept": "application/json" 
            },
            body:JSON.stringify({"username": username, 
                              "passwordhash": password
    }),
        })
    const data = await response.json()
    console.log(data)
    }
  return (
    <div>
      <h1>Please if you dont have account registre her</h1>
      <div>
        <form onSubmit={registrehundl}>
            <label>username :</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value) } required />
            <label>Password :</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value) } required />
            <button type="submit">Registre</button>
        </form>
      </div>
    </div>
  );
}

