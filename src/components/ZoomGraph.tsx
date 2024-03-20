import { scaleLinear } from "@visx/scale";
import { Zoom } from "@visx/zoom";
import React, { Fragment } from "react";

import { generateData } from "../data/data.ts";

export default function ZoomGraph() {
  const width = 400;
  const height = 400;
  const data = generateData(100);

  const xScale = scaleLinear({
    domain: [0, 400],
    range: [0, width],
  });

  const yScale = scaleLinear({
    domain: [0, 400],
    range: [height, 0],
  });

  return (
    <Zoom<SVGSVGElement> width={width} height={height}>
      {(zoom) => (
        <>
          <svg
            width={width}
            height={height}
            style={{
              cursor: zoom.isDragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
            ref={zoom.containerRef}
          >
            <rect x={0} y={0} width={width} height={height} fill={"#E3E3E3"} />
            <g transform={zoom.toString()}>
              {data.map((d) => (
                <Fragment key={d.id}>
                  <circle cx={xScale(d.x)} cy={yScale(d.y)} r={2 * zoom.invert().scaleX} fill={"#000"} />
                  <text x={xScale(d.x)} y={yScale(d.y)} fontSize={16 * zoom.invert().scaleX}>
                    (x: {Math.round(d.x)}, y: {Math.round(d.y)})
                  </text>
                </Fragment>
              ))}
            </g>
          </svg>
          <button onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>+</button>
          <button onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>-</button>
          <button onClick={() => zoom.reset()}>reset</button>
        </>
      )}
    </Zoom>
  );
}
