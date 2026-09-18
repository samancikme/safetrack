import type { SafeZone, LatLng, RectBounds } from "../types";

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
  zone: SafeZone;
  exitedSafeZone: boolean; // true = Exited safe perimeter (DANGER!), false = Returned inside safe perimeter (SAFE)
}

/**
 * Evaluates device position against Safe Zones.
 * Triggers exitedSafeZone = true when device moves OUTSIDE a safe perimeter.
 */
export function evaluateGeofence(
  point: LatLng,
  zones: SafeZone[]
): { zones: SafeZone[]; transitions: GeofenceTransition[] } {
  const transitions: GeofenceTransition[] = [];

  const updated = zones.map((zone) => {
    if (!zone.active) {
      return { ...zone, deviceInside: false };
    }

    const nowInside = isInsideBounds(point, zone);

    // Device was inside safe zone and now moved OUTSIDE -> DANGER!
    if (!nowInside && zone.deviceInside) {
      transitions.push({ zone: { ...zone, deviceInside: false }, exitedSafeZone: true });
    }
    // Device was outside safe zone and now moved INSIDE -> RETURNED TO SAFE AREA
    else if (nowInside && !zone.deviceInside) {
      transitions.push({ zone: { ...zone, deviceInside: true }, exitedSafeZone: false });
    }

    return { ...zone, deviceInside: nowInside };
  });

  return { zones: updated, transitions };
}
