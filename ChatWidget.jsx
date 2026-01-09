import { useState } from "react";
import robotIcon from "./assets/Robot icon.png";

const API_URL = "http://192.168.2.232:8000/chat";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! Ask me about your referral status." }
    ]);
    const [input, setInput] = useState("");
    const [context, setContext] = useState(null);

    async function sendMessage() {
        if (!input.trim()) return;

        setMessages(m => [...m, { from: "user", text: input }]);

        const payload = {
            message: input,
            employee_id: "EMP123",
            ...(context && { context })
        };

        setInput("");

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            setMessages(m => [...m, { from: "bot", text: data.reply }]);
            setContext({ state: data.state, ...data.context });

        } catch (e) {
            setMessages(m => [...m, { from: "bot", text: "Server error." }]);
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    borderRadius: "50%",
                    outline: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                    padding: 0,
                    zIndex: 1000,
                    overflow: "hidden"
                }}
            >
                <img src={robotIcon} alt="Chat" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </button>
        );
    }

    return (
        <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 300,
            height: 380,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ padding: 10, fontWeight: "bold" }}>
                InfoScout Chat
                <span style={{ float: "right", cursor: "pointer" }} onClick={() => setOpen(false)}>✕</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.from === "bot" ? "left" : "right", marginBottom: 6 }}>
                        <span style={{
                            display: "inline-block",
                            padding: "6px 8px",
                            background: m.from === "bot" ? "#f3f4f6" : "#4f46e5",
                            color: m.from === "bot" ? "#000" : "#fff",
                            borderRadius: 6
                        }}>
                            {m.text}
                        </span>
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type here…"
                style={{ border: "none", borderTop: "1px solid #ddd", padding: 10 }}
            />
        </div>
    );
}
