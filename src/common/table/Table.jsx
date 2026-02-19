export default function Table({
  columns,
  children,
  className = "",
  wrapperClass = "",
}) {
  return (
    <div className={wrapperClass}>
      <table className={className}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
