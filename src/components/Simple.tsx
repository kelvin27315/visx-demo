import { scaleLinear } from "@visx/scale";
import React, { Fragment } from "react";

import type { Data } from "../data/data.ts";

function generateData(): Data[] {
  return new Array(31).fill(null).map((_, i) => ({
    id: `ID:${i}`,
    x: i * 20 - 100,
    y: i * 20 - 100,
  }));
}

export default function Simple() {
  const width = 400;
  const height = 400;
  const data = generateData();
  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));
  const yMin = Math.min(...data.map((d) => d.y));
  const yMax = Math.max(...data.map((d) => d.y));

  const xScale = scaleLinear({
    domain: [xMin, xMax],
    range: [0, width],
  });

  const yScale = scaleLinear<number>({
    domain: [yMin, yMax],
    range: [height, 0],
  });

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={"#E3E3E3"} />
        {data.map((d) => (
          <Fragment key={d.id}>
            <circle cx={xScale(d.x)} cy={yScale(d.y)} r={2} fill={"#000"} />
            <text x={xScale(d.x)} y={yScale(d.y)}>
              (x: {Math.round(d.x)}, y: {Math.round(d.y)})
            </text>
          </Fragment>
        ))}
      </svg>
    </div>
  );
}
