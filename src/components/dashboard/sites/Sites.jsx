import { Pencil, Power } from "lucide-react";
import AddSiteModal from "./AddSiteModal";
import { siteApi } from "../../../api/siteApi";
import DashboardLayout from "../DashboardLayout";
import TableTemplate from "../../../common/TableTemplate";
import "./sites.css";

export default function Sites() {

  const userRole = localStorage.getItem("userRole");

  const canManageSites =
    userRole === "Admin" ||
    userRole === "SUPER_ADMIN";

  // ============================
  // FETCH 
  // ============================
  const getSites = async () => {
    try {
      const res = await siteApi.getAll();
      return res?.data ?? res ?? [];
    } catch (error) {
      console.error("Error fetching sites:", error);
      return [];
    }
  };

  

  // ============================
  // DELETE
  // ============================
  const deleteSite = async (siteId) => {
    if (!canManageSites) return;
    await siteApi.deleteSite(siteId);
  };

  // ============================
  // TOGGLE STATUS
  // ============================
  const toggleStatus = async (site) => {
    if (!canManageSites) return;

    await siteApi.updateSiteStatus(
      site.siteId, // use siteId if backend returns siteId
      !site.isActive
    );
  };

  return (
    <DashboardLayout>
      <div className="sites-page">

        {!canManageSites && (
          <p className="info-text">
            You have read-only access to sites
          </p>
        )}

        <TableTemplate
          title="Site"
          idKey="siteId"   // IMPORTANT: match backend field
          apiGetList={getSites}
          apiDelete={deleteSite}
          AddForm={(props) => (
            <AddSiteModal {...props} />
          )}
          className="sites-table"
          wrapperClass="sites-table-wrapper"
          columns={[
            {
              key: "siteName",
              label: "Site",
              render: (site) => (
                <div className="site-name">
                  <div className="site-avatar">
                    {site.siteName?.charAt(0)}
                  </div>
                  <span className="site-title">
                    {site.siteName}
                  </span>
                </div>
              ),
            },
            {
              key: "location",
              label: "Location",
            },
            {
              key: "isActive",
              label: "Status",
              render: (site) => (
                <span
                  className={
                    site.isActive
                      ? "badge-active"
                      : "badge-inactive"
                  }
                >
                  {site.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (site) => (
                <div className="icon-actions">
                  <button
                    className="icon-btn"
                    disabled={!canManageSites}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="icon-btn"
                    disabled={!canManageSites}
                    onClick={() => toggleStatus(site)}
                    title="Activate / Deactivate"
                  >
                    <Power size={16} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}