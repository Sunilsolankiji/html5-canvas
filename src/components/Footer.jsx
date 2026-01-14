import '../styles/footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-credit">
          Designed with <span className="heart">❤️</span> by{' '}
          <span className="author-name">Sunil Solanki</span>
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Canvas Playground. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

