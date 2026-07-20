// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Projects Overview", path: "#" },
    { name: "User Management", path: "#" },
    { name: "Analytics Logs", path: "#" },
    { name: "System Settings", path: "#" },
  ];

  const linkClass = "flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";
  const activeClass = "flex items-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm transition-colors";

  return (
    <>
      {/* Mobile-only Background Overlay Backdrop Mask (Dismisses layout panel when tapping outside) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggleable Drawer Viewport Container Panel */}
      <aside 
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Menu Category Info Text */}
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Admin Management
          </div>

          {/* Core App Navigation Link Group */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                // Only trigger automatic close on small touch devices
                onClick={() => {
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={location.pathname === item.path ? activeClass : linkClass}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Details Row */}
        <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm select-none">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="truncate max-w-[160px]">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-400 font-medium">System Administrator</p>
          </div>
        </div>
      </aside>
    </>
  );
}