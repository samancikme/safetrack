import { useEffect, useRef } from "react";
import type { DangerZone, LatLng } from "../types";
import { evaluateGeofence, type GeofenceTransition } from "../utils/geofence";

/**
 * Watches a device position against a set of zones and invokes
 * onTransition exactly once per OUTSIDE->INSIDE or INSIDE->OUTSIDE edge.
 * Also reports the recalculated zone list (with deviceInside flags) via
 * onZonesUpdated so callers can persist it.
 */
export function useGeofence(
  point: LatLng | null,
  zones: DangerZone[],
  onTransitions: (transitions: GeofenceTransition[], updatedZones: DangerZone[]) => void
) {
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  useEffect(() => {
    if (!point) return;
    const { zones: updated, transitions } = evaluateGeofence(point, zonesRef.current);
    if (transitions.length > 0) {
      onTransitions(transitions, updated);
    } else {
      // still push the normalized inside-state so UI (e.g. table) reflects reality
      const changed = updated.some((z, i) => z.deviceInside !== zonesRef.current[i]?.deviceInside);
      if (changed) onTransitions([], updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.lat, point?.lng, zones.length]);
}
