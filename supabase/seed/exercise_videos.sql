-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts
-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json
-- Regenerar con: pnpm videos:generate

BEGIN;

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.732, '{"text":0.3333333333333333,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
SELECT id, 'es', 'mN2gwXOUBlI', 'La manera CORRECTA de hacer ABDOMINALES #tips #gym #abs', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 36, 0.5257, '{"text":0.5,"channel":0,"engagement":0.878365503554802,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.732, '{"text":0.3333333333333333,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
SELECT id, 'es', 'GaFVuSQWYHo', 'Ab Cruncher Máquina de Ejercicios Bodytone Falabella TV Tutorial', 'UCMLH0vqjhCblKOjFVBG6IQw', 'Falabella Chile', 173, 0.4258, '{"text":0.3333333333333333,"channel":0,"engagement":0.6288941462172057,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'xxxfrS2eSyo', 'Cable flies on the Titan Fitness wall mounted pulley tower', 'UCFGCfbYPyFpITa0mbwbTmhA', 'Kaizen DIY Gym', 36, 0.4506, '{"text":0.3333333333333333,"channel":0,"engagement":0.7529325897890929,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', 't08uiyx05fE', 'Haz esto para Fondos para triceps y pectoral #gym #shorts #fitness', 'UChpSWsExGBCwKkf1ZcRr8vg', 'Maru lekhal', 21, 0.3654, '{"text":0.25,"channel":0,"engagement":0.752066849940702,"duration":0.4,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'lGCl8kVa6-c', 'Beginner Guide To The Assisted Pull Up Machine!', 'UC-r_4MdrOfMHrxXdfGJZqBw', 'Laci Renee ', 90, 0.6307, '{"text":1,"channel":0,"engagement":0.6535832599322361,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'bV6mkzegpBk', 'Come check out the Assisted Pull-Up machine with me! 💪🏼 #shorts', 'UCCc2i55hjR-hqmxrRYNdQiw', 'LisaFiitt Workouts', 61, 0.6538, '{"text":1,"channel":0,"engagement":0.7688355564122386,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'nEF0bv2FW94', 'How To: Close-Grip Barbell Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.928, '{"text":1,"channel":1,"engagement":0.6402315978022952,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
SELECT id, 'es', 'jlFl7WJ1TzI', 'Cómo hacer press de banca CORRECTAMENTE para incrementar tus músculos (5 pasos sencillos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.706, '{"text":0.4,"channel":1,"engagement":0.8367178907579883,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', 'YQgs03p3UxE', 'Perfect Dumbbell Deadlift Form for Beginners (5-Step Checklist)', 'UCwxklfO1LBHPdkcUkzY9duQ', 'Live Lean TV', 74, 0.6498, '{"text":1,"channel":0,"engagement":0.7490595358579286,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', '7BdVi5qJ7E4', 'Cómo hacer peso muerto en 5 pasos #shorts', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 57, 0.95, '{"text":1,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', 'QsYre__-aro', 'STOP Doing Dumbbell Press Like This (5 Mistakes Slowing Your Chest Gains)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 449, 0.7652, '{"text":0.6666666666666666,"channel":1,"engagement":0.6996641375897239,"duration":0.7527777777777778,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'es', '5wN-99Fny5Q', 'DEJA de hacer así el press con mancuernas (5 errores que retrasan el crecimiento de los pectorales)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 433, 0.781, '{"text":0.6666666666666666,"channel":1,"engagement":0.7561981304606323,"duration":0.7972222222222223,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', 'SALxEARiMkw', 'How to do Lat Pulldowns (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 355, 0.8067, '{"text":0.5,"channel":1,"engagement":0.7834893920869805,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
