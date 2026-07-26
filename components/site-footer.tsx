export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        &copy; {new Date().getFullYear()} Zack Sawyer
        <span className="site-footer--sep">&middot;</span>
        Made with maple syrup from Vermont
      </p>
    </footer>
  );
}
