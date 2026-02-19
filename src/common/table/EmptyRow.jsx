export default function EmptyRow({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-state">
        {message}
      </td>
    </tr>
  );
}
