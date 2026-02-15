import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Safety net to catch crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 20,
            color: "#ff5555",
            background: "#111",
            height: "100vh",
            fontFamily: "monospace",
          }}
        >
          <h1 style={{ fontSize: "2rem" }}>SYSTEM FAILURE</h1>
          <p>The OS crashed. Error Log:</p>
          <pre
            style={{
              background: "#222",
              padding: 15,
              color: "#fff",
              overflow: "auto",
            }}
          >
            {this.state.error.toString()}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: 20,
              padding: 15,
              background: "red",
              color: "white",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            HARD RESET (CLEAR DATA)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
