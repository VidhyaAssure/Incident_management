// App.js
import React, { useState } from "react";
import { customers } from "./data";
import "./App.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import emailjs from "emailjs-com";

// 🎨 Header
const Header = () => (
  <header className="dashboard-header">
    <div className="header-content">
      <div className="logo">
        <div className="logo-icon">🛡</div>
        <div className="logo-text">
          <h1>TPIR</h1>
          <span>Incident Response Platform</span>
        </div>
      </div>
    </div>
  </header>
);

// 🎨 Card Wrapper
const Card = ({ children, className = "", title, icon }) => (
  <div className={`card ${className}`}>
    {title && (
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
    )}
    <div className="card-content">{children}</div>
  </div>
);

// 🎨 Select Input
const SelectInput = ({ label, value, onChange, options, placeholder, icon }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      <select className="modern-select" value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="select-arrow">▼</span>
    </div>
  </div>
);

// 🎨 Email Chips
const Chip = ({ text }) => (
  <div className="email-chip">
    <span className="email-text">{text}</span>
  </div>
);

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("email");

  const [emailDraft, setEmailDraft] = useState({ to: "", subject: "", body: "" });
  const [smsDraft, setSmsDraft] = useState({ to: "", body: "" });

  // --- dropdown handlers ---
  const handleCustomerChange = (e) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer);
    setSelectedGroup(null);
    setEmailDraft({ to: "", subject: "", body: "" });
    setSmsDraft({ to: "", body: "" });
  };

  const handleGroupChange = (e) => {
    const groupId = parseInt(e.target.value);
    const group = selectedCustomer.vendorGroups.find((g) => g.id === groupId);
    setSelectedGroup(group);
    setEmailDraft({
      ...emailDraft,
      to: group.emails.join(", "),
    });
    setSmsDraft({
      ...smsDraft,
      to: group.phones.join(", "),
    });
  };

  const handleDraftChange = (type, field, value) => {
    if (type === "email") setEmailDraft({ ...emailDraft, [field]: value });
    else setSmsDraft({ ...smsDraft, [field]: value });
  };

  // --- Quill Config ---
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };
  const quillFormats = ["header", "bold", "italic", "underline", "align", "list", "bullet", "link"];

  // --- Email Send ---
  const handleSendEmail = () => {
    if (!emailDraft.to || !emailDraft.subject || !emailDraft.body) {
      alert("Please fill all email fields!");
      return;
    }

    const params = {
      to_email: emailDraft.to,
      subject: emailDraft.subject,
      message: emailDraft.body,
    };

    emailjs
      .send("service_jfxtlcr", "template_om2tjfy", params, "y_Fxj6-d0d9Um4_JL")
      .then(
        () => alert("✅ Email sent successfully!"),
        (err) => alert("❌ Email failed: " + err.text)
      );
  };

  // --- SMS Send ---
  const handleSendSMS = async () => {
    if (!smsDraft.to || !smsDraft.body) {
      alert("Please fill all SMS fields!");
      return;
    }

    const numbers = smsDraft.to.split(",").map((n) => n.trim());
    try {
      for (const number of numbers) {
        await fetch("https://incident-management-backend.onrender.com/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: number, message: smsDraft.body }),
        });
      }
      alert("✅ SMS sent successfully!");
    } catch (err) {
      alert("❌ SMS failed to send");
      console.error(err);
    }
  };

  // --- Dropdown Options ---
  const customerOptions = customers.map((c) => ({ value: c.id, label: c.name }));
  const groupOptions = selectedCustomer
    ? selectedCustomer.vendorGroups.map((g) => ({ value: g.id, label: g.name }))
    : [];

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-grid">
        {/* LEFT PANEL */}
        <div className="grid-column">
          <Card title="Customer Selection" className="selection-card">
            <SelectInput
              label="Select Customer"
              value={selectedCustomer?.id || ""}
              onChange={handleCustomerChange}
              options={customerOptions}
              placeholder="Choose a customer..."
              icon="👥"
            />
          </Card>

          {selectedCustomer && (
            <Card title="Vendor Group" className="selection-card">
              <SelectInput
                label="Select Vendor Group"
                value={selectedGroup?.id || ""}
                onChange={handleGroupChange}
                options={groupOptions}
                placeholder="Choose a vendor group..."
                icon="🔗"
              />
            </Card>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="grid-column">
          <Card title="Compose Incident Message" icon="✍️" className="composer-card">
            {/* Tab Header */}
            <div className="tab-container">
              <div
                className={`tab ${activeTab === "email" ? "active" : ""}`}
                onClick={() => setActiveTab("email")}
              >
                ✉️ Email
              </div>
              <div
                className={`tab ${activeTab === "sms" ? "active" : ""}`}
                onClick={() => setActiveTab("sms")}
              >
                📱 SMS
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "email" && (
                <>
                  <div className="form-group">
                    <p className="message_tool">Email sent via EmailJS</p>
                    <label className="input-label">To</label>
                    <input
                      type="text"
                      className="modern-input"
                      value={emailDraft.to}
                      readOnly
                      placeholder="Select a vendor group first..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Subject</label>
                    <input
                      type="text"
                      className="modern-input"
                      value={emailDraft.subject}
                      onChange={(e) => handleDraftChange("email", "subject", e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Message</label>
                    <ReactQuill
                      theme="snow"
                      value={emailDraft.body}
                      onChange={(value) => handleDraftChange("email", "body", value)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Describe the incident and required actions..."
                    />
                  </div>

                  <div className="action-buttons">
                    <button className="btn-primary" onClick={handleSendEmail}>
                      🚀 Send Email
                    </button>
                  </div>
                </>
              )}

              {activeTab === "sms" && (
                <>
                 <p className="message_tool">SMS sent via Twilio</p>
                  <div className="form-group">
                    <label className="input-label">To</label>
                    <input
                      type="text"
                      className="modern-input"
                      value={smsDraft.to}
                      readOnly
                      placeholder="Select a vendor group first..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Message</label>
                    <textarea
                      className="modern-input"
                      rows="4"
                      value={smsDraft.body}
                      onChange={(e) => handleDraftChange("sms", "body", e.target.value)}
                      placeholder="Type your SMS message..."
                    />
                  </div>

                  <div className="action-buttons">
                    <button className="btn-primary" onClick={handleSendSMS}>
                      🚀 Send SMS
                    </button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
