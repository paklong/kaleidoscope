import React, { useEffect, useRef } from "react";
import p5 from "p5";
import "./App.css";

const App = () => {
  const sketchRef = useRef();
  const p5InstanceRef = useRef(null); // Store p5 instance
  const symmetryRef = useRef(6); // Use ref to share symmetry with p5
  const colorRef = useRef("#ffffff"); // Use ref to share color with p5, default white
  const modeRef = useRef("line"); // Use ref to share drawing mode, default line

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.describe(
          `Dark grey canvas that reflects ${modeRef.current}s drawn within it in ${symmetryRef.current} sections.`,
        );
        p.createCanvas(1000, 1000);
        p.angleMode(p.DEGREES);
        p.background(50); // Only called once to set initial background
      };

      p.draw = () => {
        const symmetry = symmetryRef.current; // Get current symmetry value
        const angle = 360 / symmetry;
        const currentColor = colorRef.current; // Get current color value
        const currentMode = modeRef.current; // Get current drawing mode

        p.translate(p.width / 2, p.height / 2);

        if (
          p.mouseX > 0 &&
          p.mouseX < p.width &&
          p.mouseY > 0 &&
          p.mouseY < p.height
        ) {
          let x = p.mouseX - p.width / 2;
          let y = p.mouseY - p.height / 2;
          let px = p.pmouseX - p.width / 2;
          let py = p.pmouseY - p.height / 2;

          if (p.mouseIsPressed === true) {
            for (let i = 0; i < symmetry; i++) {
              p.rotate(angle);
              p.stroke(currentColor); // Use the dynamic color
              p.strokeWeight(3);
              p.noFill(); // Outline only

              if (currentMode === "line") {
                p.line(x, y, px, py); // Draw line
              } else if (currentMode === "dot") {
                p.point(x, y); // Draw dot
              } else if (currentMode === "square") {
                p.rectMode(p.CENTER);
                p.rect(x, y, 20, 20); // Draw square
              } else if (currentMode === "circle") {
                p.ellipse(x, y, 20, 20); // Draw circle
              } else if (currentMode === "triangle") {
                p.triangle(x, y, x - 15, y + 20, x + 15, y + 20); // Draw triangle
              }

              p.push();
              p.scale(1, -1);
              if (currentMode === "line") {
                p.line(x, y, px, py);
              } else if (currentMode === "dot") {
                p.point(x, y);
              } else if (currentMode === "square") {
                p.rectMode(p.CENTER);
                p.rect(x, y, 20, 20);
              } else if (currentMode === "circle") {
                p.ellipse(x, y, 20, 20);
              } else if (currentMode === "triangle") {
                p.triangle(x, y, x - 15, y + 20, x + 15, y + 20);
              }
              p.pop();
            }
          }
        }
      };
    };

    // Initialize p5 instance once
    p5InstanceRef.current = new p5(sketch, sketchRef.current);

    // Cleanup on unmount
    return () => {
      p5InstanceRef.current.remove();
    };
  }, []); // Empty dependency array: runs once on mount

  // Handle symmetry change
  const handleSymmetryChange = (event) => {
    symmetryRef.current = Number(event.target.value); // Update ref directly
  };

  // Handle color change
  const handleColorChange = (event) => {
    colorRef.current = event.target.value; // Update ref directly with hex color
  };

  // Handle mode change
  const handleModeChange = (event) => {
    modeRef.current = event.target.value; // Update ref directly
  };

  // Handle clear canvas
  const handleClearCanvas = () => {
    p5InstanceRef.current.background(50); // Clears to dark grey
  };

  // Handle download canvas
  const handleDownload = () => {
    p5InstanceRef.current.saveCanvas("my-drawing", "png"); // Downloads as PNG
  };

  // Generate symmetry options from 2 to 30 with step 2
  const symmetryOptions = [];
  for (let i = 2; i <= 30; i += 2) {
    symmetryOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    );
  }

  // Drawing mode options
  const modeOptions = [
    { value: "line", label: "Line" },
    { value: "dot", label: "Dot" },
    // { value: "square", label: "Square" },
    // { value: "circle", label: "Circle" },
    // { value: "triangle", label: "Triangle" },
  ];

  return (
    <div>
      <header className="header">
        <h1>Kaleidoscope</h1> {/* Add your title here */}
      </header>
      <div>
        <label htmlFor="symmetry-select">Symmetry: </label>
        <select
          id="symmetry-select"
          defaultValue={6}
          onChange={handleSymmetryChange}
        >
          {symmetryOptions}
        </select>
        <label htmlFor="mode-select">Mode: </label>
        <select
          id="mode-select"
          defaultValue="line" // Default to line
          onChange={handleModeChange}
        >
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor="color-picker">Color: </label>
        <input
          id="color-picker"
          type="color"
          defaultValue="#ffffff" // Default white
          onChange={handleColorChange}
        />
        <button onClick={handleClearCanvas}>Clear Canvas</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <div ref={sketchRef} className="sketch-canvas" />
      <footer className="footer">
        <p>Contact: paklong2556@gmail.com</p>
      </footer>
    </div>
  );
};

export default App;
