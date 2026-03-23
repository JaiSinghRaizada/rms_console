import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";
import { userApi } from "../../../api/userApi";
import AddUserModal from "./AddUserModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const organizationId = localStorage.getItem("organizationId");

const fetchUsers = async () => {
  setLoading(true);

  try {
    const organizationId = localStorage.getItem("organizationId");

    console.log("OrganizationId:", organizationId);

    let usersData = [];

    if (organizationId) {
      usersData = await userApi.getByOrganizationId(organizationId);
    } else {
      console.warn("No orgId → fallback");
      usersData = await userApi.getAll();
    }

    // ✅ Always remove super admin (safety)
    const filtered = usersData.filter(
      (u) => !u.role?.toUpperCase().includes("SUPER")
    );

    setUsers(filtered);
  } catch (err) {
    console.error(err);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
  if (!userId) return;

  if (!window.confirm("Delete this user?")) return;

  try {
    await userApi.delete(userId);
    alert("User deleted successfully ✅");
    fetchUsers();
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  return (
    <DashboardLayout>
      <div className="menu-page">
        <div className="menu-header">
          <h2>Users</h2>
          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
          >
            + Add User
          </button>
        </div>

        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Contact</th>
                <th align="right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                    <tr key={user.userId}>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.contactNumber}</td>
                    <td align="right">
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(user.userId)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showAdd && (
          <AddUserModal
            onClose={() => {
              setShowAdd(false);
              fetchUsers();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
