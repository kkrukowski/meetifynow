import React, { useState } from "react";

export default function SwitchButton(props: {
  isAnsweringMode: boolean;
  toggleAnsweringMode: () => void;
}) {
  return (
    <div
      className={`flex w-14 h-8 p-1 bg-primary mx-4 rounded-lg transition-all ${
        !props.isAnsweringMode ? "bg-primary-active" : ""
      }`}
      onClick={() => props.toggleAnsweringMode()}
    >
      <div
        className={`h-6 w-6 bg-light rounded-lg shadow transition-all ${
          !props.isAnsweringMode ? "ml-6" : ""
        }`}
      ></div>
    </div>
  );
}
