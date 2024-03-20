import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/m-plus-1p";

import Delaunay from "./components/Delaunay";
import Graph from "./components/Graph";
import Simple from "./components/Simple";
import SvgGraph from "./components/SvgGraph";
import ZoomDelaunay from "./components/ZoomDelaunay";
import ZoomGraph from "./components/ZoomGraph";

function App() {
  return (
    <>
      <h1>visxについて</h1>
      <section>
        <h2>Svg</h2>
        <p>Svgキャンバスの表示について</p>
        <SvgGraph />
      </section>
      <section>
        <h2>Simple</h2>
        <p>visxを用いて普通の散布図を作成する</p>
        <Simple />
      </section>
      <section>
        <h2>Zoom</h2>
        <p>散布図に対して拡大縮小を行える様にして、密な場所を見やすくする</p>
        <ZoomGraph />
      </section>
      <section>
        <h2>Delaunay (voronoi)</h2>
        <p>散布図上のマウスと最も近いポイントを求め、そのデータの詳細を見れる様にする</p>
        <Delaunay />
      </section>
      <section>
        <h2>Zoom + Delaunay (voronoi)</h2>
        <p>ZoomとDelaunay (voronoi)を組み合わせる</p>
        <ZoomDelaunay />
      </section>
      <section>
        <h2>応用</h2>
        <p>色々機能を使ってみる</p>
        <Graph />
      </section>
    </>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
