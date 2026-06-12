import { useState } from "react";

function Login({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const handleStart = () => {
    const newErrors = {};

    // Name Validation: Must not be empty, must be typed
    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email Validation: Must be typed and formatted correctly
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Validation: Must be typed and be a valid 10-digit number
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    localStorage.setItem(
      "candidate",
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
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
        fontFamily: "'Inter', system-ui, sans-serif",
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
            fontSize: "28px",
            fontWeight: "800",
          }}
        >
          Mock Interview Portal
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6B7280",
            marginBottom: "25px",
            fontSize: "15px",
          }}
        >
          Enter your details to begin the interview
        </p>

        {/* Name Input */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: errors.name ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {errors.name && (
            <p style={{ color: "#EF4444", fontSize: "12px", margin: "5px 0 0 5px", textAlign: "left" }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: errors.email ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {errors.email && (
            <p style={{ color: "#EF4444", fontSize: "12px", margin: "5px 0 0 5px", textAlign: "left" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Input */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: errors.phone ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {errors.phone && (
            <p style={{ color: "#EF4444", fontSize: "12px", margin: "5px 0 0 5px", textAlign: "left" }}>
              {errors.phone}
            </p>
          )}
        </div>

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
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#4338CA")}
          onMouseLeave={(e) => (e.target.style.background = "#4F46E5")}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default Login;