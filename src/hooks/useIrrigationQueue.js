import { useCallback, useMemo, useState } from 'react';
import { INITIAL_QUEUE } from '../data/mockData';

/**
 * Simulated Deficit Round Robin (DRR) for shared borehole fairness.
 */
export function useIrrigationQueue() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [simulationStep, setSimulationStep] = useState(0);
  const [lastSimulatedAt, setLastSimulatedAt] = useState(null);

  const activePlot = useMemo(
    () => queue.find((p) => p.status === 'active'),
    [queue],
  );

  const advanceSixHours = useCallback(() => {
    setQueue((prev) => {
      const active = prev.find((p) => p.status === 'active');
      if (!active) return prev;

      // After 6h pumping: active plot recharges moisture, valve closes
      const updated = prev.map((plot) => {
        if (plot.plotId === active.plotId) {
          return {
            ...plot,
            soilMoisture: Math.min(58, plot.soilMoisture + 32),
            deficit: Math.max(40, plot.deficit - 28),
            priority: 'low',
            status: 'waiting',
            valveOpen: false,
          };
        }
        return { ...plot };
      });

      // DRR: pick next farmer with highest root-zone deficit
      const candidates = updated
        .filter((p) => p.status !== 'active')
        .map((p) => ({
          ...p,
          effectiveDeficit: p.deficit,
        }))
        .sort((a, b) => b.effectiveDeficit - a.effectiveDeficit);

      const next = candidates[0];
      if (!next) return updated;

      return updated.map((plot) => {
        if (plot.plotId === next.plotId) {
          return {
            ...plot,
            status: 'active',
            priority: 'critical',
            valveOpen: true,
            soilMoisture: Math.min(plot.soilMoisture + 4, 95),
          };
        }
        if (plot.plotId === active.plotId) {
          return plot;
        }
        // Re-rank waiting plots by deficit for display priorities
        const rank = candidates.findIndex((c) => c.plotId === plot.plotId);
        let priority = 'low';
        let status = 'waiting';
        if (rank === 1) {
          priority = 'high';
          status = 'next';
        } else if (rank === 2) {
          priority = 'medium';
        }
        return { ...plot, priority, status, valveOpen: false };
      });
    });

    setSimulationStep((s) => s + 1);
    setLastSimulatedAt(new Date());
  }, []);

  const resetQueue = useCallback(() => {
    setQueue(INITIAL_QUEUE.map((p) => ({ ...p })));
    setSimulationStep(0);
    setLastSimulatedAt(null);
  }, []);

  return {
    queue,
    simulationStep,
    lastSimulatedAt,
    activePlot,
    advanceSixHours,
    resetQueue,
  };
}
