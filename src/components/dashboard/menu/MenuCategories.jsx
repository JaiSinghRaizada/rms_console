import { useState } from "react";
import { useParams } from "react-router-dom";
import "./menuDetail.css";

import { menuCategoryApi } from "../../../api/menuCategoryApi";
import { menuItemApi } from "../../../api/menuItemApi";
import AddMenuCategory from "./AddMenuCategory";
import AddMenuItem from "./AddMenuItem";
import TableTemplate from "../../../common/TableTemplate";

export default function MenuCategories() {
  const { menuId } = useParams();

  const [activeTab, setActiveTab] =
    useState("categories");

  /* ==========================
     FETCH FUNCTIONS
  ========================== */

  const fetchCategories = async () => {
    const data =
      await menuCategoryApi.getByMenuId(
        menuId
      );
    return data || [];
  };

  const fetchItems = async () => {
    const data =
      await menuItemApi.getByMenuId(
        menuId
      );
    return data || [];
  };

  /* ==========================
     DELETE FUNCTIONS
  ========================== */

  const deleteCategory = async (
    categoryId
  ) => {
    await menuCategoryApi.delete(
      categoryId
    );
  };

  const deleteItem = async (
    itemId
  ) => {
    await menuItemApi.delete(itemId);
  };

  return (
    <div className="menu-detail-layout">
      {/* SIDEBAR */}
      <aside className="menu-detail-sidebar">
        <h3>Menu</h3>

        <div
          className={`menu-link ${
            activeTab === "categories"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("categories")
          }
        >
          Menu Categories
        </div>

        <div
          className={`menu-link ${
            activeTab === "items"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("items")
          }
        >
          Menu Items
        </div>
      </aside>

      {/* CONTENT */}
      <div className="menu-detail-content">
        {activeTab === "categories" && (
          <TableTemplate
            title="Category"
            idKey="categoryId"
            apiGetList={fetchCategories}
            apiDelete={deleteCategory}
            AddForm={(props) => (
              <AddMenuCategory
                {...props}
                menuId={menuId}
              />
            )}
            className="menu-table"
            wrapperClass="menu-table-wrapper"
            columns={[
              {
                key: "categoryName",
                label: "Category Name",
              },
              {
                key: "description",
                label: "Description",
              },
            ]}
          />
        )}

        {activeTab === "items" && (
          <TableTemplate
            title="Item"
            idKey="itemId"
            apiGetList={fetchItems}
            apiDelete={deleteItem}
            AddForm={(props) => (
              <AddMenuItem
                {...props}
                menuId={menuId}
                onSuccess={fetchItems}
              />
            )}
            className="menu-table"
            wrapperClass="menu-table-wrapper"
            columns={[
              {
                key: "itemName",
                label: "Item Name",
              },
              {
                key: "price",
                label: "Price",
                render: (item) =>
                  `₹${item.price}`,
              },
              {
                key: "isAvailable",
                label: "Status",
                render: (item) =>
                  item.isAvailable
                    ? "Available"
                    : "Unavailable",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
