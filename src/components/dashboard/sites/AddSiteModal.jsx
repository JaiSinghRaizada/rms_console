import { useState } from "react";
import { siteApi } from "../../../api/siteApi";
import SuccessToast from "../../common/SuccessToast";
import "./sites.css";

export default function AddSiteModal({ organizationId, onClose }) {
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!siteName.trim() || !location.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await siteApi.addSite({
        siteName: siteName.trim(),
        location: location.trim(),
        organizationId,
      });

      setSuccess("Site added successfully! 🎉");

      // close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Add site failed", err);
      setError("Failed to add site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

      <div className="modal-overlay">
        <div className="modal">
          <h3>Add Site</h3>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div className="modal-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Create Site"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
