import { FormEvent, useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'bingo-admin-token';

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    username: string;
    email: string;
    token: string;
  };
};

type ApiListResponse = {
  success: boolean;
  message?: string;
  data?: AdminUser[];
};

type AdminUser = {
  _id: string;
  username: string;
  email: string;
  points: number;
  badges?: string[];
  impactStats?: {
    treesSaved?: number;
    plasticDiverted?: number;
    co2Reduced?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

type SessionUser = {
  username: string;
  email: string;
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadUsers(token);
  }, [token]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      `${user.username} ${user.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query, users]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalPoints = users.reduce((sum, user) => sum + (user.points ?? 0), 0);
    const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
    const topUser = [...users].sort((a, b) => (b.points ?? 0) - (a.points ?? 0))[0];

    return {
      totalUsers,
      totalPoints,
      averagePoints,
      topUser: topUser ? `${topUser.username} (${topUser.points ?? 0})` : 'No users yet',
    };
  }, [users]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success || !result.data?.token) {
        throw new Error(result.message ?? 'Login failed');
      }

      localStorage.setItem(TOKEN_KEY, result.data.token);
      setToken(result.data.token);
      setSessionUser({ username: result.data.username, email: result.data.email });
      setPassword('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers(authToken = token) {
    setListLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/admin/list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = (await response.json()) as ApiListResponse;

      if (!response.ok || !result.success || !Array.isArray(result.data)) {
        throw new Error(result.message ?? 'Could not load users');
      }

      setUsers(result.data);
    } catch (listError) {
      setError(listError instanceof Error ? listError.message : 'Could not load users');
      if (listError instanceof Error && listError.message.toLowerCase().includes('authorized')) {
        handleLogout();
      }
    } finally {
      setListLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setSessionUser(null);
    setUsers([]);
    setQuery('');
    setPassword('');
  }

  if (!isAuthenticated) {
    return (
      <main className="login-page">
        <section className="login-panel" aria-labelledby="login-title">
          <div>
            <p className="eyebrow">BinGo Admin</p>
            <h1 id="login-title">Dashboard Login</h1>
            <p className="muted">Use an existing BinGo account to view registered app users.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
              />
            </label>

            {error ? <p className="error-message">{error}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">BinGo Admin</p>
          <h1>User Dashboard</h1>
          <p className="muted">
            {sessionUser ? `Signed in as ${sessionUser.username}` : 'Signed in with saved token'}
          </p>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={() => void loadUsers()}>
            {listLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error ? <p className="error-message dashboard-error">{error}</p> : null}

      <section className="stats-grid" aria-label="User stats">
        <StatCard label="Total users" value={stats.totalUsers.toLocaleString()} />
        <StatCard label="Total points" value={stats.totalPoints.toLocaleString()} />
        <StatCard label="Average points" value={stats.averagePoints.toLocaleString()} />
        <StatCard label="Top user" value={stats.topUser} />
      </section>

      <section className="table-section" aria-labelledby="users-title">
        <div className="table-toolbar">
          <div>
            <h2 id="users-title">Users</h2>
            <p className="muted">
              Showing {filteredUsers.length.toLocaleString()} of {users.length.toLocaleString()}
            </p>
          </div>
          <label className="search-label">
            <span>Search users</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Username or email"
            />
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Points</th>
                <th>Badges</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{(user.points ?? 0).toLocaleString()}</td>
                  <td>{user.badges?.length ?? 0}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.updatedAt)}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {listLoading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function formatDate(date?: string) {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export default App;
