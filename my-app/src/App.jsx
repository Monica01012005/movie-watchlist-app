import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setStatus({ loading: true, message: '', error: false });
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
      setStatus({ loading: false, message: '', error: false });
    } catch (error) {
      setStatus({ loading: false, message: 'Unable to load users.', error: true });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create user');
      }

      setFormData({ name: '', email: '', password: '' });
      setStatus({ loading: false, message: 'User created successfully!', error: false });
      fetchUsers();
    } catch (error) {
      setStatus({ loading: false, message: error.message, error: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="rounded-3xl bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
          <h1 className="text-3xl font-semibold text-white">MERN User Manager</h1>
          <p className="mt-2 text-slate-400">Create a new user and view existing users from your backend.</p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <h2 className="text-2xl font-semibold">Add a User</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm text-slate-300">Name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500"
                />
              </label>
              <button
                type="submit"
                disabled={status.loading}
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status.loading ? 'Saving...' : 'Create User'}
              </button>
            </form>
            {status.message && (
              <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${status.error ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                {status.message}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Users</h2>
              <button
                type="button"
                onClick={fetchUsers}
                className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-500 hover:text-white"
              >
                Refresh
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {status.loading && users.length === 0 ? (
                <p className="text-slate-400">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-slate-400">No users found yet.</p>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4 transition hover:border-violet-500">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;