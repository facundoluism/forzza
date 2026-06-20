-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts
-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json
-- Regenerar con: pnpm videos:generate

BEGIN;

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.782, '{"text":0.5,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'mMieHCr-H0c', '5 MINUTOS DE ABDOMINALES INTENSOS', 'UCfwP2H1CDJvssk6g2pm8EgA', 'gymvirtual', 332, 0.8883, '{"text":1,"channel":1,"engagement":0.691499543750374,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.782, '{"text":0.5,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.7713, '{"text":0.3333333333333333,"channel":1,"engagement":0.8563254921614221,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-dips-cable'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'd8IEGU9BrLU', 'Por ESTO te Cuesta Hacer los FONDOS en Paralelas | Técnica REAL aquí', 'UCLNaMWbEx9fa4V6oe5wxEkA', 'PRO-BARRAS', 343, 0.5658, '{"text":0.5,"channel":0,"engagement":0.8289952873324032,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-dips-cable'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7998, '{"text":1,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'lgE47t3dr2Q', 'DOMINADAS Asistidas en MÁQUINA TUTORIAL', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 135, 0.6312, '{"text":1,"channel":0,"engagement":0.6561611984455199,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7998, '{"text":1,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'npyLB-7o19o', 'Desbloquea tus primeras DOMINADAS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 285, 0.5371, '{"text":0.5,"channel":0,"engagement":0.935475783925844,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'nAcG01Pe0Nc', 'His Back Extension Is CRAZY!🤯', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 58, 0.7931, '{"text":0.5,"channel":1,"engagement":0.965536717557942,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-incline-bench'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'aYGRgupuBdw', 'Domina el Crunch en Banco Declinable paso a paso', 'UCDQT-KZuuJ_PMR58nuYGLTg', 'MH Entrenamiento - Mr. Glúteo', 43, 0.4494, '{"text":0.25,"channel":0,"engagement":0.8721387520991565,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'back-extension-incline-bench'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'H8Swl1N-uis', 'STOP Doing Back Extensions Like This!', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 220, 0.7513, '{"text":0.5,"channel":1,"engagement":0.7564951654761372,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'khhAS-FT_A0', 'Cómo desarrollar tu espalda con solo 3 ejercicios 💪', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 58, 0.7452, '{"text":0.3333333333333333,"channel":1,"engagement":0.9758232977124582,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'p9RihhjmJsw', 'How to Execute a Bent Over Row', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 37, 0.8553, '{"text":0.75,"channel":1,"engagement":0.9014903314474473,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bent-over-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '2J61UenaFRw', 'Así debes hacer el remo con barra', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 60, 0.9388, '{"text":1,"channel":1,"engagement":0.9438757973324629,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bent-over-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'QZEqB6wUPxQ', 'How To: Barbell Bicep Curl | 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 370, 0.9439, '{"text":1,"channel":1,"engagement":0.733142662135272,"duration":0.9722222222222222,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.6822, '{"text":1,"channel":0,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '7D96dK6oaP8', 'Core Stability: Side  Bends or Suitcase Carry? |#AskSquatU Show Ep. 47|', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 399, 0.6953, '{"text":0.3333333333333333,"channel":1,"engagement":0.7806210002732704,"duration":0.8916666666666667,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-side-bend'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'q1fCgfieNEs', 'The SINGLE BEST Squat Tip I’ve Ever Used!', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 317, 0.8061, '{"text":0.5,"channel":1,"engagement":0.7802978109547658,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-squat'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'MnQ6MsoPHks', 'Como hacer la sentadilla correctamente | técnica para glúteos y para piernas', 'UC_zaLJ30yLlq5Pd86jdu_Og', 'NAYLA Vlogs', 161, 0.6858, '{"text":1,"channel":0,"engagement":0.9288387713541474,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-squat'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'LdhWBp5lWqc', 'How To: Standing Oblique Twists with Bar', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 100, 0.7442, '{"text":0.4,"channel":1,"engagement":0.620928210950356,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-twists-russian-twist-with-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'wThd4GBGbQc', 'EJERCICIOS ABDOMINALES PROHIBIDOS - Ejercicios para abdomen: Giros con pica', 'UCjGVbMdksC7kagTniVQfoPQ', 'FitCook', 169, 0.6709, '{"text":1,"channel":0,"engagement":0.8545557159243243,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-twists-russian-twist-with-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'amCU-ziHITM', 'How To: Barbell Upright Row', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 173, 0.9266, '{"text":1,"channel":1,"engagement":0.6331033488939187,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-upright-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'loL670Yb7nU', 'HOMBRO y TRAPECIO GRANDES - Remo al mentón (mi ejercicio estrella)', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 257, 0.697, '{"text":0.3333333333333333,"channel":1,"engagement":0.7351709815570052,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-upright-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '0cXAp6WhSj4', 'The PERFECT Bench Press (5 Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 58, 0.8475, '{"text":0.6666666666666666,"channel":1,"engagement":0.9875202653298837,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bench-press-barbell'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'jlFl7WJ1TzI', 'Cómo hacer press de banca CORRECTAMENTE para incrementar tus músculos (5 pasos sencillos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.886, '{"text":1,"channel":1,"engagement":0.836717130625341,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bench-press-barbell'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'ttvfGg9d76c', 'How To: Dumbbell Bent-Over Raise', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 102, 0.7483, '{"text":0.4,"channel":1,"engagement":0.6413830764176844,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bent-over-rear-delt-fly'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'JfMF84StvGo', 'PÁJARO de PIE con MANCUERNAS | ELEVACIONES POSTERIORES', 'UC3Rn-AuuDMQZAsVqaUrd8hg', 'APTA Vital Sport', 108, 0.5442, '{"text":0.75,"channel":0,"engagement":0.5962342711780682,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'bent-over-rear-delt-fly'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'M_uPvGrMx_o', 'How To: Arm Curl (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 100, 0.7757, '{"text":0.5,"channel":1,"engagement":0.6283598782801877,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bicep-curl-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.6822, '{"text":1,"channel":0,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'bicep-curl-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.7261, '{"text":0.3333333333333333,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'fx9VW2lDx_s', 'Curl de bíceps con soga en polea baja', 'UC_9_CYb4vxMPYMosJv1u0ZA', 'Abdias Sadrac', 67, 0.6161, '{"text":1,"channel":0,"engagement":0.5807151263440884,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.7461, '{"text":0.4,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-ez-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8122, '{"text":0.6,"channel":1,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-ez-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.6861, '{"text":0.2,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-straight-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8122, '{"text":0.6,"channel":1,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-straight-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '8Um35Es-ROE', 'How To: Cable Fly (High-To-Low) || 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 233, 0.7697, '{"text":0.6,"channel":1,"engagement":0.6986761352253078,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-fly-low-pulley'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OtW0EYqBczI', 'Cómo hacer APERTURAS, el ejercicio BÁSICO de toda rutina de pecho #gym #aperturas  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7115, '{"text":0.25,"channel":1,"engagement":0.9325432507665611,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-fly-low-pulley'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'JUDTGZh4rhg', 'STOP F*cking Up Cable Flys (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 411, 0.7012, '{"text":0.3333333333333333,"channel":1,"engagement":0.8270092122286649,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'WNtBIde3Qks', 'Deja de Arruinar El Cruce de Poleas PECHO ¡FORMA CORRECTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 411, 0.9237, '{"text":1,"channel":1,"engagement":0.9392076314697476,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crossover'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '8Um35Es-ROE', 'How To: Cable Fly (High-To-Low) || 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 233, 0.8147, '{"text":0.75,"channel":1,"engagement":0.6986761352253078,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crossover-high-to-low'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'XuQWMR4QKF0', 'Cómo hacer CRUNCH en polea', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 57, 0.9255, '{"text":1,"channel":1,"engagement":0.8773220347686083,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crunch'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'AV5PmZJIrrw', 'How to PROPERLY Cable Crunch to Shape Your Abs (How to Kneeling Cable Abdominal Crunch)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 292, 0.6414, '{"text":1,"channel":0,"engagement":0.7072430779388895,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-crunch-kneeling'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '4cbp_LG63qE', 'NO hagas así las ABDUCCIONES en POLEA [sobre todo si eres principiante]', 'UCMJwz5wPzC4QcsLTQMAKxPQ', 'Trainologym', 58, 0.4721, '{"text":0.3333333333333333,"channel":0,"engagement":0.8603962509198225,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-crunch-kneeling'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'ljgqer1ZpXg', 'STOP F*cking Up Face Pulls (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 382, 0.7492, '{"text":0.3333333333333333,"channel":1,"engagement":0.7766645318063644,"duration":0.9388888888888889,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-face-pull'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'UaZPhyztYNU', 'FACE PULL Polea Alta. Ejercicio de Hombro Posterior', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 72, 0.8708, '{"text":1,"channel":1,"engagement":0.6037567553606981,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-face-pull'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '91m1yw-oiac', 'Cable Rope Front Raise the RIGHT way💪🏽🔥#shoulder #shoulderworkout #delts #cableworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 94, 0.6376, '{"text":1,"channel":0,"engagement":0.6881244549177407,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-front-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'zUf3fJjdCig', 'Elevación frontal de HOMBRO en Polea Baja. Ejercicio de hombros frontal', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.8437, '{"text":1,"channel":1,"engagement":0.4686184502136278,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-front-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '91m1yw-oiac', 'Cable Rope Front Raise the RIGHT way💪🏽🔥#shoulder #shoulderworkout #delts #cableworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 94, 0.6376, '{"text":1,"channel":0,"engagement":0.6881244549177407,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-front-raise-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.7237, '{"text":0.5,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-front-raise-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '5jJNfIlKTmg', 'How to PROPERLY Cable Glute Kickback (GROW YOUR GLUTES)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 192, 0.6231, '{"text":1,"channel":0,"engagement":0.6153491305365993,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.7737, '{"text":0.6666666666666666,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '5jJNfIlKTmg', 'How to PROPERLY Cable Glute Kickback (GROW YOUR GLUTES)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 192, 0.6231, '{"text":1,"channel":0,"engagement":0.6153491305365993,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'ZRQAzrzE8_A', 'Glúteos más notorios usando polea 😍', 'UC2ZFIs_x0vtyrwdXGg8b9Sw', 'FRANK SERAPIÓN', 367, 0.5041, '{"text":0.5,"channel":0,"engagement":0.7801779586013774,"duration":0.9805555555555555,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '4cxt_Tldugw', '9 Hack Squat Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 1127, 0.7095, '{"text":0.6666666666666666,"channel":1,"engagement":0.7973039938991753,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-hack-squat'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'XusYaOMftMA', 'BICEPS - CURL MARTILLO POLEA', 'UCZ0We59vomlVrHdBPFGOFzQ', 'Rodrigo Metabolico', 42, 0.5367, '{"text":1,"channel":0,"engagement":0.4335319025927512,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hammer-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'pvnR8CDb4BU', 'How to Do Cable Hip Abduction Exercise', 'UCE8wCVw_ZfRw-D6RJ5EXWbw', 'LIVESTRONG', 91, 0.631, '{"text":1,"channel":0,"engagement":0.6551424694708277,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-abduction'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-abduction'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'GmRSV_n2E_0', 'How To: Hip Adduction (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 139, 0.8276, '{"text":0.6666666666666666,"channel":1,"engagement":0.6382416391720735,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-hip-adduction'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-adduction'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618377674771098,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-extension'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '7_cK3XVqN9M', 'Train Your Damn Hip Flexors!', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 60, 0.67, '{"text":0.3333333333333333,"channel":1,"engagement":0.6,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-flexion'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'mSejp5qK1pc', 'Ofit Live Tips - Abdominales: elevación de piernas y flexión de cadera', 'UCbF4xrC5aGWtLCcGKLD2wOQ', 'Ofit Live', 194, 0.4264, '{"text":0.3333333333333333,"channel":0,"engagement":0.6321090398805866,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-flexion'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'JUDTGZh4rhg', 'STOP F*cking Up Cable Flys (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 411, 0.7012, '{"text":0.3333333333333333,"channel":1,"engagement":0.8269676264639171,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-incline-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '-zbesyTNztQ', 'Cómo hacer press INCLINADO, el ejercicio BÁSICO de toda rutina de pecho #gym #pressinclinado  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 46, 0.8407, '{"text":0.6666666666666666,"channel":1,"engagement":0.9534715512080268,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-incline-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'GxDF2AYsI1Q', 'Cable Shoulder External Rotation', 'UC2dLsLMA7Fst_bpJkoRxHJQ', 'Physio Plus Fitness', 50, 0.4608, '{"text":0.6666666666666666,"channel":0,"engagement":0.5540275891580435,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-internal-rotation'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'DplyMccjRrE', '🟢ROTACIONES EXTERNAS de Hombro en Polea: ✅ Técnica PERFECTA y SEGURA', 'UCBhk0wiI7HzF3kg-WLYXgoQ', 'Vitar Club', 76, 0.5425, '{"text":0.6666666666666666,"channel":0,"engagement":0.4624781895895189,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-internal-rotation'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'f_OGBg2KxgY', 'Stop Messing Up Lateral Raises (Easy Fix)', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 44, 0.735, '{"text":0.3333333333333333,"channel":1,"engagement":0.9251504924407427,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '2Quux2aZodo', '¿Cuál Elevación es MEJOR para Hombros Grandes? ¡ES ESTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 390, 0.7316, '{"text":0.3333333333333333,"channel":1,"engagement":0.9496580927434991,"duration":0.9166666666666666,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'f_OGBg2KxgY', 'Stop Messing Up Lateral Raises (Easy Fix)', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 44, 0.71, '{"text":0.25,"channel":1,"engagement":0.9251504924407427,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise-single'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'gjUrYfNU1-M', 'Elevación Lateral Hombro Unilateral Polea Baja', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 30, 0.6561, '{"text":0.5,"channel":1,"engagement":0.530400282383737,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise-single'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '2MUEL4nL6hA', 'How to PROPERLY Cable Bicep Curl For Bigger Biceps (EASY FIX)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 73, 0.5412, '{"text":0.75,"channel":0,"engagement":0.5807842228776134,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-overhead-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'de_Xc1AKulo', 'Bíceps Bayesian. Curl de Bíceps en Polea Baja', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.7404, '{"text":0.6,"channel":1,"engagement":0.5519718603050862,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-overhead-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'GzmlxvSFE7A', 'How to PROPERLY Overhead Cable Tricep Extension | Fix Your Tricep Extension Form NOW!', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 223, 0.6336, '{"text":1,"channel":0,"engagement":0.6680151247622286,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-overhead-tricep-extension'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'P40-DvgM9qI', 'Tríceps Tras nuca en Polea Baja - Extensión de tríceps sobre la cabeza', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 118, 0.8574, '{"text":1,"channel":1,"engagement":0.536797711769613,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-overhead-tricep-extension'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'YWfioXCZCu0', 'Cable Pallof Press', 'UCO1Jc6PEQIbFc1c2y1bh85Q', 'UVM Campus Recreation', 32, 0.6215, '{"text":1,"channel":0,"engagement":0.6075527554679038,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-pallof-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'c-byXbLkWzY', 'Press Pallof con Banda o Polea / Ejercicio de Core isométrico', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 98, 0.853, '{"text":1,"channel":1,"engagement":0.5152424356192058,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pallof-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'pv8e6OSyETE', 'Cable Pull Through', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 11, 0.717, '{"text":1,"channel":1,"engagement":0.5850047028489198,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pull-through'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '72q0tKij5uU', 'Cómo Hacer Jalón Para Dorsales ¡EVITA ERRORES!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 355, 0.7083, '{"text":0.25,"channel":1,"engagement":0.9167190989308124,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pull-through'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'zEuseRjS7vg', 'What Is The Best Rear Delt Exercise?', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 56, 0.7597, '{"text":0.5,"channel":1,"engagement":0.7984086345545253,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'xhmvKbKq5as', 'El mejor ejercicio para deltoides posterior con mancuernas #deltoidesposterior #tips', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 43, 0.7853, '{"text":0.5,"channel":1,"engagement":0.9265648454432472,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'zEuseRjS7vg', 'What Is The Best Rear Delt Exercise?', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 56, 0.7297, '{"text":0.4,"channel":1,"engagement":0.7984086345545253,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly-single'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'evJBZ_8-2ik', 'PARA de Hacer Remo a una Mano Así ¡SALVA A UN AMIGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 30, 0.7493, '{"text":0.3333333333333333,"channel":1,"engagement":0.9964731031195392,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly-single'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'YykmcX2b-LY', 'Cable Shrug', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 9, 0.7142, '{"text":1,"channel":1,"engagement":0.570831856477169,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-shrug'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'mqTvt5xLFIY', 'Encogimiento de Trapecio En POLEA I Explicación Completa I Sergio Tejeda', 'UCY47VIwbDJVY8xH5wdLsRyA', 'Sergio Tejeda', 324, 0.5844, '{"text":1,"channel":0,"engagement":0.4220146848318936,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-shrug'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'G9uNaXGTJ4w', 'Straight Arm Pulldown', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 12, 0.6485, '{"text":0.75,"channel":1,"engagement":0.6173625082152338,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '3e-76jcA91w', 'Cómo hacer Jalón de Pecho PERFECTO! Vídeo completo en la descripción #espalda #consejos #gym', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7186, '{"text":0.25,"channel":1,"engagement":0.9680388920802042,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'G9uNaXGTJ4w', 'Straight Arm Pulldown', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 12, 0.6485, '{"text":0.75,"channel":1,"engagement":0.6173625082152338,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '-UrSFw0QPHs', 'PULL OVER con CUERDA en Polea Alta', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 131, 0.8717, '{"text":1,"channel":1,"engagement":0.6086326950551145,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'Nm3M-4fmprk', 'Jeff Nippard Taught Me the Perfect T-Bar Row! #gym', 'UCxiub44lXA3uQg_OaA9yheg', 'Jesse James East', 30, 0.5783, '{"text":0.75,"channel":0,"engagement":0.7666969826737708,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-t-bar-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'I3Wi6GK0QMk', 'La técnica correcta del Remo gironda', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 38, 0.7304, '{"text":0.3333333333333333,"channel":1,"engagement":0.9017920160794399,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-t-bar-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'mYBqEj6A648', 'Cable Tricep Kickback the RIGHT way💪🏽🔥#triceps #tricepsworkout #armday #armworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 116, 0.6566, '{"text":1,"channel":0,"engagement":0.7830473842623754,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-kickback'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'xfS2-dkcC1k', 'Haz crecer tu TRÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 304, 0.7448, '{"text":0.3333333333333333,"channel":1,"engagement":0.973914682472356,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-kickback'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'p-kdPTKDgNs', '✅ Cómo hacer CRUNCH en POLEA correctamente (Abdominales)', 'UCmxJ8pGMAEgj1CKxQX4R4xw', 'Fit Generation', 27, 0.4888, '{"text":0.5,"channel":0,"engagement":0.793950262968031,"duration":0.8,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'uZg6VtRhwQY', 'Tríceps en Polea con Cuerdas / Tips Claves', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 77, 0.7056, '{"text":0.5,"channel":1,"engagement":0.5282445948398755,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'uZg6VtRhwQY', 'Tríceps en Polea con Cuerdas / Tips Claves', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 77, 0.6556, '{"text":0.3333333333333333,"channel":1,"engagement":0.5282445948398755,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8074, '{"text":0.6,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-straight-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'VpcU-jQ3BWs', 'Haces Triceps con Barra o con Cuerdas?  #gym #triceps  #tips', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 33, 0.7815, '{"text":0.5,"channel":1,"engagement":0.9075713681168934,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-straight-bar'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'V3h_1IUY-f0', 'Master The Controversial Upright Row | Targeting The Muscle', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 463, 0.7877, '{"text":0.6666666666666666,"channel":1,"engagement":0.8313151143589083,"duration":0.7138888888888889,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'WtBBR799JLk', 'Remo al mentón con CUERDA en POLEA BAJA', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 76, 0.8446, '{"text":1,"channel":1,"engagement":0.47287294097435284,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'V3h_1IUY-f0', 'Master The Controversial Upright Row | Targeting The Muscle', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 463, 0.7877, '{"text":0.6666666666666666,"channel":1,"engagement":0.8313151143589083,"duration":0.7138888888888889,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'fNyq2d1MslE', '🔥¿Cómo Tener Un Cuello Ancho Para Ser Más Atractivo Y Atlético? Guía Basada En Ciencia + Rutina 🧠', 'UCJQ_Yp6hlm65IAAeonc1QEA', 'Legionarios Élite', 80, 0.4668, '{"text":0.25,"channel":0,"engagement":0.9590610513941161,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-upright-row-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'pAplQXk3dkU', 'How To: Oblique Twist "Wood Chopper" (LF CAble)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 194, 0.8332, '{"text":0.6666666666666666,"channel":1,"engagement":0.6661981233180451,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-wood-chop'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'y8Qhx_ebcas', 'Pomo de hacha secreto, God Of War 4 (new game +)', 'UC84ifY6o47vD8ueKmuzOvIA', 'VigozPlay', 14, 0.346, '{"text":0.3333333333333333,"channel":0,"engagement":0.7300183594491657,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-wood-chop'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'nDh_BlnLCGc', 'How To Leg Press With Perfect Technique', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 59, 0.85, '{"text":0.6666666666666666,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'calf-press-on-leg-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'EptZC_AY6fE', 'Gemelo En Prensa con TIPS CLAVES - Extensiones de GEMELOS', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 106, 0.8477, '{"text":1,"channel":1,"engagement":0.48865563550975455,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'calf-press-on-leg-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'M2UuuyJ2tCg', 'Captain’s Chair Leg Raises : How to engage your core properly and avoiding lower back strain.', 'UCCvbos_dgQPr_hRF9xbuHtw', 'HurricaneGH', 60, 0.6276, '{"text":0.8,"channel":0,"engagement":0.9381186484679723,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'captains-chair-leg-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'mSejp5qK1pc', 'Ofit Live Tips - Abdominales: elevación de piernas y flexión de cadera', 'UCbF4xrC5aGWtLCcGKLD2wOQ', 'Ofit Live', 194, 0.4764, '{"text":0.5,"channel":0,"engagement":0.6321090398805866,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'captains-chair-leg-raise'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'xUm0BiZCWlQ', 'How To: Chest Press (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 158, 0.9314, '{"text":1,"channel":1,"engagement":0.6571266945722625,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'chest-press-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'TAH8RxOS0VI', 'Cómo hacer PRESS DE BANCA perfecto', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 190, 0.7862, '{"text":0.5,"channel":1,"engagement":0.9310297767796961,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'chest-press-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'UYJsFzqdgK4', 'HOW TO: Close-Grip Bench Press (TRICEPS BUILDER) || PERFECT FORM', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 177, 0.8197, '{"text":0.8,"channel":1,"engagement":0.6485522565099342,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-barbell-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'jlFl7WJ1TzI', 'Cómo hacer press de banca CORRECTAMENTE para incrementar tus músculos (5 pasos sencillos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.706, '{"text":0.4,"channel":1,"engagement":0.836717130625341,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-barbell-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'nEF0bv2FW94', 'How To: Close-Grip Barbell Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.928, '{"text":1,"channel":1,"engagement":0.6402316423874758,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'TAH8RxOS0VI', 'Cómo hacer PRESS DE BANCA perfecto', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 190, 0.7862, '{"text":0.5,"channel":1,"engagement":0.9310297767796961,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'Jvj2wV0vOYU', 'How To: Dumbbell Concentration Curl', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 101, 0.9303, '{"text":1,"channel":1,"engagement":0.6514234982311221,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'concentration-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'th4ad_vEonc', 'Curl de Bicep Concentrado con apoyo en el Muslo', 'UCfOw8Ddk0jOeCyUJEoIZd3w', 'Asesor Fitness', 141, 0.5968, '{"text":1,"channel":0,"engagement":0.4837981057353751,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'concentration-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'NGRKFMKhF8s', 'How To: Floor Crunch', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 123, 0.9257, '{"text":1,"channel":1,"engagement":0.6287459673533758,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'crunch-floor'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '8np3vKDBJfc', 'The PERFECT Deadlift (5 Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 57, 0.9452, '{"text":1,"channel":1,"engagement":0.9761346032811647,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'deadlift'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '7Sjfm61-HC4', 'Cómo hacer peso muerto CORRECTAMENTE para crecimiento (5 sencillos pasos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.8835, '{"text":1,"channel":1,"engagement":0.8242120782360775,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'deadlift'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'LfyQBUKR8SE', 'How To: Barbell Decline Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 124, 0.9295, '{"text":1,"channel":1,"engagement":0.647405537436514,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'L1U8yy4OqbQ', 'Press Banca Declinado con Barra - para Pecho', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 73, 0.8559, '{"text":1,"channel":1,"engagement":0.5294472171523258,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'QhGU5cmNZds', 'How To: Decline Sit-Up', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.9272, '{"text":1,"channel":1,"engagement":0.6359312758643154,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-sit-up'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'bUxTd61Jo3k', 'Banco romano cómo usarlo', 'UCRy-iIQDljzRDgvoq8UtSng', 'Galvistrainer', 60, 0.4156, '{"text":0.25,"channel":0,"engagement":0.7029747479899534,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'decline-sit-up'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.9713, '{"text":1,"channel":1,"engagement":0.8563157157603706,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'DcS44T6Y5GQ', '🔥FONDOS en PARALELAS🔥 || ATENTO a la TÉCNICA ⚠️', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 214, 0.9031, '{"text":1,"channel":1,"engagement":0.7657053741569168,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.9713, '{"text":1,"channel":1,"engagement":0.8563157157603706,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'DcS44T6Y5GQ', '🔥FONDOS en PARALELAS🔥 || ATENTO a la TÉCNICA ⚠️', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 214, 0.9031, '{"text":1,"channel":1,"engagement":0.7657053741569168,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'ris9tKqMwgU', 'Stop F*cking Up The Arnold Press (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 461, 0.7516, '{"text":0.6666666666666666,"channel":1,"engagement":0.6484708544512047,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'V8GcUp4COLg', 'No Arruines el Press Arnold ¡FORMA CORRECTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 461, 0.793, '{"text":0.6666666666666666,"channel":1,"engagement":0.855056901120456,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'ris9tKqMwgU', 'Stop F*cking Up The Arnold Press (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 461, 0.7516, '{"text":0.6666666666666666,"channel":1,"engagement":0.6484708544512047,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'fYxSUvIsxoA', 'Haz Esto SIEMPRE que Hagas Press Frontal con Barra ¡MAYOR FUERZA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 358, 0.8303, '{"text":0.6666666666666666,"channel":1,"engagement":0.9016410253880386,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '6TSP1TRMUzs', 'How To:  Dumbbell Bent-Over Row', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 162, 0.9309, '{"text":1,"channel":1,"engagement":0.6545061362406139,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bent-over-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'D6lpHgyDItk', 'Remo con 2 Mancuernas en Banco Inclinado', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.8685, '{"text":1,"channel":1,"engagement":0.592308566946298,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bent-over-row'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'ICAXJVmOJik', 'Fixed In 60 Seconds: DUMBBELL BICEPS CURL', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 56, 0.7994, '{"text":0.6666666666666666,"channel":1,"engagement":0.7469743093497178,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8322, '{"text":0.6666666666666666,"channel":1,"engagement":0.9112380409640392,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bicep-curl'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'M2rwvNhTOu0', 'The Perfect Overhead Dumbbell Press', 'UC3pNPPqn073XJXluDu0aJhw', '3v', 54, 0.6279, '{"text":1,"channel":0,"engagement":0.6393663741603186,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'CpvyRFjbgow', '¿Quieres unos hombros más grandes? 💪 Corrige tu press con estos 2 trucos sencillos! 🔧✨', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 25, 0.7644, '{"text":0.6666666666666666,"channel":1,"engagement":0.7387658230584325,"duration":0.6666666666666666,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'CAwf7n6Luuc', 'How To: Lat Pulldown | 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 342, 0.943, '{"text":1,"channel":1,"engagement":0.714901746486262,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'lat-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '72q0tKij5uU', 'Cómo Hacer Jalón Para Dorsales ¡EVITA ERRORES!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 355, 0.7333, '{"text":0.3333333333333333,"channel":1,"engagement":0.9167272621279318,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'lat-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

COMMIT;
