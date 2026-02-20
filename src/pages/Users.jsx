import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/user/user.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
  });

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users",{headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`,
        tenant:`${localStorage.getItem("tenant")}`
      }});
      if (res.data.success) {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

 
  useEffect(() => {
    const result = users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const createUser = async () => {
    try {
      const res = await api.post("/api/users", formData,{headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`,
        tenant:`${localStorage.getItem("tenant")}`
      }});

      if (res.data.success) {
        fetchUsers();
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "MANAGER",
        });
      }
    } catch (err) {
      console.error("Error creating user", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        <div className="users-header">
          <h2>Users</h2>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Create User
          </button>
        </div>

        {/* 🔍 Search */}
        {/* <input
          type="text"
          placeholder="Search by name or email..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        {/* Table */}
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.isActive ? (
                    <span className="active">Active</span>
                  ) : (
                    <span className="inactive">Disabled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create User</h3>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="MANAGER">MANAGER</option>
                <option value="STAFF">STAFF</option>
              </select>

              <div className="modal-buttons">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  onClick={createUser}
                  className="btn-primary"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
