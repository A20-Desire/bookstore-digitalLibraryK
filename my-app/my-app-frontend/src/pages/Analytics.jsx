import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/Authprovider";

function Analytics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get("/analytics/overview");
        setMetrics(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      }
    };

    fetchMetrics();
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Library Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Monitor the health of the digital library and community engagement to inform curation decisions.
        </p>
        <p className="text-xs text-slate-400">Access granted to: {user?.username} ({user?.role})</p>
      </header>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {metrics ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-base-200 p-4 shadow-sm dark:border-slate-700">
              <p className="text-xs uppercase text-slate-500">Total Books</p>
              <p className="text-2xl font-semibold">{metrics.stats.books}</p>
            </div>
            <div className="rounded-xl border border-base-200 p-4 shadow-sm dark:border-slate-700">
              <p className="text-xs uppercase text-slate-500">Registered Users</p>
              <p className="text-2xl font-semibold">{metrics.stats.users}</p>
            </div>
            <div className="rounded-xl border border-base-200 p-4 shadow-sm dark:border-slate-700">
              <p className="text-xs uppercase text-slate-500">Community Posts</p>
              <p className="text-2xl font-semibold">{metrics.stats.comments}</p>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-base-200 p-6 shadow-sm dark:border-slate-700">
              <h2 className="text-lg font-semibold">Top Downloads</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {metrics.topBooks.map((book) => (
                  <li className="flex items-center justify-between" key={book._id}>
                    <span className="font-medium">{book.title}</span>
                    <span className="text-xs text-slate-400">{book.downloadCount} downloads</span>
                  </li>
                ))}
                {metrics.topBooks.length === 0 && <li className="text-xs text-slate-400">No download data yet.</li>}
              </ul>
            </div>

            <div className="rounded-2xl border border-base-200 p-6 shadow-sm dark:border-slate-700">
              <h2 className="text-lg font-semibold">Newest Members</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {metrics.recentUsers.map((member) => (
                  <li className="flex items-center justify-between" key={member._id}>
                    <span className="font-medium">{member.username}</span>
                    <span className="text-xs text-slate-400">{new Date(member.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
                {metrics.recentUsers.length === 0 && <li className="text-xs text-slate-400">No recent signups.</li>}
              </ul>
            </div>
          </section>
        </div>
      ) : !error ? (
        <p className="text-sm text-slate-500">Loading analytics...</p>
      ) : null}
    </section>
  );
}

export default Analytics;
