import React from 'react';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Replace with actual company info
  const companyName = 'Industrial Zone Rental Platform';
  const phoneNumber = '+84 (0) 123 456 789';
  const phoneHref = 'tel:+84-123-456-789';
  const email = 'contact@example.com';
  const emailHref = `mailto:${email}`;

  return (
    <footer className="footer-container" role="contentinfo" aria-label="Site footer">
      <div className="footer-content">
        <h3 className="footer-title">{companyName}</h3>
        <p className="footer-description">
          Premium industrial zone rental management platform
          with smart approvals and real-time notifications.
        </p>
      </div>

      <div className="footer-separator"></div>

      <div className="footer-contact">
        <a href={phoneHref} className="footer-contact-link" title="Call us">
          <span>📞</span>
          <span>{phoneNumber}</span>
        </a>
        <a href={emailHref} className="footer-contact-link" title="Email us">
          <span>✉️</span>
          <span>{email}</span>
        </a>
      </div>

      <p className="footer-copyright">
        &copy; {currentYear} {companyName}. All rights reserved.
      </p>
    </footer>
  );
}
