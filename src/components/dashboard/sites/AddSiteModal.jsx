import { useState } from "react";
import { siteApi } from "../../../api/siteApi";

export default function AddSiteModal({ organizationId, onClose }) {
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!organizationId) {
  alert("Organization not loaded");
  return;
}
    setLoading(true);
    try {
      await siteApi.addSite({
        siteName,
        location,
        organizationId,
      });
      onClose();
    } catch (err) {
      console.error("Add site failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Add Site</h3>

      <input
        placeholder="Site Name"
        value={siteName}
        onChange={(e) => setSiteName(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Create Site"}
      </button>

      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
