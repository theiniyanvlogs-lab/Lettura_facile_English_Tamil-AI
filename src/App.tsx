import { useState } from "react";

export default function App() {

  const [message,setMessage] = useState("");
  const [reply,setReply] = useState("");

  async function sendMessage(){

    const res = await fetch("/api/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({message})
    });

    const data = await res.json();
    setReply(data.reply);

  }

  return (
    <div style={{padding:"40px"}}>

      <h1>Lettura Facile AI</h1>

      <input
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={sendMessage}>Send</button>

      <p>{reply}</p>

    </div>
  );

}
