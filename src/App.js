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

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
    const [curUser, setCurUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user);
            setCurUser(user);
        });
    }, []);

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
                        <form className="form">
                            <input
                                type="text"
                                className="input"
                                placeholder="Hi everyone, I'm..."
                            />
                            <button className="btn btn--submit">Send</button>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}
