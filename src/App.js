import React, { useState, useEffect } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { app } from "./firebase";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase();

export default function App() {
    const [curUser, setCurUser] = useState(null);
    // const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user);
            setCurUser(user);
        });
        /*const dbRef = ref(database, "messages");
        onValue(dbRef, (snapshot) => {
            // const arr = [];
            snapshot.forEach(async (childSnapshot) => {
                const childKey = childSnapshot.key;
                const { sender, message } = childSnapshot.val();
                let senderName, senderPhotoURL;
                const userSnapshot = await get(
                    ref(database, `users/${sender}`)
                );
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    senderName = userData.userName;
                    senderPhotoURL = userData.photoURL;
                } else {
                    senderName = "Unknown user";
                }
                console.log(message, senderName, senderPhotoURL, childKey);
                // arr.push({ message, senderName, senderPhotoURL, childKey });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { message, senderName, senderPhotoURL, childKey },
                ]);
            });
            // console.log(arr);
            // setMessages(arr);
        });*/
    }, []);

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const message = input;
        const sender = curUser.uid;
        setInput("");
        writeMessageData(message, sender);
    }

    function writeMessageData(message, sender) {
        const messageListRef = ref(database, "messages");
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
            message,
            sender,
        });
    }

    function writeUserData(uid, userName, photoURL) {
        set(ref(database, `users/${uid}`), {
            userName,
            photoURL,
        });
    }

    async function logIn() {
        try {
            const result = await signInWithPopup(auth, provider);
            const { displayName, photoURL, uid } = result.user;
            writeUserData(uid, displayName, photoURL);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        }
    }

    return (
        <div className="container">
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

            <main className="main">
                <section className="messages-section"></section>
                {curUser && (
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
                )}
            </main>
        </div>
    );
}
