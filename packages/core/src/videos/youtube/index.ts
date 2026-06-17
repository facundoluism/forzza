/**
 * youtube/index.ts — Barrel de la subcarpeta del adapter de YouTube.
 *
 * Re-exporta SOLO lo de esta subcarpeta. El barrel raíz de packages/core
 * (src/index.ts) lo wirea otro paso del sistema de videos.
 */

export * from "./types";
export { RealYouTubeClient, parseIso8601Duration, mapVideoItem } from "./client";
export type { RealYouTubeClientConfig } from "./client";
export { MockYouTubeClient, pickFixtureFile } from "./mock";
export type { MockYouTubeClientConfig } from "./mock";
