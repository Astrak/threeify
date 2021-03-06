//
// based on BoxBufferGeometry from Three.js
//
// Authors:
// * @bhouston
//

import { Vector3 } from "../../math/Vector3";
import { Float32AttributeAccessor, Int32AttributeAccessor } from "../AttributeAccessor";
import { Geometry } from "../Geometry";

export function box(
  width = 1,
  height = 1,
  depth = 1,
  widthSegments = 1,
  heightSegments = 1,
  depthSegments = 1,
): Geometry {
  // buffers

  const indices: number[] = [];
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  // helper variables

  const numberOfVertices = 0;

  function buildPlane(
    u: number,
    v: number,
    w: number,
    udir: number,
    vdir: number,
    width: number,
    height: number,
    depth: number,
    gridX: number,
    gridY: number,
  ): void {
    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const depthHalf = depth / 2;

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const vector = new Vector3();

    // generate vertices, normals and uvs

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf;

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf;

        // set values to correct vector component

        vector.setComponent(u, x * udir);
        vector.setComponent(v, y * vdir);
        vector.setComponent(w, depthHalf);

        // now apply vector to vertex buffer

        vertices.push(vector.x, vector.y, vector.z);

        // set values to correct vector component

        vector.setComponent(u, 0);
        vector.setComponent(v, 0);
        vector.setComponent(w, depth > 0 ? 1 : -1);

        // now apply vector to normal buffer

        normals.push(vector.x, vector.y, vector.z);

        // uvs

        uvs.push(ix / gridX);
        uvs.push(1 - iy / gridY);
      }
    }

    // indices

    // 1. you need three indices to draw a single face
    // 2. a single segment consists of two faces
    // 3. so we need to generate six (2*3) indices per segment

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = numberOfVertices + ix + gridX1 * iy;
        const b = numberOfVertices + ix + gridX1 * (iy + 1);
        const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
        const d = numberOfVertices + (ix + 1) + gridX1 * iy;

        // faces

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
  }

  // build each side of the box geometry

  buildPlane(2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments); // px
  buildPlane(2, 1, 0, 1, -1, depth, height, -width, depthSegments, heightSegments); // nx
  buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments); // py
  buildPlane(0, 2, 1, 1, -1, width, depth, -height, widthSegments, depthSegments); // ny
  buildPlane(0, 1, 2, 1, -1, width, height, depth, widthSegments, heightSegments); // pz
  buildPlane(0, 1, 2, -1, -1, width, height, -depth, widthSegments, heightSegments); // nz

  // build geometry

  const geometry = new Geometry();

  geometry.setIndices(new Int32AttributeAccessor(new Int32Array(indices), 1));
  geometry.attributeAccessors.set("position", new Float32AttributeAccessor(new Float32Array(vertices), 3));
  geometry.attributeAccessors.set("normal", new Float32AttributeAccessor(new Float32Array(normals), 3));
  geometry.attributeAccessors.set("uv", new Float32AttributeAccessor(new Float32Array(uvs), 2));

  return geometry;
}
