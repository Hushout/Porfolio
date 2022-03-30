import React from "react";
import "./NavButton.css";

export default function NavButton({ onClick = () => null, text = "button" }) {
  return (
    <div className="NavButton" onClick={onClick}>
      <p class="animated-word">{text}</p>
    </div>
  );
}
