import React, { Fragment } from "react";

import { Data } from "../data/data.ts";

function generateData(): Data[] {
  return new Array(31).fill(null).map((_, i) => ({
    id: `ID:${i}`,
    x: i * 20 - 100,
    y: i * 20 - 100,
  }));
}

export default function SvgGraph() {
  const width = 400;
  const height = 400;
  const data = generateData();

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={"#E3E3E3"} />
      {data.map((d) => (
        <Fragment key={d.id}>
          <circle cx={d.x} cy={d.y} r={2} fill={"#000"} />
          <text x={d.x} y={d.y}>
            (x: {d.x}, y: {d.y})
          </text>
        </Fragment>
      ))}
    </svg>
  );
}
