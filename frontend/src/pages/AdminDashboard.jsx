import { useState, useEffect } from "react";
import "../styles/adminDashboard.css";
import {
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaTools,
  FaFileAlt,
  FaHome
} from "react-icons/fa";


import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);



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
      .then(res => res.json())
      .then(data => setStats(data));
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("A dëshiron ta fshish këtë përdorues?")) return;

    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newUser = {
      emri: formData.get("emri"),
      mbiemri: formData.get("mbiemri"),
      email: formData.get("email"),
      fjalekalimi: formData.get("fjalekalimi"),
      roli: formData.get("roli"),
    };

    await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    setShowAddModal(false);
    loadUsers();
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedUser = {
      emri: formData.get("emri"),
      mbiemri: formData.get("mbiemri"),
      email: formData.get("email"),
      roli: formData.get("roli"),
    };

    await fetch(
      `http://localhost:5000/api/admin/users/${selectedUser.id_perdoruesi}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      }
    );

    setShowEditModal(false);
    loadUsers();
  };

  return (
    <div>
      <h1>Përdoruesit</h1>

      <div className="top-actions">
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Shto Përdorues
        </button>

        <select
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Të gjithë</option>
          <option value="Admin">Admin</option>
          <option value="Bibliotekar">Bibliotekist</option>
          <option value="User">User</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Veprime</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter(u => (filterRole === "all" ? true : u.roli === filterRole))
            .map(u => (
              <tr key={u.id_perdoruesi}>
                <td>{u.id_perdoruesi}</td>
                <td>{u.emri} {u.mbiemri}</td>
                <td>{u.email}</td>
                <td>{u.roli}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(u)}>
                    Edito
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u.id_perdoruesi)}
                  >
                    Fshij
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2>Shto Përdorues</h2>
          <form onSubmit={handleAddUser}>
            <input name="emri" placeholder="Emri" required />
            <input name="mbiemri" placeholder="Mbiemri" required />
            <input name="email" placeholder="Email" required />
            <input name="fjalekalimi" placeholder="Fjalëkalimi" type="password" required />

            <select name="roli" required>
              <option value="">Zgjedh rolin</option>
              <option value="Admin">Admin</option>
              <option value="Bibliotekar">Bibliotekist</option>
              <option value="User">User</option>
            </select>

            <div className="modal-actions">
              <button className="cancel-btn" type="button" onClick={() => setShowAddModal(false)}>
                Anulo
              </button>
              <button className="save-btn" type="submit">Shto</button>
            </div>
          </form>
        </Modal>
      )}

    
      {showEditModal && selectedUser && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2>Modifiko Përdoruesin</h2>

          <form onSubmit={handleEditUser}>
            <input name="emri" defaultValue={selectedUser.emri} required />
            <input name="mbiemri" defaultValue={selectedUser.mbiemri} required />
            <input name="email" defaultValue={selectedUser.email} required />

            <select name="roli" defaultValue={selectedUser.roli}>
              <option value="Admin">Admin</option>
              <option value="Bibliotekar">Bibliotekar</option>
              <option value="User">User</option>
            </select>

            <div className="modal-actions">
              <button className="cancel-btn" type="button" onClick={() => setShowEditModal(false)}>
                Anulo
              </button>
              <button className="save-btn" type="submit">Ruaj Ndryshimet</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}


function StaffManagement() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then(res => res.json())
      .then(data => setStaff(data.filter(u => u.roli === "Bibliotekar")));
  }, []);

  return (
    <div>
      <h1>Stafi (Bibliotekistet)</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {staff.map(s => (
            <tr key={s.id_perdoruesi}>
              <td>{s.id_perdoruesi}</td>
              <td>{s.emri} {s.mbiemri}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function Reports() {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));

    fetch("http://localhost:5000/api/admin/monthly-stats")
      .then(res => res.json())
      .then(data => setMonthly(data));
  }, []);

  if (!stats || !monthly) return <p>Duke u ngarkuar...</p>;

  const barData = {
    labels: ["Përdorues", "Libra", "Rezervime", "Huazime"],
    datasets: [
      {
        label: "Statistika Totale",
        data: [
          stats.total_perdorues,
          stats.total_libra,
          stats.total_rezervime,
          stats.total_huazime
        ],
        backgroundColor: ["#4ade80", "#60a5fa", "#f472b6", "#facc15"]
      }
    ]
  };

  const lineData = {
    labels: ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gus", "Sht", "Tet", "Nën", "Dhj"],
    datasets: [
      {
        label: "Rezervime mujore",
        borderColor: "#6366f1",
        data: Object.values(monthly.rezervime).map(m => m.total),
        fill: false
      },
      {
        label: "Huazime mujore",
        borderColor: "#f43f5e",
        data: Object.values(monthly.huazime).map(m => m.total),
        fill: false
      }
    ]
  };

  return (
    <div>
      <h1>📊 Raportet & Statistikat</h1>

      <div className="chart-box">
        <Bar data={barData} />
      </div>

      <div className="chart-box">
        <Line data={lineData} />
      </div>
    </div>
  );
}


function SystemMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
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
      .then(res => res.json())
      .then(data => setLogs(data));
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
        <option value="Bibliotekar">Bibliotekist</option>
        <option value="User">User</option>
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
            .filter(l => filterRole === "all" ? true : l.roli === filterRole)
            .map(l => (
              <tr key={l.id_log}>
                <td>{l.id_log}</td>
                <td>{l.emri} {l.mbiemri}</td>
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


function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {children}
      </div>
    </div>
  );
}

export default AdminDashboard;
