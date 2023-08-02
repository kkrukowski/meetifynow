import { query } from "express";
import { set } from "mongoose";
import React, { useState } from "react";
import TimeSelectionTable from "./TimeSelectionTable";

function App() {
  return (
    <div className="App">
      <TimeSelectionTable />
    </div>
  );
}

export default App;
