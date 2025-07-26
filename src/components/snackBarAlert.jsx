const SnackBarAlert = ({ open, message, severity, onClose }) => {
  return (
    <div className={`snackbar-alert ${open ? 'show' : ''} ${severity}`}>
      <span>{message}</span>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default SnackBarAlert;