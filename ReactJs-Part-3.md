Lab – ReactJS part 3
=  
## My Blog Website using React JS and Firebase

### 1. Project File structure

    my-app/
    ├── .env.local
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           <-- Header bar ("AdminPortal" brand & toggle)
    │   │   ├── Sidebar.jsx          <-- Offcanvas drawer menu (Admin links only)
    │   │   ├── Footer.jsx           <-- Site footer
    │   │   ├── DashboardComponents.jsx <-- Dynamic StatCards & Recent Posts Table
    │   │   ├── PostForm.jsx         <-- Rich Text HTML Form (URL-based images)
    │   │   └── PostList.jsx         <-- Post table with "+ Create New Post" button
    │   ├── lib/
    │   │   └── firebaseClient.js    <-- Firebase Auth & Firestore client
    │   ├── pages/
    │   │   ├── HomePage.jsx         <-- Public blog card list (/)
    │   │   ├── PostDetailPage.jsx   <-- Full post reader view (/post/:id)
    │   │   ├── AdminPortalPage.jsx  <-- AdminPortal main dashboard (/admin)
    │   │   ├── PostsManager.jsx     <-- Toggles between Table List & Form (/admin/posts)
    │   │   ├── LoginPage.jsx        <-- Login page
    │   │   └── RegisterPage.jsx     <-- Registration page
    │   ├── App.jsx                  <-- Routing & Global Auth State
    │   ├── main.jsx                 <-- React entry point with BrowserRouter
    │   └── index.css

### 2. Terminal Setup & Installation
Run this command in your project terminal to install the necessary packages

    npm install react-router-dom firebase react-quill-new

### 3. Environment Variables (.env.local)
    VITE_FIREBASE_API_KEY="your_api_key_here"
    VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    VITE_FIREBASE_APP_ID="your_app_id"
### 4. Firestore Production Security Rules
In your **Firebase Console** $\rightarrow$ **Firestore Database** $\rightarrow$ **Rules**, publish these security rules:
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {
        match /posts/{postId} {
          allow read: if true;
          allow write: if request.auth != null;
        }
      }
    }

### 5. Complete Source Code
##### src/lib/firebaseClient.js

    // src/lib/firebaseClient.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);

##### src/main.jsx

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

