import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100";

  const activeClass =
    "px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white";

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between px-4 py-5">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          MyReactApp
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Left group: navigation links */}
          <div className="flex gap-2">
            <Link
              to="/"
              className={location.pathname === "/" ? activeClass : linkClass}
            >
              Home
            </Link>

            {!user && (
              <Link
                to="/register"
                className={
                  location.pathname === "/register" ? activeClass : linkClass
                }
              >
                Register
              </Link>
            )}

            <div className="border" />

            {!user && (
              <Link
                to="/login"
                className={
                  location.pathname === "/login" ? activeClass : linkClass
                }
              >
                Login
              </Link>
            )}

            {/* Right group: user info / logout */}
            {user && (
              <div>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}