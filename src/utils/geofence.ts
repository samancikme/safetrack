import type { DangerZone, LatLng, RectBounds } from "../types";

/** Returns true if the given point lies within the rectangular bounds (inclusive). */
export function isInsideBounds(point: LatLng, bounds: RectBounds): boolean {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
}

export function normalizeBounds(a: LatLng, b: LatLng): RectBounds {
  return {
    north: Math.max(a.lat, b.lat),
    south: Math.min(a.lat, b.lat),
    east: Math.max(a.lng, b.lng),
    west: Math.min(a.lng, b.lng),
  };
}

export interface GeofenceTransition {
  zone: DangerZone;
  entered: boolean; // true = OUTSIDE -> INSIDE, false = INSIDE -> OUTSIDE
}

/**
 * Evaluates a device position against a set of zones and returns the updated
 * zones (with deviceInside recalculated) plus any edge transitions that
 * occurred (entry/exit), so callers can trigger events exactly once per edge.
 */
export function evaluateGeofence(
  point: LatLng,
  zones: DangerZone[]
): { zones: DangerZone[]; transitions: GeofenceTransition[] } {
  const transitions: GeofenceTransition[] = [];

  const updated = zones.map((zone) => {
    if (!zone.active) {
      if (zone.deviceInside) {
        transitions.push({ zone, entered: false });
      }
      return { ...zone, deviceInside: false };
    }

    const nowInside = isInsideBounds(point, zone);

    if (nowInside && !zone.deviceInside) {
      transitions.push({ zone: { ...zone, deviceInside: true }, entered: true });
    } else if (!nowInside && zone.deviceInside) {
      transitions.push({ zone: { ...zone, deviceInside: false }, entered: false });
    }

    return { ...zone, deviceInside: nowInside };
  });

  return { zones: updated, transitions };
}
