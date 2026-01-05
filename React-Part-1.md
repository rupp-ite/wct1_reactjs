Lab 11: ReactJS – Part 1
=
---

### Project code structure
```
my-react-app/
|── src/
|     |── assets/
|            |── profile.jpg
|            |── stem.jpg
|     |── components/
|            |── Footer.jsx 
|            |── Navbar.jsx 
|     |── pages/
|            |── HomePage.jsx 
|            |── LoginPage.jsx
|            |── Register.jsx
│     |── App.css     
│     |── App.jsx    
│     |── index.css         
│     |── main.jsx        
|── public/
|── package.json
└── vite.config.js
```


---

### 1. Use Tailwind framework for CSS Style

#### 1.1 Install Tailwind CSS
Install Tailwind CSS and its Vite plugin.

`npm install tailwindcss @tailwindcss/vite`

#### 1.2 Configure Tailwind in `vite.config.js`
Add the Tailwind plugin to the Vite configuration.


```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
})
```

#### 1.3 Import Tailwind in global CSS
Make sure Tailwind is imported in `src/index.css` and `src/App.css`.

```@import "tailwindcss"```




---

### 2. Create Components

#### 2.1 Create `HomePage.jsx` in `src/pages/`
Build a simple Home page with an image and text.


```

import profilePic from '../assets/profile.jpg';
import StemBuilding from '../assets/stem.jpeg'

export default function HomePage() {
  return (
    <main className=" flex-1 flex-col flex items-center justify-center space-y-6">

      <section className=" flex text-start px-4 space-x-4">
        <img 
            src={profilePic}
            alt="Profile"
            className="w-40 h-40 rounded-full shadow-lg border-4 border-white mb-6"
        />
        <div className='space-y-4'>
          <h1 className="text-4xl md:text-5xl font-bold ">
            Welcome to My React Site
          </h1>
          <p className="text-lg md:text-xl ">
            Hello! I'm learning <span className="font-semibold text-blue-600">React</span>.
          </p>
        </div>
      </section>

      <img 
          src={StemBuilding}
          alt="StemBuilding"
          className="max-w-3xl"
      />

    </main>
  );
}

```
#### 2.2 Use `HomePage` in `src/App.jsx`
Render the HomePage component inside App.

```
import { HomePage } from './pages/HomePage';

  function App() {
  
    return(
      <>
        <HomePage />
      </>
    
    );
  }

export default App;
```

### 3. Layout Components (Navbar & Footer)

#### 3.1 Create `Navbar.jsx` component in `src/components/`
Build a navigation bar with Home, Register, and Login links.

```
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

```

#### 3.2 Create `Footer.jsx` component `src/components/`
Add a simple footer with a copyright message.


```
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
```

### 4. Install react-router `npm install react-router-dom`

#### Add ReactDOM in `src/main.jsx`
```
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```



### 5. Use Navbar, HomePage, Footer in `App.jsx`
Combine Navbar, HomePage, and Footer in the main layout.

    
```
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
```

### 6. Create pages `LoginPage.jsx` and `RegisterPage.jsx` in `src/pages/`

#### 6.1 Create file `LoginPage.jsx`
```
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section className="flex-1 flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Login to your account
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                       hover:bg-blue-700 active:scale-[0.99]
                       transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
```
#### 6.1 Create file `RegisterPage.jsx`

```
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <section className="flex-1 flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        {/* Form */}
        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                       hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

```

---

### 7. React Router Setup

#### 7.1 Wrap `App` with `BrowserRouter` in `src/main.jsx`
Enable routing by wrapping your App component.


```
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

#### 7.2 Define routes in `src/App.jsx`
Map paths (`/`, `/register`, `/login`) to page components.
```
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
```

---
