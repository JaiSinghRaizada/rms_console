import { Trash2 } from "lucide-react";

export default function DeleteButton({
  onDelete,
  id,
  confirmMessage = "Are you sure?",
  disabled,
}) {
  const handleClick = async (e) => {
    e.stopPropagation();

    if (!window.confirm(confirmMessage)) return;

    await onDelete(id);
  };

  return (
    <button
      className="icon-btn danger"
      onClick={handleClick}
      disabled={disabled}
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
