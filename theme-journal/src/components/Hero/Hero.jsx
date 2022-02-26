import React from "react";
import ParticlesBg from "particles-bg";
export default function Hero(props) {
  return (
    <div className="hero">
      <h1>Journaling, your way</h1>
      <ParticlesBg className="particles" type="color" bg={true} num="2" />
    </div>
  );
}
