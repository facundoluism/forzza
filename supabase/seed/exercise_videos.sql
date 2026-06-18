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
