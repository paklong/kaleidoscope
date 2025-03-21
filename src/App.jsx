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
        const headerHeight = 50;
        const controlsHeight = 100;
        const footerHeight = 30;
        const padding = 40;
        const availableHeight =
          window.innerHeight -
          (headerHeight + controlsHeight + footerHeight + padding);
        const size = Math.min(window.innerWidth * 0.9, availableHeight);
        p.createCanvas(size, size);
        p.describe(
          `Dark grey canvas that reflects ${modeRef.current}s drawn within it in ${symmetryRef.current} sections.`,
        );
        p.angleMode(p.DEGREES);
        p.background(50);
      };

      p.windowResized = () => {
        const headerHeight = 50;
        const controlsHeight = 100;
        const footerHeight = 30;
        const padding = 40;
        const availableHeight =
          window.innerHeight -
          (headerHeight + controlsHeight + footerHeight + padding);
        const size = Math.min(window.innerWidth * 0.9, availableHeight);
        p.resizeCanvas(size, size);
        p.background(50);
      };

      p.draw = () => {
        const symmetry = symmetryRef.current;
        const angle = 360 / symmetry;
        const currentColor = colorRef.current;
        const currentMode = modeRef.current;

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
              p.stroke(currentColor);
              p.strokeWeight(3);
              p.noFill();

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

    p5InstanceRef.current = new p5(sketch, sketchRef.current);

    return () => {
      p5InstanceRef.current.remove();
    };
  }, []);

  const handleSymmetryChange = (event) => {
    symmetryRef.current = Number(event.target.value);
  };

  const handleColorChange = (event) => {
    colorRef.current = event.target.value;
  };

  const handleModeChange = (event) => {
    modeRef.current = event.target.value;
  };

  const handleClearCanvas = () => {
    p5InstanceRef.current.background(50);
  };

  const handleDownload = () => {
    p5InstanceRef.current.saveCanvas("my-drawing", "png");
  };

  const symmetryOptions = [];
  for (let i = 2; i <= 30; i += 2) {
    symmetryOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    );
  }

  const modeOptions = [
    { value: "line", label: "Line" },
    { value: "dot", label: "Dot" },
    // { value: "square", label: "Square" },
    // { value: "circle", label: "Circle" },
    // { value: "triangle", label: "Triangle" },
  ];

  return (
    <div className="app-container">
      <header className="header">
        <h1>Kaleidoscope</h1>
      </header>
      <div className="controls">
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
          defaultValue="line"
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
          defaultValue="#ffffff"
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
