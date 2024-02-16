import React from "react";

const Pill = ({ user, onClick }) => {
  return (
    <span className="user-pill">
      <img src={user.image} style={{ height: "20px" }} alt="user-image" />
      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
        {user.firstName} {user.lastName}{" "}
        <span
          onClick={onClick}
          className="delete-button"
          style={{
            display: "inline-flex",
            fontSize: "20px",
            alignItems: "center",
            textDecoration: "semi-bold",
            marginLeft: "4px",
            cursor: "pointer",
          }}
        >
          X
        </span>
      </span>
    </span>
  );
};

export default Pill;
