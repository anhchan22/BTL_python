import React from 'react';
import { Phone, Mail } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Replace with actual company info
  const companyName = 'Hệ thống cho thuê Khu công nghiệp';
  const phoneNumber = '+84 (0) 834 471 918';
  const phoneHref = 'tel:+84-123-456-789';
  const email = 'trananh22052005@gmail.com';
  const emailHref = `mailto:${email}`;

  return (
    <footer className="footer-container" role="contentinfo" aria-label="Site footer">
      <div className="footer-content">
        <h3 className="footer-title">{companyName}</h3>
        <p className="footer-description">
          Nền tảng quản lý cho thuê khu công nghiệp cao cấp,
          tích hợp phê duyệt thông minh và thông báo theo thời gian thực.
        </p>
      </div>

      <div className="footer-separator"></div>

      <div className="footer-contact">
        <a href={phoneHref} className="footer-contact-link" title="Call us">
          <Phone size={18} strokeWidth={2} />
          <span>{phoneNumber}</span>
        </a>
        <a href={emailHref} className="footer-contact-link" title="Email us">
          <Mail size={18} strokeWidth={2} />
          <span>{email}</span>
        </a>
      </div>

      <p className="footer-copyright">
        &copy; {currentYear} {companyName}. All rights reserved.
      </p>
    </footer>
  );
}
