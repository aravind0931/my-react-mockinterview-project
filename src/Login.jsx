import { useState } from "react";

function Login({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleStart = () => {
    if (!name || !email || !phone) {
      alert("Please fill all details");
      return;
    }

    localStorage.setItem(
      "candidate",
      JSON.stringify({
        name,
        email,
        phone,
      })
    );

    onStart();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "35px",
          borderRadius: "20px",
          width: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Mock Interview Portal
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6B7280",
            marginBottom: "25px",
          }}
        >
          Enter your details to begin the interview
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
          }}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
          }}
        />

        <button
          onClick={handleStart}
          style={{
            width: "100%",
            padding: "14px",
            background: "#4F46E5",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default Login;