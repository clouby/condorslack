import React from "react";
import ReactModal from "react-modal";
import { Card } from "rebass";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.36)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "400px",
    maxHeight: "500px",
    marginRight: "-50%",
    border: "none",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent"
  }
};

ReactModal.setAppElement("#root");

const Modal = props => (
  <ReactModal
    {...props}
    style={customStyles}
    contentLabel="onRequestActions"
    shouldCloseOnOverlayClick={true}
  >
    <Card
      fontSize={6}
      fontWeight="bold"
      width={1}
      // p={4}
      bg="#282c34"
      borderRadius={8}
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
    >
      {props.children}
    </Card>
  </ReactModal>
);

export default Modal;
