import { useEffect, useState } from "react";
import Table from "./table/Table";
import LoadingRow from "./table/LoadingRow";
import EmptyRow from "./table/EmptyRow";
import DeleteButton from "./actions/DeleteButton";
import SuccessToast from "./SuccessToast";

const TableTemplate = ({
  title,
  columns = [],             // [{ key, label, render? }]
  idKey = "id",
  apiGetList,
  apiDelete,
  AddForm = null,
  onRowClick = null,
  className = "",
  wrapperClass = "",
  fetchParams = null,       // optional params for API
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [success, setSuccess] = useState("");

// ==========================
// FETCH DATA
// ==========================

const fetchList = async () => {
  setLoading(true);

  try {
    let result =
      typeof apiGetList === "function"
        ? await apiGetList()   // NO PARAMS
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
  /* ==========================
     DELETE
  ========================== */
  const handleDelete = async (id) => {
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
            onClick={() => setShowAdd(true)}
          >
            + Add {title}
          </button>
        )}
      </div>

      {/* TABLE */}
      <Table
        columns={[
          ...columns.map((c) => c.label),
          "Action",
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

              <td align="right">
                <DeleteButton
                  id={row[idKey]}
                  onDelete={handleDelete}
                  confirmMessage={`Delete this ${title.toLowerCase()}?`}
                />
              </td>
            </tr>
          ))
        )}
      </Table>

      {/* ADD MODAL */}
      {AddForm && showAdd && (
        <AddForm
          onClose={() => {
            setShowAdd(false);
            fetchList();
          }}
        />
      )}
    </div>
  );
};

export default TableTemplate;
