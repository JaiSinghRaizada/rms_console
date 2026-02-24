import { useState } from "react";
import { siteApi } from "../../../api/siteApi";
import { Input } from "../../../common/FormTemplate";
import Modal from "../../../common/modal/Modal";
import SuccessToast from "../../../common/SuccessToast";
import "./sites.css";

export default function AddSiteModal({ onClose }) {
  const [siteName, setSiteName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const organizationId = localStorage.getItem("organizationId");

    if (!organizationId) {
      setError("Organization ID not found");
      return;
    }

    if (!openTime) {
      setError("Open time is required");
      return;
    }

    if (!closeTime) {
      setError("Close time is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        siteName,
        organizationId,
        address: {
          addressLine,
          city,
          state,
          postalCode,
          zipCode,
          countryCode: "IN",
        },
        openTime,
        closeTime,
      };

      await siteApi.addSite(payload);

      setSuccess("Site created successfully ✅");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create site"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

      <Modal title="Add Site">
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />

          <Input
            placeholder="Address Line"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />

          <Input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <Input
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <Input
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />

          {/* NEW TIME FIELDS */}
         <div className="time-row">
  <div>
    <label>Open Time</label>
    <Input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
  </div>

  <div>
    <label>Close Time</label>
    <Input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
  </div>
</div>
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
      </Modal>
    </>
  );
}