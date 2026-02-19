export default function SuccessToast({ message }) {
  if (!message) return null;

  return (
    <div className="success-toast">
      {message}
    </div>
  );
}
