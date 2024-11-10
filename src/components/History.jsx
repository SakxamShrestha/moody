import React from "react";
import Background from "./Background";
import Foreground from "./Foreground";

export default function History() {
  return (
    <div className="absolute w-full h-screen bg-zinc-800">
      <Background />
      <Foreground />
    </div>
  );
}
