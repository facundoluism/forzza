-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts
-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json
-- Regenerar con: pnpm videos:generate

BEGIN;

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_BvTPMHfRQA', 'Ab Crunch Machine For Lower Belly', 'UCsBqxKx18dJVjtKafjTVjhg', 'Tanner Weiler', 69, 0.4547, '{"text":0.375,"channel":0,"engagement":0.710990024413536,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', '6UKJhcZLNAA', 'Como hacer crunch en máquina.', 'UCrlxUQRRcXl49RJ5tVmyZQQ', 'Deportika Online', 29, 0.3626, '{"text":0.07692307692307693,"channel":0,"engagement":0.7309051407701609,"duration":0.9333333333333333,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', '_BvTPMHfRQA', 'Ab Crunch Machine For Lower Belly', 'UCsBqxKx18dJVjtKafjTVjhg', 'Tanner Weiler', 69, 0.4322, '{"text":0.3,"channel":0,"engagement":0.710990024413536,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', '2tPoT6mpuNQ', 'Ejercicios de ABDOMEN definido y CORE fuerte en polea. 🔥', 'UCdLhu6EbYPJ--WyxtV-BKgQ', 'EresFitness', 14, 0.2394, '{"text":0,"channel":0,"engagement":0.6972212144612079,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'HhXl6NAxUAo', 'The ONLY 2 Ab Exercises You Need (NO, SERIOUSLY!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 417, 0.3538, '{"text":0.006211180124223602,"channel":0,"engagement":0.8390766246537178,"duration":0.8416666666666667,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', 'HFf5WDmtHuE', '¡Para de Hacer Elevaciones Laterales con Mancuernas Así! (SALVA A UN AMIGO)', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 46, 0.4, '{"text":0,"channel":0,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', '4N7BS_v_UdU', 'Beginner Guide - The Assisted Pull Up', 'UCCA2ci3f83StNZhAgDA4o4Q', 'Henley Fitness', 57, 0.4584, '{"text":0.3333333333333333,"channel":0,"engagement":0.7917875633767163,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', '2nFDCBqAPiE', 'Dominadas asistidas (en maquina y con goma)', 'UC-DnvXQHUTeLhHyR_grrWPQ', 'Aguado training', 129, 0.4147, '{"text":0.375,"channel":0,"engagement":0.5110605711989479,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'bV6mkzegpBk', 'Come check out the Assisted Pull-Up machine with me! 💪🏼 #shorts', 'UCCc2i55hjR-hqmxrRYNdQiw', 'LisaFiitt Workouts', 61, 0.4338, '{"text":0.26666666666666666,"channel":0,"engagement":0.7689903690060582,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'nEF0bv2FW94', 'How To: Close-Grip Barbell Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.3932, '{"text":0.050505050505050504,"channel":0,"engagement":0.6402293618315954,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
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
SELECT id, 'es', '0SJy6gPw_Ik', 'La postura perfecta para Press de Banca #consejos #ejercicio #entrenamiento #gym', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 41, 0.4064, '{"text":0.0625,"channel":0,"engagement":0.9380750072174656,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'XxWcirHIwVo', 'How to PROPERLY Deadlift for Growth (5 Easy Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 483, 0.5706, '{"text":0.00303951367781155,"channel":1,"engagement":0.7692834177055111,"duration":0.6583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', 'Ysfd_ExNKbM', 'COMO REALIZAR EL PESO MUERTO CORRECTAMENTE | Tutorial, Tips, técnica', 'UCqWBkQ0b8gEqK6E9dR0QNSQ', 'Fitness by Vivi', 303, 0.3442, '{"text":0.016666666666666666,"channel":0,"engagement":0.6958669323097161,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'OLePvpxQEGk', 'Best Shoulder Press Tutorial Ever Made | Dumbbells', 'UCwaPTAgqVs0NgbjYgIRWSPA', 'Davis Diley', 58, 0.3581, '{"text":0.02702702702702703,"channel":0,"engagement":1,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'es', 'GELRUlUSxeI', 'Técnica Press de Hombros con Mancuernas', 'UClrnGCy-sDVl5kznr-lmf4Q', 'Dra. Isabel Junio', 116, 0.4366, '{"text":0.375,"channel":0,"engagement":0.6207242254587719,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'SALxEARiMkw', 'How to do Lat Pulldowns (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 355, 0.4097, '{"text":0.010067114093959731,"channel":0,"engagement":0.7835171320505839,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
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
SELECT id, 'es', '3e-76jcA91w', 'Cómo hacer Jalón de Pecho PERFECTO! Vídeo completo en la descripción #espalda #consejos #gym', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.4047, '{"text":0.037037037037037035,"channel":0,"engagement":0.9677422804649992,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