##### src/App.jsx

    import { useEffect, useState } from "react";
    import { Routes, Route, Navigate } from "react-router-dom";
    import { auth } from "./lib/firebaseClient";
    import { onAuthStateChanged, signOut } from "firebase/auth";
    import Navbar from "./components/Navbar";
    import Sidebar from "./components/Sidebar";
    import Footer from "./components/Footer";
    import HomePage from "./pages/HomePage";
    import PostDetailPage from "./pages/PostDetailPage";
    import AdminPortalPage from "./pages/AdminPortalPage";
    import PostsManager from "./pages/PostsManager";
    import LoginPage from "./pages/LoginPage";
    import RegisterPage from "./pages/RegisterPage";

    export default function App() {
      const [user, setUser] = useState(null);
      const [checkingSession, setCheckingSession] = useState(true);
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser || null);
          setCheckingSession(false);
          setIsSidebarOpen(!!currentUser);
        });
        return () => unsubscribe();
      }, []);

      async function handleLogout() {
        try {
          await signOut(auth);
          setIsSidebarOpen(false);
        } catch (err) {
          console.error("Error signing out:", err);
        }
      }

      if (checkingSession) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-600 animate-pulse font-medium">Checking session...</p>
          </div>
        );
      }

      return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />

          <div className="flex flex-1 pt-16 relative">
            {user && (
              <Sidebar 
                user={user} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
              />
            )}

            <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                
                {/* Admin Portal Protected Routes */}
                <Route 
                  path="/admin" 
                  element={user ? <AdminPortalPage user={user} /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/posts" 
                  element={user ? <PostsManager user={user} /> : <Navigate to="/login" replace />} 
                />

                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={!user ? <LoginPage /> : <Navigate to="/admin" replace />} 
                />
                <Route 
                  path="/register" 
                  element={!user ? <RegisterPage /> : <Navigate to="/admin" replace />} 
                />
              </Routes>
            </main>
          </div>

          <div className={`transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
            <Footer />
          </div>
        </div>
      );
    }
##### src/components/Navbar.jsx

    import { Link } from "react-router-dom";

    export default function Navbar({ user, onLogout, isSidebarOpen, setIsSidebarOpen }) {
      return (
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-50">
          <nav className="h-full px-4 flex items-center justify-between">
            
            {/* Brand Logo links to /admin if logged in, or / if guest */}
            <div className="flex items-center gap-3">
              <Link 
                to={user ? "/admin" : "/"} 
                className="text-xl font-bold text-blue-600 tracking-tight"
              >
                {user ? "Admin Portal" : "My Blog"}
              </Link>

              {user && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none"
                  aria-label="Toggle Sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isSidebarOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>

            {/* User Auth Controls */}
            <div className="flex items-center gap-4">
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link to="/register" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                    Register
                  </Link>
                  <Link to="/login" className="px-3 py-1.5 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                    Login
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </header>
      );
    }

##### src/components/Sidebar.jsx
    import { Link, useLocation } from "react-router-dom";

    export default function Sidebar({ user, isOpen, setIsOpen }) {
      const location = useLocation();

      // Public site removed from sidebar
      const menuItems = [
        { name: "Admin Portal", path: "/admin" },
        { name: "Manage Posts", path: "/admin/posts" },
      ];

      const linkClass = "flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";
      const activeClass = "flex items-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm transition-colors";

      return (
        <>
          {isOpen && (
            <div 
              className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          <aside 
            className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40 p-4 flex flex-col justify-between transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="space-y-6">
              <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Management
              </div>

              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
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

            <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm select-none">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate max-w-[160px]">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.email}</p>
                <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
              </div>
            </div>
          </aside>
        </>
      );
    }

##### src/components/PostForm.jsx

    import { useState, useEffect, useRef, useMemo } from "react";
    import ReactQuill from "react-quill-new";
    import "react-quill-new/dist/quill.snow.css";

    export default function PostForm({ editingPost, onSubmit, onCancel }) {
      const [title, setTitle] = useState("");
      const [content, setContent] = useState("");
      const quillRef = useRef(null);

      useEffect(() => {
        if (editingPost) {
          setTitle(editingPost.title || "");
          setContent(editingPost.content || "");
        } else {
          setTitle("");
          setContent("");
        }
      }, [editingPost]);

      const handleImageUrlPrompt = () => {
        const url = window.prompt("Enter the image URL (e.g., https://example.com/image.jpg):");
        if (!url) return;

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", url);
        editor.setSelection(range.index + 1);
      };

      const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
            handlers: {
              image: handleImageUrlPrompt,
            },
          },
        }),
        []
      );

      function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        onSubmit({ title, content });
        setTitle("");
        setContent("");
      }

      return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content (Rich Text)
              </label>

              <div className="bg-white rounded-lg border border-gray-300">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Write your blog post content here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingPost ? "Update Post" : "Publish Post"}
              </button>

              {editingPost && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
    }

##### src/components/PostList.jsx

    export default function PostList({ posts, loading, onCreateNew, onEdit, onDelete }) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden space-y-4">
          {/* Table Header with "+ Create New Post" Button */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Published Posts</h2>
              <span className="text-xs text-gray-500">{posts.length} Total Posts</span>
            </div>

            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Create New Post
            </button>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-gray-500 animate-pulse">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No blog posts found. Click above to create your first post!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Title</th>
                    <th className="px-6 py-3 text-left font-semibold">Author</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                      <td className="px-6 py-4 text-gray-500">{post.authorEmail}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => onEdit(post)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-semibold hover:bg-yellow-200 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => onDelete(post.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

##### src/components/DashboardComponents.jsx

    import { Link } from "react-router-dom";

    // Metric Display Card
    export function StatCard({ title, value, color = "text-blue-600", isText = false }) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`font-bold mt-2 ${isText ? "text-xl" : "text-3xl"} ${color}`}>
            {value}
          </p>
        </div>
      );
    }

    // Recent Posts Overview Table
    export function RecentPostsTable({ posts, loading }) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-800">Recent Blog Activity</h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/70 px-2 py-0.5 rounded">
              Live Data
            </span>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-gray-500 animate-pulse">Loading statistics...</p>
          ) : posts.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <p className="text-sm text-gray-500">No blog posts available in the system yet.</p>
              <Link to="/admin/posts" className="text-xs text-blue-600 font-semibold hover:underline">
                Create your first post →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Post Title</th>
                    <th className="px-6 py-3 text-left font-semibold">Author</th>
                    <th className="px-6 py-3 text-left font-semibold">Published Date</th>
                    <th className="px-6 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                      <td className="px-6 py-4 text-gray-500">{post.authorEmail}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Just now"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/admin/posts"
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }
##### src/components/Footer.jsx

    export default function Footer() {
      return (
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} My Blog. All rights reserved.
            </p>
          </div>
        </footer>
      );
    }
##### src/pages/HomePage.jsx (Public Card Feed at /)

    import { useState, useEffect } from "react";
    import { Link } from "react-router-dom";
    import { db } from "../lib/firebaseClient";
    import { collection, getDocs, query, orderBy } from "firebase/firestore";

    export default function HomePage() {
      const [posts, setPosts] = useState([]);
      const [loadingPosts, setLoadingPosts] = useState(true);

      useEffect(() => {
        async function fetchPublicPosts() {
          try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(fetchedPosts);
          } catch (error) {
            console.error("Error fetching public posts:", error);
          } finally {
            setLoadingPosts(false);
          }
        }

        fetchPublicPosts();
      }, []);

      // Helper to extract first image URL or plain text snippet from raw HTML
      const extractThumbnail = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const img = doc.querySelector("img");
        return img ? img.src : null;
      };

      const extractSnippet = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const text = doc.body.textContent || "";
        return text.length > 120 ? text.substring(0, 120) + "..." : text;
      };

      return (
        <div className="space-y-8 py-6 max-w-6xl mx-auto">
          <section className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome to Our Blog
            </h1>
            <p className="text-lg text-gray-600">
              Discover latest updates, news, and insights.
            </p>
          </section>

          {/* Post Grid View */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Latest Posts</h2>

            {loadingPosts ? (
              <p className="text-gray-500 animate-pulse">Loading blog posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">No blog posts published yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const thumbnail = extractThumbnail(post.content);
                  const snippet = extractSnippet(post.content);

                  return (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                      {/* Thumbnail Image */}
                      <div className="h-48 bg-gray-100 w-full overflow-hidden flex items-center justify-center">
                        {thumbnail ? (
                          <img src={thumbnail} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 font-semibold text-sm">No Image Preview</div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-3">{snippet}</p>
                        </div>

                        <div className="pt-2 border-t flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ""}
                          </span>

                          <Link 
                            to={`/post/${post.id}`} 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

##### src/pages/PostDetailPage.jsx (Public Detail View at /post/:id)

    // src/pages/PostDetailPage.jsx
    import { useState, useEffect } from "react";
    import { useParams, Link } from "react-router-dom";
    import { db } from "../lib/firebaseClient";
    import { doc, getDoc } from "firebase/firestore";

    export default function PostDetailPage() {
      const { id } = useParams();
      const [post, setPost] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function fetchPost() {
          try {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setPost({ id: docSnap.id, ...docSnap.data() });
            }
          } catch (error) {
            console.error("Error loading post:", error);
          } finally {
            setLoading(false);
          }
        }

        fetchPost();
      }, [id]);

      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-gray-500 animate-pulse font-medium">Loading post content...</p>
          </div>
        );
      }

      if (!post) {
        return (
          <div className="text-center py-12 space-y-4 bg-white rounded-xl border p-8 max-w-2xl mx-auto shadow-sm">
            <p className="text-lg font-semibold text-gray-800">Post Not Found</p>
            <p className="text-sm text-gray-500">The article you are looking for might have been deleted or moved.</p>
            <Link to="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              ← Back to Blog Home
            </Link>
          </div>
        );
      }

      return (
        <article className="max-w-4xl mx-auto my-6 p-6 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-8 overflow-hidden">
          {/* Navigation Header */}
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline gap-1">
              ← Back to All Posts
            </Link>
          </div>

          {/* Article Title & Metadata */}
          <div className="space-y-3 border-b border-gray-100 pb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight break-words leading-tight">
              {post.title}
            </h1>
            <div className="text-xs md:text-sm text-gray-500 flex flex-wrap justify-between items-center gap-2 pt-2">
              <span className="font-medium">Author: <strong className="text-gray-700">{post.authorEmail}</strong></span>
              {post.createdAt?.toDate && (
                <span>Published on {post.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              )}
            </div>
          </div>

          {/* Styled Article Content Body */}
          <div 
            className="
              text-gray-800 
              leading-relaxed 
              space-y-4 
              break-words 
              overflow-hidden
              [&_img]:max-w-full 
              [&_img]:h-auto 
              [&_img]:rounded-xl 
              [&_img]:my-6 
              [&_img]:shadow-md 
              [&_img]:mx-auto
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-5 [&_h2]:mb-2
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
              [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
              [&_a]:text-blue-600 [&_a]:underline
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      );
    }

##### src/pages/AdminPortalPage.jsx (Admin Dashboard at /admin)

    import { useState, useEffect } from "react";
    import { Link } from "react-router-dom";
    import { db } from "../lib/firebaseClient";
    import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
    import { StatCard, RecentPostsTable } from "../components/DashboardComponents";

    export default function AdminPortalPage({ user }) {
      const [stats, setStats] = useState({
        totalPosts: 0,
        myPosts: 0,
        postsWithImages: 0,
        lastPostDate: "N/A",
      });
      const [recentPosts, setRecentPosts] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function fetchAdminStats() {
          setLoading(true);
          try {
            // Fetch all posts to calculate accurate stats
            const postsRef = collection(db, "posts");
            const q = query(postsRef, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const postsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Calculate Real Data Statistics
            const total = postsData.length;
            const myCount = postsData.filter((p) => p.authorEmail === user?.email).length;
            
            // Count how many posts have at least one <img> tag in their HTML content
            const withImages = postsData.filter((p) => {
              if (!p.content) return false;
              const parser = new DOMParser();
              const doc = parser.parseFromString(p.content, "text/html");
              return doc.querySelector("img") !== null;
            }).length;

            // Determine latest published date string
            let latestDate = "No posts yet";
            if (postsData.length > 0 && postsData[0].createdAt?.toDate) {
              latestDate = postsData[0].createdAt.toDate().toLocaleDateString();
            }

            setStats({
              totalPosts: total,
              myPosts: myCount,
              postsWithImages: withImages,
              lastPostDate: latestDate,
            });

            // Take top 5 latest posts for the preview table
            setRecentPosts(postsData.slice(0, 5));
          } catch (error) {
            console.error("Error loading admin stats:", error);
          } finally {
            setLoading(false);
          }
        }

        fetchAdminStats();
      }, [user]);

      return (
        <div className="space-y-6 pl-3">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
            </div>

            <Link
              to="/admin/posts"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center self-start sm:self-auto"
            >
              Manage All Posts
            </Link>
          </div>

          {/* Real Statistics Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Published Posts" 
              value={loading ? "..." : stats.totalPosts} 
              color="text-blue-600" 
            />
            <StatCard 
              title="Authored by You" 
              value={loading ? "..." : stats.myPosts} 
              color="text-green-600" 
            />
            <StatCard 
              title="Posts with Images" 
              value={loading ? "..." : stats.postsWithImages} 
              color="text-purple-600" 
            />
            <StatCard 
              title="Latest Activity" 
              value={loading ? "..." : stats.lastPostDate} 
              color="text-amber-600" 
              isText={true}
            />
          </div>

          {/* Live Recent Posts Table */}
          <RecentPostsTable posts={recentPosts} loading={loading} />
        </div>
      );
    }

##### src/pages/PostsManager.jsx (Manage Posts at /admin/posts)

    import { useState, useEffect } from "react";
    import { db } from "../lib/firebaseClient";
    import { 
      collection, 
      addDoc, 
      getDocs, 
      doc, 
      updateDoc, 
      deleteDoc, 
      serverTimestamp, 
      query, 
      orderBy 
    } from "firebase/firestore";
    import PostForm from "../components/PostForm";
    import PostList from "../components/PostList";

    export default function PostsManager({ user }) {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      
      // Navigation View Mode: "list" or "form"
      const [viewMode, setViewMode] = useState("list");
      const [editingPost, setEditingPost] = useState(null);

      const postsRef = collection(db, "posts");

      async function fetchPosts() {
        setLoading(true);
        try {
          const q = query(postsRef, orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const fetchedPosts = querySnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      }

      useEffect(() => {
        fetchPosts();
      }, []);

      // Trigger form view for brand new post
      function handleOpenCreate() {
        setEditingPost(null);
        setViewMode("form");
      }

      // Trigger form view for existing post
      function handleOpenEdit(post) {
        setEditingPost(post);
        setViewMode("form");
      }

      // Handle Save (Create or Update)
      async function handleSavePost(formData) {
        try {
          if (editingPost) {
            const postDoc = doc(db, "posts", editingPost.id);
            await updateDoc(postDoc, {
              title: formData.title,
              content: formData.content,
              updatedAt: serverTimestamp(),
            });
          } else {
            await addDoc(postsRef, {
              title: formData.title,
              content: formData.content,
              authorEmail: user?.email || "Admin",
              createdAt: serverTimestamp(),
            });
          }

          setViewMode("list"); // Return to table view
          setEditingPost(null);
          fetchPosts();
        } catch (error) {
          console.error("Error saving post:", error);
        }
      }

      // Handle Delete
      async function handleDeletePost(id) {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
          await deleteDoc(doc(db, "posts", id));
          fetchPosts();
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }

      return (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">Create, update, and manage public blog posts.</p>
          </div>

          {/* Conditionally renders either Table List View or Form View */}
          {viewMode === "list" ? (
            <PostList 
              posts={posts} 
              loading={loading} 
              onCreateNew={handleOpenCreate}
              onEdit={handleOpenEdit} 
              onDelete={handleDeletePost} 
            />
          ) : (
            <PostForm 
              editingPost={editingPost} 
              onSubmit={handleSavePost} 
              onCancel={() => setViewMode("list")} 
            />
          )}
        </div>
      );
    }

##### src/pages/LoginPage.jsx

    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { auth } from "../lib/firebaseClient";
    import { signInWithEmailAndPassword } from "firebase/auth";

    export default function LoginPage() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const navigate = useNavigate();

      async function handleLogin(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate("/admin"); // Directly navigates to Admin Portal!
        } catch (authError) {
          console.error("Firebase login error:", authError);
          setError(authError.message.replace("Firebase: ", ""));
        } finally {
          setLoading(false);
        }
      }

      return (
        <section className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-center text-sm text-gray-500 mb-6">Login to access AdminPortal</p>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all disabled:bg-gray-400"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </section>
      );
    }

##### src/pages/RegisterPage.jsx

    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { auth } from "../lib/firebaseClient";
    import { createUserWithEmailAndPassword } from "firebase/auth";

    export default function RegisterPage() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      
      const navigate = useNavigate();

      async function handleRegister(e) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }

        setLoading(true);

        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/admin"); // Directly navigates to Admin Portal!
        } catch (authError) {
          console.error("Firebase registration error:", authError);
          setError(authError.message.replace("Firebase: ", ""));
        } finally {
          setLoading(false);
        }
      }

      return (
        <section className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h1 className="text-3xl font-bold mb-1 text-center text-gray-800">Register</h1>
            <p className="text-center text-sm text-gray-500 mb-6">Create a new Admin account</p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {error && <p className="text-red-600 text-center text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all disabled:bg-gray-400"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </section>
      );
    }
**Note: please follow previous lab to install tailwindcss and react-router** 
- Install Tailwind CSS `npm install tailwindcss @tailwindcss/vite`
- Git repository: ` https://github.com/rupp-ite/wct1_reactjs/tree/part2 `