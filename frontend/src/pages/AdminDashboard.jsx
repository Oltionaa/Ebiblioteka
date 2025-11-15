import { useState, useEffect } from "react";
import "../styles/adminDashboard.css";
import {
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaTools,
  FaFileAlt,
} from "react-icons/fa";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AdminDashboard() {
  const [section, setSection] = useState("overview");

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">⚙️ Admin Panel</h2>

        <div
          className={`sidebar-item ${section === "users" ? "active" : ""}`}
          onClick={() => setSection("users")}
        >
          <FaUsers /> Përdoruesit
        </div>

        <div
          className={`sidebar-item ${section === "staff" ? "active" : ""}`}
          onClick={() => setSection("staff")}
        >
          <FaUserTie /> Stafi
        </div>

        <div
          className={`sidebar-item ${section === "reports" ? "active" : ""}`}
          onClick={() => setSection("reports")}
        >
          <FaChartBar /> Raportet
        </div>

        <div
          className={`sidebar-item ${section === "system" ? "active" : ""}`}
          onClick={() => setSection("system")}
        >
          <FaTools /> Sistemi
        </div>

        <div
          className={`sidebar-item ${section === "logs" ? "active" : ""}`}
          onClick={() => setSection("logs")}
        >
          <FaFileAlt /> Log-et
        </div>
      </aside>

      <main className="admin-content">
        {section === "overview" && <Overview />}
        {section === "users" && <UserManagement />}
        {section === "staff" && <StaffManagement />}
        {section === "reports" && <Reports />}
        {section === "system" && <SystemMonitor />}
        {section === "logs" && <Logs />}
      </main>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Duke u ngarkuar...</p>;

  return (
    <div>
      <h1>Përmbledhje</h1>

      <div className="stats-cards">
        <div className="stat-card">Përdorues: {stats.total_perdorues}</div>
        <div className="stat-card">Libra: {stats.total_libra}</div>
        <div className="stat-card">Rezervime: {stats.total_rezervime}</div>
        <div className="stat-card">Huazime: {stats.total_huazime}</div>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");

  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h1>Përdoruesit</h1>

      <select
        className="filter-select"
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
      >
        <option value="all">Të gjithë</option>
        <option value="Admin">Admin</option>
        <option value="Bibliotekar">Bibliotekar</option>
        <option value="Perdorues">Përdorues</option>
      </select>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) =>
              filterRole === "all" ? true : u.roli === filterRole
            )
            .map((u) => (
              <tr key={u.id_perdoruesi}>
                <td>{u.id_perdoruesi}</td>
                <td>
                  {u.emri} {u.mbiemri}
                </td>
                <td>{u.email}</td>
                <td>{u.roli}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffManagement() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) =>
        setStaff(data.filter((u) => u.roli === "Bibliotekar"))
      );
  }, []);

  return (
    <div>
      <h1>Stafi</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id_perdoruesi}>
              <td>{s.id_perdoruesi}</td>
              <td>
                {s.emri} {s.mbiemri}
              </td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports() {
  const [raporti, setRaporti] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/raporte/fundit")
      .then((res) => res.json())
      .then((data) => {
        setRaporti(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Duke u ngarkuar...</p>;

  if (!raporti || !raporti.permbajtja)
    return <p>Nuk ka asnjë raport ende.</p>;

  const barData = {
    labels: ["Përdorues", "Libra", "Rezervime", "Huazime"],
    datasets: [
      {
        label: "Statistika Totale",
        data: [
          raporti.permbajtja.total_perdorues,
          raporti.permbajtja.total_libra,
          raporti.permbajtja.total_rezervime,
          raporti.permbajtja.total_huazime
        ],
        backgroundColor: ["#4ade80", "#60a5fa", "#f472b6", "#facc15"]
      }
    ]
  };

  return (
    <div>
      <h1>📊 Raportet & Statistikat</h1>

      <p style={{ marginTop: "-10px", color: "#666" }}>
        Raporti i fundit: <b>{raporti.dataGjenerimit}</b>
      </p>

      <div className="chart-box">
        <Bar data={barData} />
      </div>

      <center>
        <button
          onClick={() =>
            fetch("http://localhost:5000/api/raporte/gjenero", {
              method: "POST",
            }).then(() => window.location.reload())
          }
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Gjenero raport të ri
        </button>
      </center>
    </div>
  );
}

function SystemMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Duke u ngarkuar...</p>;

  return (
    <div>
      <h1>Monitorimi i Sistemit</h1>

      <ul className="stats-list">
        <li>Total përdorues: {stats.total_perdorues}</li>
        <li>Total libra: {stats.total_libra}</li>
        <li>Total rezervime: {stats.total_rezervime}</li>
        <li>Total huazime: {stats.total_huazime}</li>
      </ul>
    </div>
  );
}

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>

      <select
        className="filter-select"
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
      >
        <option value="all">Të gjithë</option>
        <option value="Admin">Admin</option>
        <option value="Bibliotekar">Bibliotekar</option>
        <option value="Perdorues">Përdorues</option>
      </select>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Përdoruesi</th>
            <th>Roli</th>
            <th>Veprimi</th>
            <th>IP</th>
            <th>Koha</th>
          </tr>
        </thead>

        <tbody>
          {logs
            .filter((l) =>
              filterRole === "all" ? true : l.roli === filterRole
            )
            .map((l) => (
              <tr key={l.id_log}>
                <td>{l.id_log}</td>
                <td>
                  {l.emri} {l.mbiemri}
                </td>
                <td>{l.roli}</td>
                <td>{l.veprimi}</td>
                <td>{l.ip || "—"}</td>
                <td>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
