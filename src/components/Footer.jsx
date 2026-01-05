export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
        <p className="text-sm ">
          © {new Date().getFullYear()} MyReactSite. All rights reserved.
        </p>
      </div>
    </footer>
  );
}