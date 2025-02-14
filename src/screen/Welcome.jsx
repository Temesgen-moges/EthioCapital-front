import React from "react";
import { useNavigate } from "react-router-dom";
import Three from "../welcome/Three";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Three />
    </div>
  );
};

export default Welcome;
