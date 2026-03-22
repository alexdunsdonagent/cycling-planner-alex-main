/**
 * Converts a route object to valid GPX XML.
 * @param {Object} route - Route object with name and waypoints
 * @param {string} route.name - Route name
 * @param {Array<{lat: number, lng: number, name?: string}>} route.waypoints - Array of waypoints
 * @returns {string} Valid GPX XML string
 */
export function routeToGpx(route) {
  const { name = "Unnamed Route", waypoints = [] } = route;
  const now = new Date().toISOString();

  const trackPoints = waypoints
    .map(
      (wp) =>
        `    <trkpt lat="${wp.lat}" lon="${wp.lng}">${
          wp.name ? `\n      <name>${escapeXml(wp.name)}</name>` : ""
        }</trkpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="CyclingTripsPlanner"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <time>${now}</time>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Triggers a GPX file download in the browser.
 * @param {Object} route - Route object with name and waypoints
 */
export function downloadGpx(route) {
  const gpx = routeToGpx(route);
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(route.name || "route").replace(/[^a-z0-9]/gi, "-").toLowerCase()}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
