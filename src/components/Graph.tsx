import { AxisBottom, AxisLeft } from "@visx/axis";
import { voronoi, Polygon } from "@visx/delaunay";
import { localPoint } from "@visx/event";
import { scaleLinear } from "@visx/scale";
import { Zoom } from "@visx/zoom";
import { ScaleLinear as Scale } from "d3-scale";
import React, { useMemo, useState, useRef, Fragment, useEffect } from "react";

interface Data {
  id: string;
  x: number;
  y: number;
}

function NormalRandom(): number {
  // logの中身を0にしないため
  const r1 = Math.random() + 0.0000001;
  const r2 = Math.random();
  return Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
}

function generateData(volume: number): Data[] {
  return new Array(volume).fill(null).map((_, i) => ({
    id: `ID:${i}`,
    x: NormalRandom() * 400,
    y: NormalRandom() * 400,
  }));
}

interface BaloonProps {
  data: Data;
  zoomInvRate: number;
  xScale: Scale<number, number>;
  yScale: Scale<number, number>;
}

function Baloon({ data, zoomInvRate, xScale, yScale }: BaloonProps) {
  const fontSize = 16;
  const text = `(x: ${Math.round(data.x)}, y: ${Math.round(data.y)})`;
  const padding = 3;

  const [ballonWidth, setBallonWidth] = useState<number>((text.length * fontSize + 2 * padding) * zoomInvRate);
  // fontSize*文字数だと全角半角の影響を受けるのでtextの幅を取得して吹き出しの横幅を決める
  useEffect(() => {
    const canvas = document.getElementById(`baloon:${data.id}`);
    const canvasWidth = canvas?.getBoundingClientRect().width ?? 0;
    const width = canvasWidth !== 0 ? canvasWidth : text.length * fontSize;
    setBallonWidth((width + 2 * padding) * zoomInvRate);
  }, [data.id, zoomInvRate, text.length]);

  return (
    <>
      <rect
        x={xScale(data.x) + 4 * zoomInvRate}
        y={yScale(data.y) - 20 * zoomInvRate}
        width={ballonWidth}
        height={24 * zoomInvRate}
        fill={"#FFF"}
        stroke={"#000"}
        strokeWidth={zoomInvRate}
      />
      <text
        id={`baloon:${data.id}`}
        x={xScale(data.x) + 6 * zoomInvRate}
        y={yScale(data.y) - 4 * zoomInvRate}
        fontSize={fontSize * zoomInvRate}
      >
        {text}
      </text>
    </>
  );
}

export default function Graph() {
  const width = 400;
  const height = 400;
  const volume = 100;
  const data = useMemo(() => generateData(volume), [volume]);

  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));
  const yMin = Math.min(...data.map((d) => d.y));
  const yMax = Math.max(...data.map((d) => d.y));
  const padding = 20;

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipTimeoutId, setTooltipTimeoutId] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<Data | null>(null);

  const xScale = scaleLinear({
    domain: [xMin - padding, xMax + padding],
    range: [0, width],
  });
  const yScale = scaleLinear<number>({
    domain: [yMin - padding, yMax + padding],
    range: [height, 0],
  });

  const voronoiDiagram = voronoi<Data>({
    data: data,
    x: (d) => xScale(d.x),
    y: (d) => yScale(d.y),
    width: width * 1.5,
    height: height * 1.5,
  });
  // マイナス方向にも余裕を持つ
  voronoiDiagram.xmin = -width * 0.5;
  voronoiDiagram.ymin = -height * 0.5;

  return (
    <Zoom<SVGSVGElement> width={width} height={height} scaleXMin={0.5} scaleXMax={7} scaleYMin={0.5} scaleYMax={7}>
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
            <g
              transform={zoom.toString()}
              onMouseMove={(event) => {
                if (!svgRef.current) return;
                if (tooltipTimeoutId) {
                  clearTimeout(tooltipTimeoutId);
                  setTooltipTimeoutId(null);
                }

                const point = localPoint(svgRef.current, event);
                if (!point) return;
                const closest = voronoiDiagram.delaunay.find(
                  point.x * zoom.invert().scaleX + zoom.invert().translateX,
                  point.y * zoom.invert().scaleY + zoom.invert().translateY,
                );
                setHoveredData(data[closest]);
              }}
              onMouseLeave={() => {
                setTooltipTimeoutId(
                  window.setTimeout(() => {
                    setHoveredData(null);
                  }, 400),
                );
              }}
              ref={svgRef}
            >
              <AxisBottom top={yScale(0)} scale={xScale} />
              <AxisLeft left={xScale(0)} scale={yScale} />
              {data.map((d, i) => (
                <Fragment key={d.id}>
                  <circle cx={xScale(d.x)} cy={yScale(d.y)} r={2 * zoom.invert().scaleY} fill={"#000"} />
                  <Polygon
                    polygon={voronoiDiagram.cellPolygon(i)}
                    fill={"#F00"}
                    stroke={"#222"}
                    strokeOpacity={0.1}
                    fillOpacity={hoveredData?.id === d.id ? 0.4 : 0}
                  />
                </Fragment>
              ))}
              <rect x={0} y={0} width={width} height={height} fillOpacity={0} />
              {hoveredData && (
                <Baloon data={hoveredData} zoomInvRate={zoom.invert().scaleX} xScale={xScale} yScale={yScale} />
              )}
            </g>
          </svg>
          <button onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>+</button>
          <button onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>-</button>
          <button onClick={() => zoom.reset()}>reset</button>
          <input
            type={"range"}
            // 対数スケールで扱う
            value={-Math.log(zoom.invert().scaleY)}
            max={Math.log(7)}
            min={Math.log(0.5)}
            step={Math.log(7) / 15}
            onChange={(event) => {
              zoom.scale({
                scaleX: zoom.invert().scaleX * Math.E ** event.target.value,
                scaleY: zoom.invert().scaleY * Math.E ** event.target.value,
              });
            }}
          />
        </>
      )}
    </Zoom>
  );
}
