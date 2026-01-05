import profilePic from "../assets/profile.jpg";
import StemBuilding from "../assets/stem.jpeg";
import { StatCard, TableRow } from "../components/DashboardComponents";

export default function HomePage({ user }) {
  // ================= DASHBOARD =================
  if (user) {
    return (
      <main className="bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back,{" "}
                <span className="font-medium">{user.email}</span>
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Projects" value="12" />
            <StatCard title="Active" value="8" color="text-green-600" />
            <StatCard title="Pending" value="3" color="text-yellow-600" />
            <StatCard title="Inactive" value="1" color="text-red-600" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Project Overview
              </h2>
              <span className="text-xs text-gray-500 uppercase">
                Sample Data
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">ID</th>
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <TableRow id="1" name="Sample Item A" status="Active" />
                  <TableRow id="2" name="Sample Item B" status="Pending" />
                  <TableRow id="3" name="Sample Item C" status="Inactive" />
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    );
  }

  // ================= PUBLIC PAGE =================
  return (
    <main className="flex-1 flex flex-col items-center justify-center space-y-6">
      <section className="flex text-start px-4 space-x-4">
        <img
          src={profilePic}
          alt="Profile"
          className="w-40 h-40 rounded-full shadow-lg border-4 border-white"
        />
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to My React Site
          </h1>
          <p className="text-lg md:text-xl">
            Hello! I'm learning{" "}
            <span className="font-semibold text-blue-600">React</span>.
          </p>
        </div>
      </section>

      <img src={StemBuilding} alt="StemBuilding" className="max-w-3xl" />
    </main>
  );
}
