const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{ background: "#00000088", padding: "50px" }}>
      <div style={{ background: "white", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;