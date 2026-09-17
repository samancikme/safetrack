import { useCallback, useState } from "react";
import type { LatLng } from "../types";

/**
 * Manages the "select device location on map" interaction mode.
 * When active, the next map click should be captured as the new fake
 * GPS position for the device.
 */
export function useFakeGps(onLocationPicked: (point: LatLng) => void) {
  const [isPicking, setIsPicking] = useState(false);

  const startPicking = useCallback(() => setIsPicking(true), []);
  const cancelPicking = useCallback(() => setIsPicking(false), []);

  const handleMapClick = useCallback(
    (point: LatLng) => {
      if (!isPicking) return;
      onLocationPicked(point);
      setIsPicking(false);
    },
    [isPicking, onLocationPicked]
  );

  return { isPicking, startPicking, cancelPicking, handleMapClick };
}
