import { voronoi, Polygon } from "@visx/delaunay";
import { localPoint } from "@visx/event";
import { scaleLinear } from "@visx/scale";
import { Zoom } from "@visx/zoom";
import React, { useMemo, useState, useRef, Fragment } from "react";

import { Data, generateData } from "../data/data.ts";

export default function ZoomDelaunay() {
  const width = 400;
  const height = 400;
  const volume = 100;
  const data = useMemo(() => generateData(volume), [volume]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredData, setHoveredData] = useState<Data | null>(null);

  const xScale = scaleLinear({
    domain: [0, 400],
    range: [0, width],
  });
  const yScale = scaleLinear({
    domain: [0, 400],
    range: [height, 0],
  });

  const voronoiDiagram = voronoi<Data>({
    data: data,
    x: (d) => xScale(d.x),
    y: (d) => yScale(d.y),
    width: width,
    height: height,
  });

  return (
    <Zoom<SVGSVGElement> width={width} height={height}>
      {(zoom) => (
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
          <g
            transform={zoom.toString()}
            onMouseMove={(event) => {
              if (!svgRef.current) return;
              const point = localPoint(svgRef.current, event);
              if (!point) return;
              const closest = voronoiDiagram.delaunay.find(
                point.x * zoom.invert().scaleX + zoom.invert().translateX,
                point.y * zoom.invert().scaleY + zoom.invert().translateY,
              );
              setHoveredData(data[closest]);
            }}
            onMouseLeave={() => {
              setHoveredData(null);
            }}
            ref={svgRef}
          >
            {data.map((d, i) => (
              <Fragment key={d.id}>
                <circle cx={xScale(d.x)} cy={yScale(d.y)} r={2 * zoom.invert().scaleY} fill={"#000"} />
                <Polygon
                  polygon={voronoiDiagram.cellPolygon(i)}
                  fill={"#F00"}
                  stroke={"#222"}
                  fillOpacity={hoveredData?.id === d.id ? 0.5 : 0}
                />
              </Fragment>
            ))}
            <rect x={0} y={0} width={width} height={height} fillOpacity={0} />
            {hoveredData && (
              <>
                <rect
                  x={xScale(hoveredData.x) + 4 * zoom.invert().scaleX}
                  y={yScale(hoveredData.y) - 20 * zoom.invert().scaleY}
                  width={124 * zoom.invert().scaleX}
                  height={24 * zoom.invert().scaleY}
                  fill={"#FFF"}
                  stroke={"#000"}
                  strokeWidth={zoom.invert().scaleY}
                />
                <text
                  x={xScale(hoveredData.x) + 6 * zoom.invert().scaleX}
                  y={yScale(hoveredData.y) - 4 * zoom.invert().scaleY}
                  fontSize={16 * zoom.invert().scaleY}
                >
                  (x: {Math.round(hoveredData.x)}, y: {Math.round(hoveredData.y)})
                </text>
              </>
            )}
          </g>
        </svg>
      )}
    </Zoom>
  );
}
