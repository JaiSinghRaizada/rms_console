import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Table from "./table/Table";
import LoadingRow from "./table/LoadingRow";
import EmptyRow from "./table/EmptyRow";
import SuccessToast from "./SuccessToast";

const TableTemplate = ({
  title,
  columns = [],
  idKey = "id",
  apiGetList,
  apiDelete,
  AddForm = null,
  onRowClick = null,
  className = "",
  wrapperClass = "",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [success, setSuccess] = useState("");

  // ==========================
  // FETCH DATA
  // ==========================
  const fetchList = async () => {
    setLoading(true);
    try {
      let result =
        typeof apiGetList === "function"
          ? await apiGetList()
          : apiGetList;

      if (result?.data) result = result.data;

      setItems(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ==========================
  // AUTO HIDE SUCCESS
  // ==========================
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    if (!apiDelete) return;

    try {
      await apiDelete(id);
      setSuccess(`${title} deleted successfully ✅`);
      fetchList();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <SuccessToast message={success} />

      {/* HEADER */}
      <div className="menu-header">
        <h2>{title}</h2>

        {AddForm && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingItem(null);
              setShowAdd(true);
            }}
          >
            + Add {title}
          </button>
        )}
      </div>

      {/* TABLE */}
      <Table
        columns={[
          ...columns.map((c) => c.label),
          "Actions",
        ]}
        className={className}
        wrapperClass={wrapperClass}
      >
        {loading ? (
          <LoadingRow colSpan={columns.length + 1} />
        ) : items.length === 0 ? (
          <EmptyRow
            colSpan={columns.length + 1}
            message={`No ${title}s found`}
          />
        ) : (
          items.map((row) => (
            <tr
              key={row[idKey]}
              className={
                onRowClick ? "clickable-row" : ""
              }
              onClick={() =>
                onRowClick && onRowClick(row)
              }
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row)
                    : row[col.key] ?? "NA"}
                </td>
              ))}

              {/* ACTION COLUMN (GLOBAL) */}
              <td align="right">
                <div className="icon-actions">
                  {/* EDIT */}
                  {AddForm && (
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setEditingItem(row);
                        setShowAdd(true);
                      }}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                  )}

                  {/* DELETE */}
                  {apiDelete && (
                    <button
                      className="icon-btn delete-btn"
                      onClick={() =>
                        handleDelete(row[idKey])
                      }
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      {/* ADD / EDIT MODAL */}
      {AddForm && showAdd && (
        <AddForm
          editingItem={editingItem}
          onClose={() => {
            setShowAdd(false);
            setEditingItem(null);
            fetchList();
            setSuccess(`${title} saved successfully ✅`);
          }}
        />
      )}
    </div>
  );
};

export default TableTemplate;