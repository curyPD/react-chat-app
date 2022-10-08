import React, { useState, useEffect, useRef } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { app } from "./firebase";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { getDatabase, ref, set, push, onValue } from "firebase/database";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export default function App() {
    const [curUser, setCurUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const olRef = useRef(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurUser(user);
        });
        onValue(ref(database, "messages"), (snapshot) => {
            const futureState = [];
            snapshot.forEach((child) => {
                const key = child.key;
                const value = child.val();
                const {
                    message,
                    sender: { senderId, senderName, senderPhotoURL },
                } = value;
                futureState.push({
                    key,
                    text: message,
                    userId: senderId,
                    name: senderName,
                    photoURL: senderPhotoURL,
                });
            });
            setMessages(futureState);
        });
    }, []);

    useEffect(() => {
        olRef.current?.lastElementChild?.scrollIntoView({
            block: "start",
            inline: "nearest",
        });
    }, [messages]);

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!input) return;
        setInput("");
        const senderName = curUser.displayName;
        const senderPhotoURL = curUser.photoURL;
        const senderId = curUser.uid;
        writeMessageData(input, { senderName, senderPhotoURL, senderId });
    }

    function writeMessageData(message, sender) {
        const messageListRef = ref(database, "messages");
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
            message,
            sender,
        });
    }

    async function logIn() {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        }
    }

    const messageItems = messages.map((message) => (
        <li
            key={message.key}
            className={`message ${
                message.userId === curUser?.uid ? "message--left" : ""
            }`}
        >
            <img
                className="message__picture"
                src={message.photoURL}
                alt={`${message.name}`}
            />
            <p className="message__text">{message.text}</p>
        </li>
    ));

    return (
        <>
            <header className="header">
                <div className="logo">
                    <IoChatbubbleEllipses className="logo__icon" />
                    <h1 className="logo__text">ChatApp</h1>
                </div>
                <button
                    className="btn btn--login"
                    onClick={() => {
                        if (curUser) {
                            signOut(auth);
                            return;
                        } else if (!curUser) {
                            logIn();
                            return;
                        }
                    }}
                >
                    {curUser ? "Sign Out" : "Log In"}
                </button>
            </header>

            {curUser ? (
                <main className="main">
                    <section className="messages-section">
                        <ol className="messages" ref={olRef}>
                            {messageItems}
                        </ol>
                    </section>

                    <section className="form-section">
                        <form className="form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Hi everyone, I'm..."
                                name="input"
                                value={input}
                                onChange={handleChange}
                            />
                            <button className="btn btn--submit">Send</button>
                        </form>
                    </section>
                </main>
            ) : (
                <div className="popup">
                    <p className="popup__text">Log in to see the messages</p>
                    <button className="btn btn--big" onClick={() => logIn()}>
                        Log In
                    </button>
                </div>
            )}
        </>
    );
}
