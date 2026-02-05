import { useEffect, useState } from "react";
import { Pencil, Trash2, Power } from "lucide-react";
import AddSiteModal from "./AddSiteModal";
import { useOrganization } from "../../../context/OrganizationContext";
import { siteApi } from "../../../api/siteApi";
import DashboardLayout from "../DashboardLayout";
import "./sites.css";

export default function Sites() {
  // ================================
  // CONTEXT + ROLE
  // ================================
  const { organizationId, loading: orgLoading } = useOrganization();
  const userRole = localStorage.getItem("userRole");

  const canManageSites =
    userRole === "Admin" || userRole === "Super Admin";

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ================================
  // FETCH SITES (SAFE)
  // ================================
  const fetchSites = async () => {
    if (!organizationId) return;

    setLoading(true);
    try {
      const res = await siteApi.getSites(organizationId);
      const siteList = res?.data ?? res ?? [];
      setSites(siteList);
    } catch (err) {
      console.error("Fetch sites error:", err);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchSites();
    }
  }, [organizationId]);

  // ================================
  // TOGGLE STATUS (ROLE GUARDED)
  // ================================
  const toggleStatus = async (site) => {
    if (!canManageSites) return;

    try {
      await siteApi.updateSiteStatus(site._id, !site.isActive);
      fetchSites();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // ================================
  // DELETE SITE (ROLE GUARDED)
  // ================================
  const handleDelete = async (siteId) => {
  if (!canManageSites) return;

  if (!siteId) {
    console.error("Delete failed: siteId is missing");
    return;
  }

  if (!window.confirm("Delete this site?")) return;

  try {
    await siteApi.deleteSite(siteId);
    fetchSites();
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  return (
    <DashboardLayout>
      <div className="sites-page">
        {/* HEADER */}
        <div className="sites-header">
          <h2>Sites</h2>

          <button
            className="AddSiteBtn"
            onClick={() => setShowModal(true)}
            disabled={
              orgLoading ||
              !organizationId ||
              !canManageSites
            }
            title={
              !canManageSites
                ? "You do not have permission to add sites"
                : ""
            }
          >
            + Add Site
          </button>
        </div>

        {/* ORG MISSING MESSAGE */}
        {!orgLoading && !organizationId && (
          <p className="error-text">
            Organization not assigned to this user
          </p>
        )}

        {/* ROLE MESSAGE */}
        {organizationId && !canManageSites && (
          <p className="info-text">
            You have read-only access to sites
          </p>
        )}

        {/* TABLE */}
        <div className="sites-table-wrapper">
          <table className="sites-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>Location</th>
                <th>Status</th>
                <th align="right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orgLoading || loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    <h3>No site found</h3>
                    <p>Add your first site / branch</p>
                  </td>
                </tr>
              ) : (
               sites.map((site) => (
                <tr key={site.siteId}>

                    {/* SITE */}
                    <td>
                      <div className="site-name">
                        <div className="site-avatar">
                          {site.siteName?.charAt(0)}
                        </div>
                        <span className="site-title">
                          {site.siteName}
                        </span>
                      </div>
                    </td>

                    <td className="muted">{site.location}</td>

                    <td>
                      <span
                        className={
                          site.isActive
                            ? "badge-active"
                            : "badge-inactive"
                        }
                      >
                        {site.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td align="right">
                      <div className="icon-actions">
                        <button
                          className="icon-btn"
                          title="Edit"
                          disabled={!canManageSites}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-btn"
                          title={
                            canManageSites
                              ? "Activate / Deactivate"
                              : "No permission"
                          }
                          disabled={!canManageSites}
                          onClick={() =>
                            toggleStatus(site)
                          }
                        >
                          <Power size={16} />
                        </button>
<button
  className="icon-btn danger"
  title={canManageSites ? "Delete" : "No permission"}
  disabled={!canManageSites}
  onClick={() => handleDelete(site.siteId)}
>
  <Trash2 size={16} />
</button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ADD SITE MODAL */}
        {showModal && organizationId && canManageSites && (
          <AddSiteModal
            organizationId={organizationId}
            onClose={() => {
              setShowModal(false);
              fetchSites();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
