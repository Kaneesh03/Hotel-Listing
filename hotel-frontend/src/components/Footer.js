import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-col footer-brand-col">
          <h3 className="footer-brand">Namlatic</h3>
          <p className="footer-desc">
            Discover comfort and exceptional hospitality across top travel destinations.
          </p>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Namlatic Inc. All rights reserved.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-links">
            <li><span className="footer-link">About Us</span></li>
            <li><span className="footer-link">Careers</span></li>
            <li><span className="footer-link">Press & Media</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-links">
            <li><span className="footer-link">Help Center</span></li>
            <li><span className="footer-link">Cancellation Policy</span></li>
            <li><span className="footer-link">Contact Support</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Information</h4>
          <ul className="footer-links">
            <li><span className="footer-link">Terms of Service</span></li>
            <li><span className="footer-link">Privacy Policy</span></li>
            <li><span className="footer-link">Security</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
export default Footer;