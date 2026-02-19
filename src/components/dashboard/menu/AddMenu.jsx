import { useEffect, useState } from "react";
import { menuApi } from "../../../api/menuApi";
import { siteApi } from "../../../api/siteApi";
import SuccessToast from "../../../common/SuccessToast";
import Modal from "../../../common/modal/Modal";
import {
  Input,
  Select,
} from "../../../common/FormTemplate";
import "./menu.css";

export default function AddMenu({ onClose }) {
  const [menuName, setMenuName] =
    useState("");
  const [siteId, setSiteId] =
    useState("");
  const [sites, setSites] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  const organizationId =
    localStorage.getItem("organizationId");

  /* ==========================
     FETCH SITES
  ========================== */
  useEffect(() => {
    const fetchSites = async () => {
      if (!organizationId) return;

      try {
        const response =
          await siteApi.getAll(
            organizationId
          );

        setSites(response);
      } catch (err) {
        console.error(
          "Failed to load sites",
          err
        );
      }
    };

    fetchSites();
  }, [organizationId]);

  /* ==========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!menuName.trim()) {
      setError(
        "Menu name is required"
      );
      return;
    }

    if (!siteId) {
      setError("Site is required");
      return;
    }

    try {
      setLoading(true);

      await menuApi.add({
        menuName: menuName.trim(),
        siteId,
      });

      setSuccess(
        "Menu added successfully 🎉"
      );

      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(
        "Add menu failed",
        err
      );
      setError("Failed to add menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

      <Modal title="Add Menu">
        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) =>
              setMenuName(
                e.target.value
              )
            }
          />

          <Select
            value={siteId}
            onChange={(e) =>
              setSiteId(e.target.value)
            }
            placeholder="Select Site"
            options={sites.map(
              (site) => ({
                value: site.siteId,
                label: site.siteName,
              })
            )}
          />

          <div className="modal-actions">
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Create Menu"}
            </button>

            <button
              className="btn-secondary"
              type="button"
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
