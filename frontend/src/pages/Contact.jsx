import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import DOMPurify from 'dompurify';
import '../styles/Contact.css';
import API_BASE_URL from '../apiConfig';
import.meta.env.VITE_API_URL;

// Helper to strip CR/LF to prevent header injection
const stripNewlines = s => s.replace(/[\r\n]+/g, ' ');

function ContactForm() {
  const [state, handleSubmit] = useForm("xrbpjnkl");
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (state.succeeded) {
    return <p className="success-message">Thanks for your message! We'll be in touch soon.</p>;
  }

  const onSubmit = e => {
    e.preventDefault();

    // Trim and limit length
    const cleanName = stripNewlines(name.trim()).slice(0, 200);
    const cleanSubject = stripNewlines(subject.trim()).slice(0, 200);
    const cleanEmail = email.trim().slice(0, 254);
    // Optionally sanitize message HTML (here we allow plain text only)
    const cleanMessage = DOMPurify.sanitize(message.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    }).slice(0, 1000);

    // Overwrite form fields before submission
    e.target.name.value = cleanName;
    e.target.subject.value = cleanSubject;
    e.target.email.value = cleanEmail;
    e.target.message.value = cleanMessage;

    handleSubmit(e);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="contact-form">
        <h2>Contact Us</h2>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={200}
          pattern="[^\r\n]*"
          title="Please avoid line breaks"
        />

        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          name="subject"
          required
          value={subject}
          onChange={e => setSubject(e.target.value)}
          maxLength={200}
          pattern="[^\r\n]*"
          title="Please avoid line breaks"
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={254}
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="message">Your Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={1000}
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        {/* Honeypot field to trap bots */}
        <input
          type="text"
          name="_gotcha"
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />

        <button type="submit" disabled={state.submitting}>
          Send
        </button>
      </form>

      {/* Embedded Google Map and Contact Info */}
      <div className="map-container">
        <iframe
          title="Galleri Edwin Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.298303772576!2d10.67259227732024!3d59.9271921630218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416db04a3a56c1%3A0x91ae0932b9673b53!2sHoffsveien%2022%2C%200275%20Oslo!5e0!3m2!1sno!2sno!4v1744623576637!5m2!1sno!2sno"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <div className="map-info">
          <h3>galleri edwin</h3>
          <p><a href="mailto:edwin@galleriedwin.com">edwin@galleriedwin.com</a></p>
          <p>Hoffsveien 22<br />0275 Oslo</p>
        </div>
      </div>
    </>
  );
}

export default ContactForm;