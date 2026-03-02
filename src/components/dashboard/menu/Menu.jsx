import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";

import { menuApi } from "../../../api/menuApi";
import { siteApi } from "../../../api/siteApi";
import AddMenu from "./AddMenu";
import TableTemplate from "../../../common/TableTemplate";

export default function Menu() {
  const navigate = useNavigate();
  const organizationId =
    localStorage.getItem("organizationId");

  const [sitesMap, setSitesMap] = useState({});

  /* ==========================
     FETCH MENUS + SITES
  ========================== */
  const fetchMenus = async () => {
  try {
    const [menusRes, sitesRes] =
      await Promise.all([
        menuApi.getAll(),
        siteApi.getAll(), // REMOVE organizationId
      ]);

    const menus = menusRes?.data ?? menusRes ?? [];
    const sites = sitesRes?.data ?? sitesRes ?? [];

    const map = {};
    sites.forEach((site) => {
      map[String(site.siteId)] = site.siteName;
    });

    setSitesMap(map);

    return menus;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    return [];
  }
};

  return (
    <DashboardLayout>
      <div className="menu-page">
        <TableTemplate
          title="Menu"
          idKey="menuId"
          apiGetList={fetchMenus}
          apiDelete={menuApi.delete}
          AddForm={AddMenu}
          className="menu-table"
          wrapperClass="menu-table-wrapper"
          onRowClick={(row) =>
            navigate(`/menus/${row.menuId}`)
          }
          columns={[
            {
              key: "siteId",
              label: "Site Name",
              render: (menu) =>
                sitesMap[
                  String(menu.siteId)
                ] || "NA",
            },
            {
              key: "menuName",
              label: "Menu Name",
            },
            {
              key: "status",
              label: "Status",
              render: () => (
                <span className="badge-active">
                  Active
                </span>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
