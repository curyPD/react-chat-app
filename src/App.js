import React from "react";
import {
    IoLogoFirebase,
    IoLogoReact,
    IoChatbubbleEllipses,
} from "react-icons/io5";

export default function App() {
    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    {/* <div className="logo__box logo__box--react">
                        <IoLogoReact className="logo__icon logo__icon--react" />
                    </div>
                    <div className="logo__box logo__box--firebase">
                        <IoLogoFirebase className="logo__icon logo__icon--firebase" />
                    </div> */}

                    <IoChatbubbleEllipses className="logo__icon" />
                    <h1 className="logo__text">ChatApp</h1>
                </div>
                <button className="btn btn--login">Log In</button>
            </header>

            <main className="main">
                <section className="messages-section"></section>
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
            </main>
        </div>
    );
}
