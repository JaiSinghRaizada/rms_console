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
          idKey="siteId"
          apiGetList={getSites}
          apiDelete={deleteSite}
          AddForm={(props) => (
            <AddSiteModal {...props} />
          )}
          className="sites-table"
          wrapperClass="sites-table-wrapper"
          columns={[
            // ============================
            // SITE NAME
            // ============================
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

            // ============================
            // LOCATION
            // ============================
            {
              key: "location",
              label: "Location",
              render: (site) => (
                <span>
                  {site.address?.city || "N/A"}
                </span>
              ),
            },

            // ============================
            // STATUS (AUTO TIME-BASED)
            // ============================
            {
              key: "status",
              label: "Status",
              render: (site) => {
                if (!site.openTime || !site.closeTime) {
                  return (
                    <span className="badge-inactive">
                      Closed
                    </span>
                  );
                }

                const now = new Date();
                const currentTime =
                  now.getHours() * 60 + now.getMinutes();

                const [openHour, openMin] =
                  site.openTime.split(":").map(Number);

                const [closeHour, closeMin] =
                  site.closeTime.split(":").map(Number);

                const openTotal =
                  openHour * 60 + openMin;

                const closeTotal =
                  closeHour * 60 + closeMin;

                const isOpen =
                  currentTime >= openTotal &&
                  currentTime <= closeTotal;

                return (
                  <span
                    className={
                      isOpen
                        ? "badge-active"
                        : "badge-inactive"
                    }
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                );
              },
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}