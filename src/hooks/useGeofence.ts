import { useEffect, useRef } from "react";
import type { SafeZone, LatLng } from "../types";
import { evaluateGeofence, type GeofenceTransition } from "../utils/geofence";

/**
 * Watches device position against Safe Zones.
 * Invokes onTransitions when device enters or exits safe boundaries.
 */
export function useGeofence(
  point: LatLng | null,
  zones: SafeZone[],
  onTransitions: (transitions: GeofenceTransition[], updatedZones: SafeZone[]) => void
) {
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  useEffect(() => {
    if (!point) return;
    const { zones: updated, transitions } = evaluateGeofence(point, zonesRef.current);
    if (transitions.length > 0) {
      onTransitions(transitions, updated);
    } else {
      const changed = updated.some((z, i) => z.deviceInside !== zonesRef.current[i]?.deviceInside);
      if (changed) onTransitions([], updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.lat, point?.lng, zones.length]);
}
