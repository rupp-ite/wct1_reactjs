import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100";
  const activeClass =
    "px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white";

  return (
    <header className="bg-white shadow">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">

            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-blue-600">
            MyReactApp
            </Link>

            {/* Links */}
            <div className="flex gap-2">

                <Link
                    to="/"
                    className={location.pathname === "/" ? activeClass : linkClass}
                >
                    Home
                </Link>

                <Link
                    to="/register"
                    className={location.pathname === "/register" ? activeClass : linkClass}
                >
                    Register
                </Link>

                <div className="border" />

                <Link
                    to="/login"
                    className={location.pathname === "/login" ? activeClass : linkClass}
                >
                    Login
                </Link>
            
            </div>
        </nav>
    </header>
  );
}