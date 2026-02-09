import { useEffect, useState } from "react";
import { menuApi } from "../../../api/menuApi";
import { siteApi } from "../../../api/siteApi";
import SuccessToast from "../../common/SuccessToast";
import "./menu.css";

export default function AddMenu({ onClose }) {
  const [menuName, setMenuName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Mongo ObjectId → keep as STRING
  const organizationId = localStorage.getItem("organizationId");

  // 🔹 Fetch sites
useEffect(() => {
  const fetchSites = async () => {
    if (!organizationId) return;

    try {
      const response = await siteApi.getAll(organizationId);

      console.log("Sites array:", response); // optional
      setSites(response); // ✅ FIX
    } catch (err) {
      console.error("Failed to load sites", err);
    }
  };

  fetchSites();
}, [organizationId]);


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!menuName.trim()) {
    setError("Menu name is required");
    return;
  }

  if (!siteId) {
    setError("Site is required");
    return;
  }

  const payload = {
    menuName: menuName.trim(),
    siteId, 
  };

  try {
    setLoading(true);
    await menuApi.add(payload);
    setSuccess("Menu added successfully 🎉");
    setTimeout(onClose, 1200);
  } catch (err) {
    console.error("Add menu failed", err);
    setError("Failed to add menu");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <SuccessToast message={success} />

      <div className="modal-overlay">
        <div className="modal">
          <h3>Add Menu</h3>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Menu Name"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              disabled={loading}
            />

            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Menu"}
              </button>
              <button className="btn-secondary" type="button" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
