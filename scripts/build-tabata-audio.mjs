#!/usr/bin/env node
// build-tabata-audio — genera los efectos de sonido del Tabata inteligente.
// Tonos sintéticos (sin assets externos ni derechos): se escriben como WAV
// PCM 16-bit mono 44.1 kHz en apps/mobile/assets/audio/.
//
// Uso: node scripts/build-tabata-audio.mjs
// Cross-platform (Windows/macOS/Linux). Reproducible: mismo output siempre.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 44100;
const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(here, "..", "apps", "mobile", "assets", "audio");

/**
 * Genera muestras PCM float (-1..1) concatenando segmentos de tono.
 * Cada segmento: { freq (Hz), ms, gain }. Se aplica un fade in/out de 8 ms
 * para evitar clicks. freq=0 => silencio.
 */
function renderSegments(segments) {
  const samples = [];
  const fadeSamples = Math.round((8 / 1000) * SAMPLE_RATE);
  for (const { freq, ms, gain = 0.6 } of segments) {
    const n = Math.round((ms / 1000) * SAMPLE_RATE);
    for (let i = 0; i < n; i += 1) {
      let amp = gain;
      if (i < fadeSamples) amp *= i / fadeSamples;
      if (i > n - fadeSamples) amp *= Math.max(0, (n - i) / fadeSamples);
      const value = freq === 0 ? 0 : Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE);
      samples.push(value * amp);
    }
  }
  return samples;
}

function toWav(samples) {
  const dataLength = samples.length * 2; // 16-bit
  const buffer = Buffer.alloc(44 + dataLength);
  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // audio format = PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  let offset = 44;
  for (const s of samples) {
    const clamped = Math.max(-1, Math.min(1, s));
    buffer.writeInt16LE(Math.round(clamped * 32767), offset);
    offset += 2;
  }
  return buffer;
}

// tick: aviso corto y agudo para la cuenta regresiva de los últimos segundos.
const tick = renderSegments([{ freq: 1100, ms: 70, gain: 0.5 }]);
// start: tono ascendente que resalta el comienzo de trabajo/descanso.
const start = renderSegments([
  { freq: 660, ms: 90, gain: 0.6 },
  { freq: 990, ms: 160, gain: 0.6 },
]);
// finish: pequeño arpegio celebratorio al completar.
const finish = renderSegments([
  { freq: 660, ms: 130, gain: 0.6 },
  { freq: 880, ms: 130, gain: 0.6 },
  { freq: 1320, ms: 320, gain: 0.6 },
]);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "tick.wav"), toWav(tick));
writeFileSync(join(OUT_DIR, "start.wav"), toWav(start));
writeFileSync(join(OUT_DIR, "finish.wav"), toWav(finish));

console.log(`Assets de audio del Tabata generados en ${OUT_DIR}`);
console.log("  tick.wav, start.wav, finish.wav");
