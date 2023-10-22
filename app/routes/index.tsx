import type { Context } from "sonik";
import Zoom from "../islands/Zoom";
import Delaunay from "../islands/Delaunay";
import ZoomDelaunay from "../islands/ZoomDelaunay";

export default async function Index(c: Context) {
  return c.render(
    <>
      <h1>VISX-DEMO</h1>
      <section>
        <h2>Zoom</h2>
        <Zoom />
      </section>
      <section>
        <h2>Delaunay - voronoi</h2>
        <Delaunay />
      </section>
      <section>
        <h2>Zoom + Delaunay - voronoi</h2>
        <ZoomDelaunay />
      </section>
    </>,
  );
}
