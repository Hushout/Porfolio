import React, { useRef } from "react";
import NavButton from "../NavButton/NavButton";
import "./Navbar.css";

export const Navbar = ({
  profilRef = null,
  projectRef = null,
  contactRef = null,
}) => {
  const onButtonClick = (inputRef) => {
    if (!!inputRef) {
      inputRef.current.focus();
    }
  };
  return (
    <div className="Navbar">
      <NavButton onClick={() => onButtonClick(profilRef)} text={"Profil"} />
      <NavButton onClick={() => onButtonClick(projectRef)} text={"Project"} />
      <NavButton onClick={() => onButtonClick(contactRef)} text={"Contact"} />
    </div>
  );
};
