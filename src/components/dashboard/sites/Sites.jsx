import { Pencil, Power } from "lucide-react";
import AddSiteModal from "./AddSiteModal";
import { useOrganization } from "../../../context/OrganizationContext";
import { siteApi } from "../../../api/siteApi";
import DashboardLayout from "../DashboardLayout";
import TableTemplate from "../../../common/TableTemplate";
import "./sites.css";

export default function Sites() {
  const { organizationId, loading: orgLoading } =
    useOrganization();

  const userRole =
    localStorage.getItem("userRole");

  const canManageSites =
    userRole === "Admin" ||
    userRole === "Super Admin";

  // ================================
  // FETCH FUNCTION (wrapped for template)
  // ================================
  const getSites = async () => {
    if (!organizationId) return [];

    const res =
      await siteApi.getSites(organizationId);

    return res?.data ?? res ?? [];
  };

  // ================================
  // DELETE FUNCTION
  // ================================
  const deleteSite = async (siteId) => {
    if (!canManageSites) return;
    await siteApi.deleteSite(siteId);
  };

  // ================================
  // TOGGLE STATUS
  // ================================
  const toggleStatus = async (site) => {
    if (!canManageSites) return;

    await siteApi.updateSiteStatus(
      site._id,
      !site.isActive
    );
  };

  return (
    <DashboardLayout>
      <div className="sites-page">

        {!orgLoading && !organizationId && (
          <p className="error-text">
            Organization not assigned to this user
          </p>
        )}

        {organizationId && !canManageSites && (
          <p className="info-text">
            You have read-only access to sites
          </p>
        )}

        {organizationId && (
          <TableTemplate
            title="Site"
            idKey="siteId"
            apiGetList={getSites}
            apiDelete={deleteSite}
            AddForm={(props) => (
              <AddSiteModal
                {...props}
                organizationId={organizationId}
              />
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
                    {site.isActive
                      ? "Active"
                      : "Inactive"}
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
                      onClick={() =>
                        toggleStatus(site)
                      }
                      title="Activate / Deactivate"
                    >
                      <Power size={16} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
