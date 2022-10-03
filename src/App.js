import React from "react";
import { IoLogoFirebase, IoLogoReact } from "react-icons/io5";

export default function App() {
    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <div className="logo__box logo__box--react">
                        <IoLogoReact className="logo__icon logo__icon--react" />
                    </div>
                    <div className="logo__box logo__box--firebase">
                        <IoLogoFirebase className="logo__icon logo__icon--firebase" />
                    </div>
                </div>
                <button className="btn btn--login">Log In</button>
            </header>

            <main className="main">
                <section className="messages"></section>
                <form className="form">
                    <input type="text" className="input" />
                    <button className="btn btn--submit">Send</button>
                </form>
            </main>
        </div>
    );
}
