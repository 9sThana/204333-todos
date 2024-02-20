import React from "react";
import load from "./assets/load.svg";

function Loading() {
  return (
    <div>
      <div className="loading">
        <img src={load} />
      </div>
    </div>
  );
}

export default Loading;
