 import React, { useState } from "react";
import "./style.css";

const conversations = [
  { name: "Sara Benhaddou", msg: "J’ai peut-être trouvé votre sac...", time: "14:32" },
  { name: "Karim Moussaoui", msg: "Merci pour le signalement !", time: "Hier" },
  { name: "Nadia El Fassi", msg: "Les clés sont au commissariat", time: "Lun" },
  { name: "Youssef Alami", msg: "D’accord, je vous contacte", time: "28 Fév" }
];

export default function ChatPage() {

  const [messages, setMessages] = useState([
    { sender: "other", text: "Un sac à dos noir avec des fermetures orange.", time: "14:22" },
    { sender: "me", text: "C’est exactement le mien !", time: "14:25" }
  ]);

  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  const sendMessage = () => {
    if (!input && !image) return;

    setMessages([
      ...messages,
      { sender: "me", text: input, image: image, time: "Maintenant" }
    ]);

    setInput("");
    setImage(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
  <div className="page">

    {/* MENU SIMPLE */}
    <div className="navbar">
      <div className="nav-left">
        
      </div>
<div className="navbar">

  <div className="nav-center">
    <a href="home">Accueil</a>
    <a href="signalement">signalement</a>
    <a href="">Objets trouvés</a>
    <a href=" home">Rechercher</a>
    <a href="moncompte">Mon compte</a>
  </div>

  {/* utilisateur connecté */}
  <div className="user-box">
    <div className="avatar">Y</div>
  </div>

</div>
      
    </div>

    {/* CHAT */}
    <div className="chat-layout">

      <div className="left-empty"></div>

      <div className="chat-list">
        <h3 className="title">Messages</h3>

        <input
          className="search"
          placeholder="Rechercher utilisateurs..."
        />

        {conversations.map((c, i) => (
          <div className="chat-item" key={i}>
            <div className="avatar">{c.name[0]}</div>

            <div className="chat-info">
              <h4>{c.name}</h4>
              <p>{c.msg}</p>
            </div>

            <span className="time">{c.time}</span>
          </div>
        ))}
      </div>

      <div className="chat-box">

        <div className="chat-top">
          <div>
            <h3>Sara Benhaddou</h3>
            <span className="online">● En ligne</span>
          </div>

          <div className="icons">
            <button>💬</button>
            <button>⋮</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div className={m.sender === "me" ? "msg me" : "msg"} key={i}>
              {m.text && <p>{m.text}</p>}
              {m.image && <img src={m.image} alt="" className="img-msg" />}
              <span>{m.time}</span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <label className="upload">
            📎
            <input type="file" hidden onChange={handleImage} />
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrire un message..."
          />

          <button onClick={sendMessage}>➤</button>
        </div>

      </div>
    </div>
  </div>
);
}