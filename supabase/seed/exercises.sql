-- =============================================================================
-- FORZZA — Seed: exercise_library (234 ejercicios reales)
-- Generado automaticamente desde gym_exercise_database.xlsx (Master Database)
-- Idempotente: ON CONFLICT (slug) DO UPDATE
-- =============================================================================

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Banca Plano con Mancuernas', 'Dumbbell Flat Bench Press', 'Lie flat on bench, dumbbells at chest level with palms facing feet. Press upward until arms are extended, then lower with control.', 'Chest',
  ARRAY['Pectoralis Major (Sternal Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (sternal head)'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Push – Horizontal', 'Beginner', ARRAY['dumbbell','chest','pectorals','flat-bench','push','horizontal-push','compound','hypertrophy','strength','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-flat-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Banca Inclinado con Mancuernas', 'Dumbbell Incline Bench Press', 'Bench set to 30-45°. Press dumbbells upward from chest level. Targets upper chest. Avoid flaring elbows excessively.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Free Weight','Dumbbell + Incline Bench'],
  'Push – Incline', 'Beginner', ARRAY['dumbbell','chest','upper-chest','incline-bench','push','compound','hypertrophy','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-incline-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Banca Declinado con Mancuernas', 'Dumbbell Decline Bench Press', 'Bench set to -15 to -30°. Press dumbbells upward. Emphasizes lower pectoral fibers.', 'Chest',
  ARRAY['Pectoralis Major (Lower Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (lower head)'], ARRAY['Free Weight','Dumbbell + Decline Bench'],
  'Push – Decline', 'Intermediate', ARRAY['dumbbell','chest','lower-chest','decline-bench','push','compound','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-decline-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas Planas con Mancuernas', 'Dumbbell Flat Fly', 'Lie flat on bench, dumbbells above chest. With elbows slightly bent (locked), open arms outward until stretch is felt in chest, then bring back together.', 'Chest',
  ARRAY['Pectoralis Major (Sternal Head)'], ARRAY['Anterior Deltoid','Biceps'], ARRAY['chest','pectoralis major (sternal head)'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Fly – Horizontal', 'Beginner', ARRAY['dumbbell','chest','pectorals','flat-bench','fly','isolation','stretch','hypertrophy','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-flat-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas Inclinadas con Mancuernas', 'Dumbbell Incline Fly', 'Same as flat fly but on a 30-45° incline bench. Greater emphasis on upper pectoral fibers.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Free Weight','Dumbbell + Incline Bench'],
  'Fly – Incline', 'Beginner', ARRAY['dumbbell','chest','upper-chest','incline-bench','fly','isolation','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-incline-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas Declinadas con Mancuernas', 'Dumbbell Decline Fly', 'Decline bench fly targeting the lower chest. Maintain slight elbow bend throughout the arc.', 'Chest',
  ARRAY['Pectoralis Major (Lower Head)'], ARRAY['Anterior Deltoid'], ARRAY['chest','pectoralis major (lower head)'], ARRAY['Free Weight','Dumbbell + Decline Bench'],
  'Fly – Decline', 'Intermediate', ARRAY['dumbbell','chest','lower-chest','decline-bench','fly','isolation','free-weight'], 'Web Research (Original DB)', 'chest', 'dumbbell-decline-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pullover con Mancuerna', 'Dumbbell Pullover', 'Lie across a bench holding one dumbbell with both hands above chest. Lower behind head in an arc, then return. Works chest and lats.', 'Chest',
  ARRAY['Pectoralis Major','Latissimus Dorsi'], ARRAY['Serratus Anterior','Triceps'], ARRAY['chest','pectoralis major','latissimus dorsi'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Pull – Arc', 'Intermediate', ARRAY['dumbbell','chest','lats','back','isolation','stretch','compound','free-weight','pullover'], 'Web Research (Original DB)', 'chest', 'dumbbell-pullover'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Hombros con Mancuernas', 'Dumbbell Overhead Press', 'Seated or standing, press dumbbells from shoulder level overhead until arms are extended. Full shoulder press movement.', 'Shoulders',
  ARRAY['Deltoid (Anterior & Medial)'], ARRAY['Triceps','Upper Trapezius'], ARRAY['shoulders','deltoid (anterior & medial)'], ARRAY['Free Weight','Dumbbell'],
  'Push – Vertical', 'Beginner', ARRAY['dumbbell','shoulders','deltoid','overhead-press','push','vertical-push','compound','strength','hypertrophy','free-weight'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-overhead-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Arnold Press con Mancuernas', 'Dumbbell Arnold Press', 'Start with palms facing you at shoulder height, rotate to palms forward as you press overhead. Named after Arnold Schwarzenegger. Hits all three delt heads.', 'Shoulders',
  ARRAY['Deltoid (All Heads)'], ARRAY['Triceps','Upper Trapezius'], ARRAY['shoulders','deltoid (all heads)'], ARRAY['Free Weight','Dumbbell'],
  'Push – Rotational Vertical', 'Intermediate', ARRAY['dumbbell','shoulders','deltoid','overhead-press','compound','rotation','arnold','free-weight'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-arnold-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones Laterales con Mancuernas', 'Dumbbell Lateral Raise', 'Stand with dumbbells at sides. Raise arms laterally to shoulder height with a slight bend in elbows. Control on the way down.', 'Shoulders',
  ARRAY['Deltoid (Medial/Lateral Head)'], ARRAY['Supraspinatus','Upper Trapezius'], ARRAY['shoulders','deltoid (medial/lateral head)'], ARRAY['Free Weight','Dumbbell'],
  'Raise – Lateral', 'Beginner', ARRAY['dumbbell','shoulders','lateral-deltoid','medial-deltoid','isolation','raise','hypertrophy','free-weight'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-lateral-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones Frontales con Mancuernas', 'Dumbbell Front Raise', 'Hold dumbbells in front of thighs. Raise one or both arms forward to shoulder height. Targets front deltoid.', 'Shoulders',
  ARRAY['Deltoid (Anterior Head)'], ARRAY['Upper Pectoralis','Biceps'], ARRAY['shoulders','deltoid (anterior head)'], ARRAY['Free Weight','Dumbbell'],
  'Raise – Frontal', 'Beginner', ARRAY['dumbbell','shoulders','anterior-deltoid','front-delt','isolation','raise','free-weight'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-front-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pájaros / Aperturas para Deltoides Posterior', 'Dumbbell Rear Delt Fly', 'Hinge at hips to parallel, arms hanging. Raise dumbbells laterally with slight elbow bend, squeezing rear delts and rhomboids at top.', 'Shoulders',
  ARRAY['Deltoid (Posterior Head)'], ARRAY['Rhomboids','Middle Trapezius'], ARRAY['shoulders','deltoid (posterior head)'], ARRAY['Free Weight','Dumbbell'],
  'Fly – Reverse', 'Beginner', ARRAY['dumbbell','shoulders','rear-delt','posterior-deltoid','rhomboids','isolation','fly','free-weight','posture'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-rear-delt-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo al Mentón con Mancuernas', 'Dumbbell Upright Row', 'Hold dumbbells in front of thighs. Pull elbows high and wide, raising dumbbells to chin level. Trains traps and medial deltoids.', 'Shoulders',
  ARRAY['Deltoid (Medial)','Upper Trapezius'], ARRAY['Biceps','Brachialis'], ARRAY['shoulders','deltoid (medial)','upper trapezius'], ARRAY['Free Weight','Dumbbell'],
  'Pull – Vertical', 'Intermediate', ARRAY['dumbbell','shoulders','traps','trapezius','upright-row','compound','free-weight'], 'Web Research (Original DB)', 'shoulders', 'dumbbell-upright-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Encogimiento de Hombros con Mancuernas', 'Dumbbell Shrug', 'Hold dumbbells at sides. Elevate shoulders straight up toward ears, hold briefly, then lower. Isolates the trapezius.', 'Back',
  ARRAY['Upper Trapezius'], ARRAY['Levator Scapulae'], ARRAY['back','upper trapezius'], ARRAY['Free Weight','Dumbbell'],
  'Shrug', 'Beginner', ARRAY['dumbbell','traps','trapezius','isolation','shrug','free-weight','neck','upper-back'], 'Web Research (Original DB)', 'back', 'dumbbell-shrug'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo Inclinado con Mancuernas', 'Dumbbell Bent-Over Row', 'Hinge at hips ~45°, row both dumbbells toward hips, squeezing shoulder blades. Compound back builder.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids'], ARRAY['Biceps','Rear Delt','Erector Spinae'], ARRAY['back','latissimus dorsi','rhomboids'], ARRAY['Free Weight','Dumbbell'],
  'Pull – Horizontal', 'Beginner', ARRAY['dumbbell','back','lats','latissimus-dorsi','rhomboids','row','compound','pull','horizontal-pull','free-weight'], 'Web Research (Original DB)', 'back', 'dumbbell-bent-over-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo con Mancuerna a Una Mano', 'Dumbbell Single-Arm Row', 'Place one knee and hand on bench for support. Row dumbbell up to hip with the working arm. Allows heavier load and greater range of motion.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids'], ARRAY['Biceps','Rear Delt','Teres Major'], ARRAY['back','latissimus dorsi','rhomboids'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Pull – Unilateral Horizontal', 'Beginner', ARRAY['dumbbell','back','lats','latissimus-dorsi','unilateral','row','single-arm','compound','pull','free-weight'], 'Web Research (Original DB)', 'back', 'dumbbell-single-arm-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Peso Muerto Rumano con Mancuernas', 'Dumbbell Romanian Deadlift', 'Hold dumbbells in front of thighs. Hinge at hips, lowering weights along legs while keeping back flat. Feel hamstring stretch, then drive hips forward.', 'Legs',
  ARRAY['Hamstrings','Glutes'], ARRAY['Erector Spinae','Adductors'], ARRAY['legs','hamstrings','glutes'], ARRAY['Free Weight','Dumbbell'],
  'Hinge', 'Intermediate', ARRAY['dumbbell','legs','hamstrings','glutes','hinge','hip-hinge','compound','posterior-chain','free-weight','rdl'], 'Web Research (Original DB)', 'legs', 'dumbbell-romanian-deadlift'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Peso Muerto con Mancuernas', 'Dumbbell Deadlift', 'Dumbbells at sides or in front of legs. Push floor away, maintaining neutral spine from floor to standing. Full-body movement.', 'Back',
  ARRAY['Erector Spinae','Glutes','Hamstrings'], ARRAY['Lats','Traps','Quads','Core'], ARRAY['back','erector spinae','glutes','hamstrings'], ARRAY['Free Weight','Dumbbell'],
  'Hinge – Full', 'Intermediate', ARRAY['dumbbell','back','legs','glutes','hamstrings','compound','full-body','hinge','free-weight','deadlift','erector-spinae'], 'Web Research (Original DB)', 'back', 'dumbbell-deadlift'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo Renegado con Mancuernas', 'Dumbbell Renegade Row', 'High plank position with hands on dumbbells. Row one dumbbell to hip while balancing on the other. Demands high core stability.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids'], ARRAY['Core','Triceps','Anterior Deltoid'], ARRAY['back','latissimus dorsi','rhomboids'], ARRAY['Free Weight','Dumbbell'],
  'Pull – Anti-Rotation', 'Advanced', ARRAY['dumbbell','back','core','lats','row','anti-rotation','stability','compound','free-weight','functional'], 'Web Research (Original DB)', 'back', 'dumbbell-renegade-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pullover para Espalda con Mancuerna', 'Dumbbell Pullover (Back Focus)', 'Variation of the pullover emphasizing lat engagement by keeping arms straighter and focusing on the pulling motion.', 'Back',
  ARRAY['Latissimus Dorsi','Serratus Anterior'], ARRAY['Chest','Triceps Long Head'], ARRAY['back','latissimus dorsi','serratus anterior'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Pull – Arc', 'Intermediate', ARRAY['dumbbell','back','lats','latissimus-dorsi','serratus','isolation','arc','free-weight'], 'Web Research (Original DB)', 'back', 'dumbbell-pullover-back-focus'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de Bíceps con Mancuernas', 'Dumbbell Bicep Curl', 'Stand or sit holding dumbbells with supinated grip. Curl weights toward shoulders without swinging the body. Classic bicep builder.', 'Arms',
  ARRAY['Biceps Brachii'], ARRAY['Brachialis','Brachioradialis'], ARRAY['arms','biceps brachii'], ARRAY['Free Weight','Dumbbell'],
  'Curl', 'Beginner', ARRAY['dumbbell','arms','biceps','biceps-brachii','curl','isolation','hypertrophy','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-bicep-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl Martillo con Mancuernas', 'Dumbbell Hammer Curl', 'Neutral grip (palms facing each other). Curl dumbbells upward. Emphasizes brachialis and brachioradialis for arm thickness.', 'Arms',
  ARRAY['Brachialis','Brachioradialis'], ARRAY['Biceps Brachii'], ARRAY['arms','brachialis','brachioradialis'], ARRAY['Free Weight','Dumbbell'],
  'Curl – Neutral Grip', 'Beginner', ARRAY['dumbbell','arms','biceps','brachialis','hammer-curl','neutral-grip','isolation','forearm','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-hammer-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl Concentrado con Mancuerna', 'Dumbbell Concentration Curl', 'Sit, brace back of arm against inner thigh, curl dumbbell. Fully isolates the bicep peak, eliminating momentum.', 'Arms',
  ARRAY['Biceps Brachii (Short Head)'], ARRAY['Brachialis'], ARRAY['arms','biceps brachii (short head)'], ARRAY['Free Weight','Dumbbell'],
  'Curl – Isolation', 'Beginner', ARRAY['dumbbell','arms','biceps','isolation','concentration-curl','short-head','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-concentration-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl en Banco Inclinado con Mancuernas', 'Dumbbell Incline Curl', 'Seated on 45-60° incline bench, arms hanging. Curl upward from a stretched position, maximizing long head activation.', 'Arms',
  ARRAY['Biceps Brachii (Long Head)'], ARRAY['Brachialis'], ARRAY['arms','biceps brachii (long head)'], ARRAY['Free Weight','Dumbbell + Incline Bench'],
  'Curl – Stretch', 'Intermediate', ARRAY['dumbbell','arms','biceps','long-head','incline-curl','stretch','isolation','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-incline-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl Zottman con Mancuernas', 'Dumbbell Zottman Curl', 'Curl up with supinated grip, rotate to pronated at top, lower with pronated grip. Trains both biceps and brachioradialis effectively.', 'Arms',
  ARRAY['Biceps Brachii','Brachioradialis'], ARRAY['Brachialis','Forearm Flexors'], ARRAY['arms','biceps brachii','brachioradialis'], ARRAY['Free Weight','Dumbbell'],
  'Curl – Rotational', 'Intermediate', ARRAY['dumbbell','arms','biceps','forearm','brachioradialis','zottman','rotation','isolation','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-zottman-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl Predicador con Mancuerna', 'Dumbbell Preacher Curl', 'Use a preacher bench or incline bench as arm pad. Curl from fully extended to contracted. Limits cheating and isolates bicep.', 'Arms',
  ARRAY['Biceps Brachii (Short Head)'], ARRAY['Brachialis'], ARRAY['arms','biceps brachii (short head)'], ARRAY['Free Weight','Dumbbell + Preacher Bench'],
  'Curl – Braced', 'Beginner', ARRAY['dumbbell','arms','biceps','short-head','preacher-curl','isolation','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-preacher-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Rompecráneos con Mancuernas', 'Dumbbell Skull Crusher', 'Lie on bench, dumbbells above chest. Lower weights toward temples by bending only at elbows. Press back up. Hits all three tricep heads.', 'Arms',
  ARRAY['Triceps Brachii (All Heads)'], ARRAY['Anconeus'], ARRAY['arms','triceps brachii (all heads)'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Extension – Supine', 'Intermediate', ARRAY['dumbbell','arms','triceps','skull-crusher','isolation','hypertrophy','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-skull-crusher'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de Tríceps sobre Cabeza con Mancuerna', 'Dumbbell Overhead Tricep Extension', 'Hold one dumbbell with both hands overhead. Lower behind head by bending elbows, then extend upward. Maximizes long head stretch.', 'Arms',
  ARRAY['Triceps Brachii (Long Head)'], ARRAY['Triceps Lateral & Medial Head'], ARRAY['arms','triceps brachii (long head)'], ARRAY['Free Weight','Dumbbell'],
  'Extension – Overhead', 'Beginner', ARRAY['dumbbell','arms','triceps','long-head','overhead-extension','isolation','stretch','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-overhead-tricep-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Patada de Tríceps con Mancuerna', 'Dumbbell Tricep Kickback', 'Hinge at hips, upper arm parallel to floor. Extend forearm back until arm is straight. Peak contraction focus.', 'Arms',
  ARRAY['Triceps Brachii (Lateral Head)'], ARRAY['Triceps Medial Head'], ARRAY['arms','triceps brachii (lateral head)'], ARRAY['Free Weight','Dumbbell'],
  'Extension – Kickback', 'Beginner', ARRAY['dumbbell','arms','triceps','lateral-head','kickback','isolation','contraction','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-tricep-kickback'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press con Agarre Cerrado con Mancuernas', 'Dumbbell Close-Grip Press', 'Flat bench press with dumbbells held together (or close), elbows tight to body. Emphasizes triceps over chest.', 'Arms',
  ARRAY['Triceps Brachii'], ARRAY['Pectoralis Major','Anterior Deltoid'], ARRAY['arms','triceps brachii'], ARRAY['Free Weight','Dumbbell + Flat Bench'],
  'Push – Close Grip', 'Intermediate', ARRAY['dumbbell','arms','triceps','chest','compound','push','close-grip','free-weight'], 'Web Research (Original DB)', 'arms', 'dumbbell-close-grip-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla Goblet con Mancuerna', 'Dumbbell Goblet Squat', 'Hold single dumbbell vertically at chest. Squat to depth with upright torso. Beginner-friendly squat pattern with great quad and glute activation.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Core','Adductors'], ARRAY['legs','quadriceps','glutes'], ARRAY['Free Weight','Dumbbell'],
  'Squat', 'Beginner', ARRAY['dumbbell','legs','quads','quadriceps','glutes','goblet-squat','squat','compound','free-weight','beginner-friendly'], 'Web Research (Original DB)', 'legs', 'dumbbell-goblet-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla con Mancuernas', 'Dumbbell Squat', 'Hold dumbbells at sides or at shoulders. Perform a standard squat. Engages quads, glutes, hamstrings and core.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Adductors','Core'], ARRAY['legs','quadriceps','glutes'], ARRAY['Free Weight','Dumbbell'],
  'Squat', 'Beginner', ARRAY['dumbbell','legs','quads','glutes','hamstrings','squat','compound','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Estocada con Mancuernas', 'Dumbbell Lunge', 'Hold dumbbells at sides, step forward into lunge until both knees at 90°. Return to start. Unilateral lower body movement.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Hip Flexors','Calves'], ARRAY['legs','quadriceps','glutes'], ARRAY['Free Weight','Dumbbell'],
  'Lunge – Unilateral', 'Beginner', ARRAY['dumbbell','legs','quads','glutes','lunge','unilateral','compound','free-weight','balance'], 'Web Research (Original DB)', 'legs', 'dumbbell-lunge'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Estocada Caminando con Mancuernas', 'Dumbbell Walking Lunge', 'Perform alternating forward lunges while moving across the gym floor. Challenges balance and cardiovascular system more than stationary lunges.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Core','Calves'], ARRAY['legs','quadriceps','glutes'], ARRAY['Free Weight','Dumbbell'],
  'Lunge – Walking', 'Intermediate', ARRAY['dumbbell','legs','quads','glutes','walking-lunge','unilateral','compound','balance','cardio','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-walking-lunge'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla Búlgara con Mancuernas', 'Dumbbell Bulgarian Split Squat', 'Rear foot elevated on bench. Lower front leg into deep lunge position. Highly effective single-leg quad and glute builder.', 'Legs',
  ARRAY['Quadriceps','Glutes (Single Leg)'], ARRAY['Hamstrings','Hip Flexors','Calves'], ARRAY['legs','quadriceps','glutes (single leg)'], ARRAY['Free Weight','Dumbbell + Bench'],
  'Split Squat – Elevated Rear Foot', 'Intermediate', ARRAY['dumbbell','legs','quads','glutes','bulgarian-split-squat','unilateral','compound','single-leg','free-weight','hypertrophy'], 'Web Research (Original DB)', 'legs', 'dumbbell-bulgarian-split-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Step-Up con Mancuernas', 'Dumbbell Step-Up', 'Hold dumbbells, step onto bench or box with one leg and drive up. Control descent. Unilateral quad and glute activation.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Calves','Core'], ARRAY['legs','quadriceps','glutes'], ARRAY['Free Weight','Dumbbell + Box/Bench'],
  'Step-Up – Unilateral', 'Beginner', ARRAY['dumbbell','legs','quads','glutes','step-up','unilateral','compound','functional','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-step-up'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla Sumo con Mancuerna', 'Dumbbell Sumo Squat', 'Wide stance, toes pointed out. Hold single dumbbell between legs and squat deep. Emphasizes inner thighs and glutes.', 'Legs',
  ARRAY['Adductors','Glutes','Quadriceps'], ARRAY['Hamstrings','Calves'], ARRAY['legs','adductors','glutes','quadriceps'], ARRAY['Free Weight','Dumbbell'],
  'Squat – Wide', 'Beginner', ARRAY['dumbbell','legs','adductors','inner-thigh','glutes','quads','sumo-squat','compound','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-sumo-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación de Talones con Mancuernas', 'Dumbbell Standing Calf Raise', 'Hold dumbbells at sides, stand on edge of step. Rise on toes, hold, lower past neutral for full stretch.', 'Legs',
  ARRAY['Gastrocnemius','Soleus'], ARRAY['Tibialis Anterior'], ARRAY['legs','gastrocnemius','soleus'], ARRAY['Free Weight','Dumbbell'],
  'Calf Raise', 'Beginner', ARRAY['dumbbell','legs','calves','gastrocnemius','soleus','calf-raise','isolation','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-standing-calf-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación de Cadera con Mancuerna', 'Dumbbell Hip Thrust', 'Shoulders on bench, dumbbell on hips. Drive hips upward to full extension, squeezing glutes at top. Powerful glute activator.', 'Legs',
  ARRAY['Glutes (Gluteus Maximus)'], ARRAY['Hamstrings','Core'], ARRAY['legs','glutes (gluteus maximus)'], ARRAY['Free Weight','Dumbbell + Bench'],
  'Hip Thrust', 'Beginner', ARRAY['dumbbell','legs','glutes','glute-max','hip-thrust','isolation','posterior-chain','free-weight'], 'Web Research (Original DB)', 'legs', 'dumbbell-hip-thrust'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Estocada Inversa con Mancuernas', 'Dumbbell Reverse Lunge', 'Step backward into lunge. Reduces knee strain vs. forward lunge. Greater glute activation.', 'Legs',
  ARRAY['Glutes','Quadriceps'], ARRAY['Hamstrings','Hip Flexors'], ARRAY['legs','glutes','quadriceps'], ARRAY['Free Weight','Dumbbell'],
  'Lunge – Reverse', 'Beginner', ARRAY['dumbbell','legs','quads','glutes','reverse-lunge','unilateral','compound','free-weight','knee-friendly'], 'Web Research (Original DB)', 'legs', 'dumbbell-reverse-lunge'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Giro Ruso con Mancuerna', 'Dumbbell Russian Twist', 'Sit with knees bent, lean back ~45°. Hold dumbbell with both hands and rotate torso side to side.', 'Core',
  ARRAY['Obliques','Rectus Abdominis'], ARRAY['Hip Flexors'], ARRAY['core','obliques','rectus abdominis'], ARRAY['Free Weight','Dumbbell'],
  'Rotation', 'Beginner', ARRAY['dumbbell','core','abs','obliques','rotation','isolation','free-weight'], 'Web Research (Original DB)', 'core', 'dumbbell-russian-twist'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Flexión Lateral con Mancuerna', 'Dumbbell Side Bend', 'Stand holding dumbbell in one hand. Bend sideways at waist toward the weight, then return with oblique contraction.', 'Core',
  ARRAY['Obliques (External & Internal)'], ARRAY['Quadratus Lumborum'], ARRAY['core','obliques (external & internal)'], ARRAY['Free Weight','Dumbbell'],
  'Lateral Flexion', 'Beginner', ARRAY['dumbbell','core','obliques','lateral-flexion','isolation','free-weight'], 'Web Research (Original DB)', 'core', 'dumbbell-side-bend'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Golpe de Hacha con Mancuerna', 'Dumbbell Wood Chop', 'Hold dumbbell with both hands. Perform diagonal chopping motion from high to low (or low to high). Anti-rotation core power.', 'Core',
  ARRAY['Obliques','Rectus Abdominis'], ARRAY['Shoulders','Hips','Glutes'], ARRAY['core','obliques','rectus abdominis'], ARRAY['Free Weight','Dumbbell'],
  'Diagonal Chop', 'Intermediate', ARRAY['dumbbell','core','obliques','functional','rotation','power','wood-chop','free-weight'], 'Web Research (Original DB)', 'core', 'dumbbell-wood-chop'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Cable Crossover Alto a Bajo', 'Cable Crossover (High to Low)', 'Set pulleys high. Pull handles downward and inward in a crossing arc. Constant tension on chest through full range of motion.', 'Chest',
  ARRAY['Pectoralis Major (Lower & Sternal)'], ARRAY['Anterior Deltoid','Biceps'], ARRAY['chest','pectoralis major (lower & sternal)'], ARRAY['Cable','Cable Crossover / Functional Trainer'],
  'Fly – High Pulley', 'Intermediate', ARRAY['cable','chest','pectorals','crossover','fly','isolation','constant-tension','hypertrophy','cable-machine','functional-trainer'], 'Web Research (Original DB)', 'chest', 'cable-crossover-high-to-low'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Apertura de Pecho con Polea Baja', 'Cable Chest Fly (Low Pulley)', 'Set pulleys low. Pull handles up and inward in arc. Targets upper chest with constant tension unlike dumbbell flys.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Cable','Cable Crossover / Functional Trainer'],
  'Fly – Low Pulley', 'Intermediate', ARRAY['cable','chest','upper-chest','fly','isolation','constant-tension','cable-machine','low-pulley'], 'Web Research (Original DB)', 'chest', 'cable-chest-fly-low-pulley'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Pecho con Poleas', 'Cable Chest Press', 'Stand between cable stations or face away. Press handles forward at chest height. Greater range of motion than barbell bench press.', 'Chest',
  ARRAY['Pectoralis Major'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major'], ARRAY['Cable','Cable Crossover / Functional Trainer'],
  'Push – Standing', 'Intermediate', ARRAY['cable','chest','pectorals','press','compound','push','standing','cable-machine','functional-trainer'], 'Web Research (Original DB)', 'chest', 'cable-chest-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press Inclinado con Polea', 'Cable Incline Press', 'Set cable low, lean forward or use incline bench. Press upward at an incline angle hitting upper pecs with constant tension.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Cable','Cable Machine'],
  'Push – Incline', 'Intermediate', ARRAY['cable','chest','upper-chest','incline','compound','push','cable-machine'], 'Web Research (Original DB)', 'chest', 'cable-incline-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón al Pecho Agarre Amplio', 'Lat Pulldown (Wide Grip)', 'Grip bar wide, pull down to upper chest while leaning back slightly and squeezing lats. Most popular lat exercise.', 'Back',
  ARRAY['Latissimus Dorsi'], ARRAY['Biceps','Rear Delt','Teres Major'], ARRAY['back','latissimus dorsi'], ARRAY['Cable','Lat Pulldown Machine'],
  'Pull – Vertical (Wide)', 'Beginner', ARRAY['cable','back','lats','latissimus-dorsi','lat-pulldown','wide-grip','pull','vertical-pull','compound','cable-machine','lat-pulldown-machine'], 'Web Research (Original DB)', 'back', 'lat-pulldown-wide-grip'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón con Agarre Neutro/Estrecho', 'Lat Pulldown (Narrow/Neutral Grip)', 'Use V-bar or neutral handles. Elbows travel close to body, allowing greater range of motion and bicep contribution.', 'Back',
  ARRAY['Latissimus Dorsi','Teres Major'], ARRAY['Biceps','Rear Delt'], ARRAY['back','latissimus dorsi','teres major'], ARRAY['Cable','Lat Pulldown Machine'],
  'Pull – Vertical (Narrow)', 'Beginner', ARRAY['cable','back','lats','latissimus-dorsi','lat-pulldown','narrow-grip','neutral-grip','pull','compound','cable-machine'], 'Web Research (Original DB)', 'back', 'lat-pulldown-narrowneutral-grip'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón Supino (Agarre Invertido)', 'Lat Pulldown (Reverse/Underhand Grip)', 'Use underhand (supinated) grip. Greater bicep recruitment and slightly different lat activation compared to overhand grip.', 'Back',
  ARRAY['Latissimus Dorsi','Biceps Brachii'], ARRAY['Rear Delt','Teres Major'], ARRAY['back','latissimus dorsi','biceps brachii'], ARRAY['Cable','Lat Pulldown Machine'],
  'Pull – Vertical (Reverse)', 'Beginner', ARRAY['cable','back','lats','biceps','lat-pulldown','reverse-grip','supinated','pull','compound','cable-machine'], 'Web Research (Original DB)', 'back', 'lat-pulldown-reverseunderhand-grip'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo Sentado en Polea', 'Seated Cable Row', 'Sit at low cable with feet on pegs. Row handle to abdomen, squeezing shoulder blades. Compound back thickness builder.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids','Middle Trapezius'], ARRAY['Biceps','Rear Delt','Erector Spinae'], ARRAY['back','latissimus dorsi','rhomboids','middle trapezius'], ARRAY['Cable','Seated Cable Row Machine'],
  'Pull – Horizontal', 'Beginner', ARRAY['cable','back','lats','rhomboids','row','horizontal-pull','compound','seated-cable-row','cable-machine'], 'Web Research (Original DB)', 'back', 'seated-cable-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón en Polea con Brazos Rectos', 'Cable Straight-Arm Pulldown', 'Stand facing high pulley, arms straight. Pull bar down to hips in an arc keeping elbows locked. Isolates lats without bicep involvement.', 'Back',
  ARRAY['Latissimus Dorsi'], ARRAY['Teres Major','Triceps Long Head'], ARRAY['back','latissimus dorsi'], ARRAY['Cable','Cable Machine (High Pulley)'],
  'Pull – Straight Arm', 'Intermediate', ARRAY['cable','back','lats','straight-arm','pulldown','isolation','lat-isolation','cable-machine','high-pulley'], 'Web Research (Original DB)', 'back', 'cable-straight-arm-pulldown'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Face Pull con Polea', 'Cable Face Pull', 'Rope attachment at eye level. Pull rope toward face, pulling apart at end. Essential for rear delts, rotator cuff and posture.', 'Shoulders',
  ARRAY['Posterior Deltoid','Rotator Cuff'], ARRAY['Middle Trapezius','Rhomboids'], ARRAY['shoulders','posterior deltoid','rotator cuff'], ARRAY['Cable','Cable Machine (Mid Pulley)'],
  'Pull – Face', 'Beginner', ARRAY['cable','shoulders','rear-delt','rotator-cuff','posture','rhomboids','traps','face-pull','cable-machine','injury-prevention','rehabilitation'], 'Web Research (Original DB)', 'shoulders', 'cable-face-pull'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Encogimiento con Polea', 'Cable Shrug', 'Stand with low cable handles at sides. Elevate shoulders straight up. Cable provides constant tension unlike dumbbells.', 'Back',
  ARRAY['Upper Trapezius'], ARRAY['Levator Scapulae'], ARRAY['back','upper trapezius'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Shrug', 'Intermediate', ARRAY['cable','traps','trapezius','shrug','isolation','constant-tension','cable-machine'], 'Web Research (Original DB)', 'back', 'cable-shrug'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo en T con Polea', 'Cable T-Bar Row', 'Low cable with rope or handle. Hinge forward, row to abdomen. Similar to T-bar row but using cable for constant tension.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids','Teres Major'], ARRAY['Biceps','Erector Spinae'], ARRAY['back','latissimus dorsi','rhomboids','teres major'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Pull – Inclined Horizontal', 'Intermediate', ARRAY['cable','back','lats','row','compound','pull','cable-machine'], 'Web Research (Original DB)', 'back', 'cable-t-bar-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación Lateral con Polea', 'Cable Lateral Raise', 'Low pulley with D-handle. Raise arm laterally to shoulder height. Provides constant tension vs. zero at bottom with dumbbells.', 'Shoulders',
  ARRAY['Deltoid (Medial Head)'], ARRAY['Supraspinatus'], ARRAY['shoulders','deltoid (medial head)'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Raise – Lateral', 'Beginner', ARRAY['cable','shoulders','lateral-deltoid','medial-deltoid','raise','isolation','constant-tension','cable-machine','hypertrophy'], 'Web Research (Original DB)', 'shoulders', 'cable-lateral-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación Frontal con Polea', 'Cable Front Raise', 'Low cable, single or double handle. Raise forward to shoulder height. More constant tension than dumbbell version.', 'Shoulders',
  ARRAY['Deltoid (Anterior Head)'], ARRAY['Upper Pectoralis'], ARRAY['shoulders','deltoid (anterior head)'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Raise – Frontal', 'Beginner', ARRAY['cable','shoulders','anterior-deltoid','front-delt','raise','isolation','cable-machine'], 'Web Research (Original DB)', 'shoulders', 'cable-front-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Apertura para Deltoides Posterior en Polea', 'Cable Rear Delt Fly', 'Set cables at shoulder height or cross cables. Pull handles away, opening arms horizontally. Targets rear delts.', 'Shoulders',
  ARRAY['Deltoid (Posterior Head)'], ARRAY['Rhomboids','Middle Trapezius'], ARRAY['shoulders','deltoid (posterior head)'], ARRAY['Cable','Cable Crossover / Functional Trainer'],
  'Fly – Reverse', 'Intermediate', ARRAY['cable','shoulders','rear-delt','posterior-deltoid','rhomboids','fly','isolation','posture','cable-machine'], 'Web Research (Original DB)', 'shoulders', 'cable-rear-delt-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo al Mentón con Polea', 'Cable Upright Row', 'Low cable with rope or bar. Row up to chin height keeping elbows high. Targets traps and medial delts with constant cable tension.', 'Shoulders',
  ARRAY['Deltoid (Medial)','Upper Trapezius'], ARRAY['Biceps','Brachialis'], ARRAY['shoulders','deltoid (medial)','upper trapezius'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Pull – Vertical', 'Intermediate', ARRAY['cable','shoulders','traps','trapezius','upright-row','compound','cable-machine'], 'Web Research (Original DB)', 'shoulders', 'cable-upright-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de Bíceps con Polea (Barra Recta)', 'Cable Bicep Curl (Straight Bar)', 'Low pulley, straight bar. Curl bar to chest. Constant tension through full range of motion, no dead zone like with dumbbells.', 'Arms',
  ARRAY['Biceps Brachii'], ARRAY['Brachialis','Brachioradialis'], ARRAY['arms','biceps brachii'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Curl', 'Beginner', ARRAY['cable','arms','biceps','curl','isolation','constant-tension','cable-machine','straight-bar'], 'Web Research (Original DB)', 'arms', 'cable-bicep-curl-straight-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de Bíceps con Polea (Barra EZ)', 'Cable Bicep Curl (EZ Bar)', 'Low pulley, EZ bar attachment. Ergonomic grip reduces wrist strain. Targets biceps with brachialis involvement.', 'Arms',
  ARRAY['Biceps Brachii','Brachialis'], ARRAY['Brachioradialis'], ARRAY['arms','biceps brachii','brachialis'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Curl – EZ Bar', 'Beginner', ARRAY['cable','arms','biceps','curl','ez-bar','isolation','constant-tension','cable-machine','wrist-friendly'], 'Web Research (Original DB)', 'arms', 'cable-bicep-curl-ez-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl Martillo con Polea', 'Cable Hammer Curl', 'Rope or neutral handle at low pulley. Curl with neutral grip. Targets brachialis and brachioradialis.', 'Arms',
  ARRAY['Brachialis','Brachioradialis'], ARRAY['Biceps Brachii'], ARRAY['arms','brachialis','brachioradialis'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Curl – Neutral Grip', 'Beginner', ARRAY['cable','arms','biceps','brachialis','hammer-curl','neutral-grip','isolation','cable-machine'], 'Web Research (Original DB)', 'arms', 'cable-hammer-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de Bíceps Sobre la Cabeza en Polea', 'Cable Overhead Bicep Curl', 'Both cables at high position. Curl from stretched position with arms horizontal (like a double bicep pose). Maximizes stretch.', 'Arms',
  ARRAY['Biceps Brachii (Long Head)'], ARRAY['Brachialis'], ARRAY['arms','biceps brachii (long head)'], ARRAY['Cable','Cable Crossover'],
  'Curl – Overhead Stretch', 'Intermediate', ARRAY['cable','arms','biceps','long-head','overhead-curl','stretch','isolation','cable-crossover','cable-machine'], 'Web Research (Original DB)', 'arms', 'cable-overhead-bicep-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de Tríceps con Cuerda en Polea', 'Cable Tricep Pushdown (Rope)', 'High pulley, rope attachment. Push down and outward, fully extending and separating rope at bottom. Hits all three heads.', 'Arms',
  ARRAY['Triceps Brachii (All Heads)'], ARRAY['Anconeus'], ARRAY['arms','triceps brachii (all heads)'], ARRAY['Cable','Cable Machine (High Pulley)'],
  'Extension – Pushdown', 'Beginner', ARRAY['cable','arms','triceps','pushdown','rope','isolation','constant-tension','cable-machine','hypertrophy'], 'Web Research (Original DB)', 'arms', 'cable-tricep-pushdown-rope'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de Tríceps con Barra en Polea', 'Cable Tricep Pushdown (Straight Bar)', 'High pulley, straight bar. Push down to hip level keeping elbows pinned to sides. Classic mass builder for triceps.', 'Arms',
  ARRAY['Triceps Brachii (Medial & Lateral)'], ARRAY['Anconeus'], ARRAY['arms','triceps brachii (medial & lateral)'], ARRAY['Cable','Cable Machine (High Pulley)'],
  'Extension – Pushdown', 'Beginner', ARRAY['cable','arms','triceps','pushdown','straight-bar','isolation','cable-machine'], 'Web Research (Original DB)', 'arms', 'cable-tricep-pushdown-straight-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de Tríceps sobre Cabeza en Polea', 'Cable Overhead Tricep Extension', 'Face away from low cable. Hold rope overhead with elbows bent, extend upward. Maximizes long head stretch and growth.', 'Arms',
  ARRAY['Triceps Brachii (Long Head)'], ARRAY['Triceps Medial & Lateral'], ARRAY['arms','triceps brachii (long head)'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Extension – Overhead', 'Intermediate', ARRAY['cable','arms','triceps','long-head','overhead-extension','stretch','isolation','cable-machine','hypertrophy'], 'Web Research (Original DB)', 'arms', 'cable-overhead-tricep-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Patada de Tríceps en Polea', 'Cable Tricep Kickback', 'Hinge forward, cable at low position. Extend forearm rearward keeping upper arm stationary. Contraction-focused tricep movement.', 'Arms',
  ARRAY['Triceps Brachii (Lateral Head)'], ARRAY['Triceps Medial Head'], ARRAY['arms','triceps brachii (lateral head)'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Extension – Kickback', 'Beginner', ARRAY['cable','arms','triceps','kickback','isolation','contraction','cable-machine'], 'Web Research (Original DB)', 'arms', 'cable-tricep-kickback'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Crunch en Polea', 'Cable Crunch', 'Kneel facing high pulley with rope. Crunch torso downward contracting abs. Allows progressive overload on abs.', 'Core',
  ARRAY['Rectus Abdominis'], ARRAY['Obliques'], ARRAY['core','rectus abdominis'], ARRAY['Cable','Cable Machine (High Pulley)'],
  'Flexion – Kneeling', 'Beginner', ARRAY['cable','core','abs','rectus-abdominis','crunch','isolation','cable-machine','weighted-abs'], 'Web Research (Original DB)', 'core', 'cable-crunch'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Golpe de Hacha con Polea', 'Cable Wood Chop', 'Rotate and chop from high to low (or low to high). Diagonal core rotation pattern. Excellent for functional and athletic training.', 'Core',
  ARRAY['Obliques','Transverse Abdominis'], ARRAY['Shoulders','Hips','Glutes'], ARRAY['core','obliques','transverse abdominis'], ARRAY['Cable','Cable Machine'],
  'Rotation – Diagonal', 'Intermediate', ARRAY['cable','core','obliques','rotation','functional','athletic','wood-chop','cable-machine','anti-rotation'], 'Web Research (Original DB)', 'core', 'cable-wood-chop'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press Pallof con Polea', 'Cable Pallof Press', 'Stand sideways to cable. Press handle straight out and hold. Anti-rotation core stability exercise. Used widely in rehab.', 'Core',
  ARRAY['Transverse Abdominis','Obliques'], ARRAY['Core Stabilizers'], ARRAY['core','transverse abdominis','obliques'], ARRAY['Cable','Cable Machine (Mid Pulley)'],
  'Anti-Rotation – Press', 'Intermediate', ARRAY['cable','core','obliques','anti-rotation','stability','pallof-press','rehab','functional','cable-machine'], 'Web Research (Original DB)', 'core', 'cable-pallof-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de Glúteo en Polea', 'Cable Glute Kickback', 'Attach ankle strap. Extend leg rearward, squeezing glute at full extension. Excellent glute isolation movement.', 'Legs',
  ARRAY['Gluteus Maximus'], ARRAY['Hamstrings'], ARRAY['legs','gluteus maximus'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Extension – Hip', 'Beginner', ARRAY['cable','legs','glutes','glute-max','kickback','isolation','ankle-strap','cable-machine'], 'Web Research (Original DB)', 'legs', 'cable-glute-kickback'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Abducción de Cadera en Polea', 'Cable Hip Abduction', 'Ankle strap on low pulley. Swing leg outward. Targets glute medius and hip abductors for hip stability.', 'Legs',
  ARRAY['Gluteus Medius','Hip Abductors'], ARRAY['Tensor Fascia Latae'], ARRAY['legs','gluteus medius','hip abductors'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Abduction', 'Beginner', ARRAY['cable','legs','glute-medius','abductors','hip-abduction','isolation','stability','ankle-strap','cable-machine'], 'Web Research (Original DB)', 'legs', 'cable-hip-abduction'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aducción de Cadera en Polea', 'Cable Hip Adduction', 'Ankle strap on low pulley. Swing leg inward across body. Targets inner thigh adductors.', 'Legs',
  ARRAY['Hip Adductors (Inner Thigh)'], ARRAY['Gracilis'], ARRAY['legs','hip adductors (inner thigh)'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Adduction', 'Beginner', ARRAY['cable','legs','adductors','inner-thigh','hip-adduction','isolation','ankle-strap','cable-machine'], 'Web Research (Original DB)', 'legs', 'cable-hip-adduction'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón entre Piernas con Polea', 'Cable Pull-Through', 'Face away from low cable, rope between legs. Hip hinge, then drive hips forward. Builds posterior chain like a kettlebell swing.', 'Legs',
  ARRAY['Gluteus Maximus','Hamstrings'], ARRAY['Erector Spinae','Core'], ARRAY['legs','gluteus maximus','hamstrings'], ARRAY['Cable','Cable Machine (Low Pulley)'],
  'Hinge', 'Intermediate', ARRAY['cable','legs','glutes','hamstrings','hinge','posterior-chain','pull-through','functional','cable-machine'], 'Web Research (Original DB)', 'legs', 'cable-pull-through'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Press de Pecho', 'Chest Press Machine', 'Sit and push handles forward until arms are extended. Mimics bench press movement with guided path and no balance requirement.', 'Chest',
  ARRAY['Pectoralis Major'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major'], ARRAY['Machine (Selectorized)','Chest Press Machine'],
  'Push – Horizontal (Guided)', 'Beginner', ARRAY['machine','chest','pectorals','press','compound','push','selectorized','beginner-friendly','guided-motion'], 'Web Research (Original DB)', 'chest', 'chest-press-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Pecho (Pec Deck / Mariposa)', 'Pec Deck / Butterfly Machine', 'Sit with arms on pads. Bring pads together in front of chest. Fly motion with guided arc. Isolates pectorals safely.', 'Chest',
  ARRAY['Pectoralis Major'], ARRAY['Anterior Deltoid'], ARRAY['chest','pectoralis major'], ARRAY['Machine (Selectorized)','Pec Deck / Butterfly Machine'],
  'Fly – Guided', 'Beginner', ARRAY['machine','chest','pectorals','pec-deck','butterfly','fly','isolation','selectorized','guided-motion'], 'Web Research (Original DB)', 'chest', 'pec-deck-butterfly-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Press Inclinado', 'Incline Chest Press Machine', 'Angled press machine targeting upper pectorals. Safer and more controlled than free-weight incline press.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Machine (Selectorized)','Incline Chest Press Machine'],
  'Push – Incline (Guided)', 'Beginner', ARRAY['machine','chest','upper-chest','incline','compound','push','selectorized','guided-motion'], 'Web Research (Original DB)', 'chest', 'incline-chest-press-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Jalón para Espalda', 'Lat Pulldown Machine', 'Selectorized lat pulldown. Same movement as cable lat pulldown but with integrated weight stack and fixed pulleys.', 'Back',
  ARRAY['Latissimus Dorsi'], ARRAY['Biceps','Teres Major','Rear Delt'], ARRAY['back','latissimus dorsi'], ARRAY['Machine (Selectorized)','Lat Pulldown Machine'],
  'Pull – Vertical (Guided)', 'Beginner', ARRAY['machine','back','lats','latissimus-dorsi','lat-pulldown','pull','vertical-pull','compound','selectorized','lat-pulldown-machine'], 'Web Research (Original DB)', 'back', 'lat-pulldown-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Remo Sentado', 'Seated Row Machine', 'Chest supported or free-torso seated row. Pull handles to torso. Stable platform for heavy rowing with minimal low back strain.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids','Middle Trapezius'], ARRAY['Biceps','Rear Delt'], ARRAY['back','latissimus dorsi','rhomboids','middle trapezius'], ARRAY['Machine (Selectorized)','Seated Row Machine'],
  'Pull – Horizontal (Guided)', 'Beginner', ARRAY['machine','back','lats','rhomboids','row','horizontal-pull','compound','selectorized','guided-motion'], 'Web Research (Original DB)', 'back', 'seated-row-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Remo en T', 'T-Bar Row Machine', 'Stand on platform, grip handles and row weight toward chest. Classic back mass builder. Also available as free-weight version.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids','Teres Major'], ARRAY['Biceps','Erector Spinae'], ARRAY['back','latissimus dorsi','rhomboids','teres major'], ARRAY['Machine (Plate-Loaded)','T-Bar Row Machine'],
  'Pull – Inclined Horizontal', 'Intermediate', ARRAY['machine','back','lats','row','t-bar','compound','plate-loaded','mass-builder'], 'Web Research (Original DB)', 'back', 't-bar-row-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Extensión de Espalda (Hiperextensiones)', 'Back Extension Machine', 'Anchor feet, torso hangs forward. Extend back upward to horizontal position. Strengthens lower back and glutes.', 'Back',
  ARRAY['Erector Spinae','Gluteus Maximus'], ARRAY['Hamstrings'], ARRAY['back','erector spinae','gluteus maximus'], ARRAY['Machine','Back Extension / Roman Chair'],
  'Extension – Spinal', 'Beginner', ARRAY['machine','back','lower-back','erector-spinae','glutes','hamstrings','back-extension','roman-chair','isolation','rehabilitation'], 'Web Research (Original DB)', 'back', 'back-extension-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Dominadas Asistidas', 'Assisted Pull-Up Machine', 'Counterweight assistance machine for pull-ups and chin-ups. Reduce bodyweight resistance for beginners. Progress by reducing assistance.', 'Back',
  ARRAY['Latissimus Dorsi','Teres Major'], ARRAY['Biceps','Core','Rear Delt'], ARRAY['back','latissimus dorsi','teres major'], ARRAY['Machine (Assisted)','Assisted Pull-Up Machine'],
  'Pull – Vertical (Assisted)', 'Beginner', ARRAY['machine','back','lats','pull-up','chin-up','assisted','compound','pull','beginner-friendly','bodyweight-alternative'], 'Web Research (Original DB)', 'back', 'assisted-pull-up-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Press de Hombros', 'Shoulder Press Machine', 'Seated overhead press with guided path. Safer than free-weight overhead press for beginners. Targets all delt heads.', 'Shoulders',
  ARRAY['Deltoid (All Heads)'], ARRAY['Triceps','Upper Trapezius'], ARRAY['shoulders','deltoid (all heads)'], ARRAY['Machine (Selectorized)','Shoulder Press Machine'],
  'Push – Vertical (Guided)', 'Beginner', ARRAY['machine','shoulders','deltoid','overhead-press','push','vertical-push','compound','selectorized','guided-motion'], 'Web Research (Original DB)', 'shoulders', 'shoulder-press-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Elevaciones Laterales', 'Lateral Raise Machine', 'Sit with arms under pads. Lift pads laterally to shoulder height. Isolates medial deltoid with consistent arc and resistance.', 'Shoulders',
  ARRAY['Deltoid (Medial Head)'], ARRAY['Supraspinatus'], ARRAY['shoulders','deltoid (medial head)'], ARRAY['Machine (Selectorized)','Lateral Raise Machine'],
  'Raise – Lateral (Guided)', 'Beginner', ARRAY['machine','shoulders','lateral-deltoid','medial-deltoid','raise','isolation','selectorized','guided-motion'], 'Web Research (Original DB)', 'shoulders', 'lateral-raise-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Deltoides Posterior', 'Rear Delt / Reverse Fly Machine', 'Sit facing the pad, grip handles and open arms rearward. Specifically designed for posterior deltoid and rhomboid development.', 'Shoulders',
  ARRAY['Deltoid (Posterior Head)'], ARRAY['Rhomboids','Middle Trapezius'], ARRAY['shoulders','deltoid (posterior head)'], ARRAY['Machine (Selectorized)','Rear Delt Machine / Pec Deck (Reverse)'],
  'Fly – Reverse (Guided)', 'Beginner', ARRAY['machine','shoulders','rear-delt','posterior-deltoid','rhomboids','fly','isolation','posture','selectorized'], 'Web Research (Original DB)', 'shoulders', 'rear-delt-reverse-fly-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Curl Predicador / Máquina de Bíceps', 'Preacher Curl Machine (Bicep Machine)', 'Armpad braces the elbow. Curl the machine arm upward. Prevents cheating and maximizes bicep isolation.', 'Arms',
  ARRAY['Biceps Brachii (Short Head)'], ARRAY['Brachialis'], ARRAY['arms','biceps brachii (short head)'], ARRAY['Machine (Selectorized)','Bicep Curl Machine / Preacher Curl Machine'],
  'Curl – Guided', 'Beginner', ARRAY['machine','arms','biceps','short-head','preacher-curl','isolation','selectorized','guided-motion','beginner-friendly'], 'Web Research (Original DB)', 'arms', 'preacher-curl-machine-bicep-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Extensión de Tríceps', 'Tricep Extension Machine', 'Overhead or press-down configuration. Extend arms against resistance. Isolates triceps with no shoulder stabilization required.', 'Arms',
  ARRAY['Triceps Brachii (All Heads)'], ARRAY['Anconeus'], ARRAY['arms','triceps brachii (all heads)'], ARRAY['Machine (Selectorized)','Tricep Extension Machine'],
  'Extension – Guided', 'Beginner', ARRAY['machine','arms','triceps','extension','isolation','selectorized','guided-motion'], 'Web Research (Original DB)', 'arms', 'tricep-extension-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Prensa de Piernas 45 Grados', 'Leg Press Machine (45°)', 'Recline on 45° platform. Push weighted platform upward. One of the best mass builders for quads, hamstrings and glutes.', 'Legs',
  ARRAY['Quadriceps','Glutes','Hamstrings'], ARRAY['Calves','Adductors'], ARRAY['legs','quadriceps','glutes','hamstrings'], ARRAY['Machine (Plate-Loaded)','Leg Press Machine 45°'],
  'Push – Lower Body (Incline)', 'Beginner', ARRAY['machine','legs','quads','quadriceps','glutes','hamstrings','leg-press','compound','plate-loaded','mass-builder','45-degree'], 'Web Research (Original DB)', 'legs', 'leg-press-machine-45'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Prensa de Piernas Horizontal', 'Leg Press Machine (Horizontal/Seated)', 'Seated horizontal leg press. Push platform forward. Provides excellent lower body stimulus with low spine compression.', 'Legs',
  ARRAY['Quadriceps','Glutes','Hamstrings'], ARRAY['Calves','Adductors'], ARRAY['legs','quadriceps','glutes','hamstrings'], ARRAY['Machine (Selectorized / Plate-Loaded)','Horizontal Leg Press'],
  'Push – Lower Body (Horizontal)', 'Beginner', ARRAY['machine','legs','quads','glutes','hamstrings','leg-press','compound','horizontal','selectorized'], 'Web Research (Original DB)', 'legs', 'leg-press-machine-horizontalseated'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina Hack Squat', 'Hack Squat Machine', 'Back against angled pad, feet on platform. Squat to depth. Targeted quad emphasis with reduced spinal load vs. barbell squat.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Adductors'], ARRAY['legs','quadriceps','glutes'], ARRAY['Machine (Plate-Loaded)','Hack Squat Machine'],
  'Squat – Guided', 'Intermediate', ARRAY['machine','legs','quads','quadriceps','glutes','hack-squat','compound','plate-loaded','guided-motion'], 'Web Research (Original DB)', 'legs', 'hack-squat-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Extensión de Piernas (Cuádriceps)', 'Leg Extension Machine', 'Sit with ankle under pad. Extend knees to fully straighten legs. Isolates quadriceps. Use controlled movement to protect knees.', 'Legs',
  ARRAY['Quadriceps (All 4 Heads)'], ARRAY['Rectus Femoris','VMO'], ARRAY['legs','quadriceps (all 4 heads)'], ARRAY['Machine (Selectorized)','Leg Extension Machine'],
  'Extension – Knee (Sitting)', 'Beginner', ARRAY['machine','legs','quads','quadriceps','knee-extension','isolation','selectorized','leg-extension-machine'], 'Web Research (Original DB)', 'legs', 'leg-extension-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Curl de Isquiotibiales Sentado', 'Seated Leg Curl Machine', 'Sit with ankle on top of pad. Curl knees to flex against resistance. Research shows superior hamstring growth vs. lying curl.', 'Legs',
  ARRAY['Hamstrings (All Heads – Seated Stretch)'], ARRAY['Gastrocnemius'], ARRAY['legs','hamstrings (all heads – seated stretch)'], ARRAY['Machine (Selectorized)','Seated Leg Curl Machine'],
  'Flexion – Knee (Sitting)', 'Beginner', ARRAY['machine','legs','hamstrings','leg-curl','seated','knee-flexion','isolation','selectorized','seated-leg-curl-machine'], 'Web Research (Original DB)', 'legs', 'seated-leg-curl-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Curl de Isquiotibiales Acostado', 'Lying Leg Curl Machine', 'Lie face down, ankles under roller. Curl heels toward glutes. Targets outer hamstrings (biceps femoris) more than seated version.', 'Legs',
  ARRAY['Hamstrings (Biceps Femoris)'], ARRAY['Gastrocnemius'], ARRAY['legs','hamstrings (biceps femoris)'], ARRAY['Machine (Selectorized)','Lying Leg Curl Machine'],
  'Flexion – Knee (Prone)', 'Beginner', ARRAY['machine','legs','hamstrings','leg-curl','lying','prone','knee-flexion','isolation','selectorized'], 'Web Research (Original DB)', 'legs', 'lying-leg-curl-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Abductores', 'Hip Abductor Machine', 'Sit with pads on outside of knees. Press legs outward against resistance. Strengthens gluteus medius and hip abductors.', 'Legs',
  ARRAY['Gluteus Medius','Hip Abductors'], ARRAY['Tensor Fascia Latae','Gluteus Minimus'], ARRAY['legs','gluteus medius','hip abductors'], ARRAY['Machine (Selectorized)','Hip Abductor Machine'],
  'Abduction – Hip', 'Beginner', ARRAY['machine','legs','glute-medius','abductors','hip-abduction','isolation','selectorized','stability','injury-prevention'], 'Web Research (Original DB)', 'legs', 'hip-abductor-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Aductores', 'Hip Adductor Machine', 'Sit with pads on inside of knees. Press legs inward against resistance. Targets inner thigh adductor muscles.', 'Legs',
  ARRAY['Hip Adductors','Gracilis'], ARRAY['Pectineus'], ARRAY['legs','hip adductors','gracilis'], ARRAY['Machine (Selectorized)','Hip Adductor Machine'],
  'Adduction – Hip', 'Beginner', ARRAY['machine','legs','adductors','inner-thigh','hip-adduction','isolation','selectorized','groin'], 'Web Research (Original DB)', 'legs', 'hip-adductor-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Pantorrillas de Pie', 'Standing Calf Raise Machine', 'Shoulders under pads, toes on platform edge. Rise on toes and lower for full stretch. Primary calf machine.', 'Legs',
  ARRAY['Gastrocnemius'], ARRAY['Soleus'], ARRAY['legs','gastrocnemius'], ARRAY['Machine (Selectorized / Plate-Loaded)','Standing Calf Raise Machine'],
  'Calf Raise – Standing', 'Beginner', ARRAY['machine','legs','calves','gastrocnemius','calf-raise','standing','isolation','selectorized'], 'Web Research (Original DB)', 'legs', 'standing-calf-raise-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Pantorrillas Sentado', 'Seated Calf Raise Machine', 'Sit with pads on thighs, toes on platform. Raise up on toes. Targets soleus (deeper calf muscle) more than standing variation.', 'Legs',
  ARRAY['Soleus'], ARRAY['Gastrocnemius'], ARRAY['legs','soleus'], ARRAY['Machine (Selectorized)','Seated Calf Raise Machine'],
  'Calf Raise – Seated', 'Beginner', ARRAY['machine','legs','calves','soleus','calf-raise','seated','isolation','selectorized'], 'Web Research (Original DB)', 'legs', 'seated-calf-raise-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina GHD (Glúteo-Isquiotibial)', 'Glute Ham Developer (GHD)', 'Kneel on GHD, feet anchored. Lower torso toward floor using hamstrings eccentrically, then pull back up. Very demanding posterior chain exercise.', 'Legs',
  ARRAY['Hamstrings','Gluteus Maximus'], ARRAY['Erector Spinae','Calves'], ARRAY['legs','hamstrings','gluteus maximus'], ARRAY['Machine','Glute Ham Developer (GHD)'],
  'Hip Extension – Knee Flexion', 'Advanced', ARRAY['machine','legs','hamstrings','glutes','posterior-chain','ghd','nordic-curl','advanced','compound','strength'], 'Web Research (Original DB)', 'legs', 'glute-ham-developer-ghd'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla en Máquina Smith', 'Smith Machine Squat', 'Set bar at shoulder height in Smith machine. Squat with guided bar path. More stable than free-weight squat; good for technique development.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Core'], ARRAY['legs','quadriceps','glutes'], ARRAY['Smith Machine'],
  'Squat – Guided', 'Beginner', ARRAY['smith-machine','legs','quads','glutes','squat','compound','guided-motion','smith','beginner-friendly'], 'Web Research (Original DB)', 'legs', 'smith-machine-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Banca en Máquina Smith', 'Smith Machine Bench Press', 'Lie on bench under Smith bar. Press up with guided path. Safety hooks for solo training without a spotter.', 'Chest',
  ARRAY['Pectoralis Major'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major'], ARRAY['Smith Machine'],
  'Push – Horizontal (Guided)', 'Beginner', ARRAY['smith-machine','chest','pectorals','bench-press','push','compound','guided-motion','smith','solo-training'], 'Web Research (Original DB)', 'chest', 'smith-machine-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press Inclinado en Máquina Smith', 'Smith Machine Incline Press', 'Incline bench under Smith machine. Targets upper chest with the safety of a guided bar path.', 'Chest',
  ARRAY['Pectoralis Major (Clavicular Head)'], ARRAY['Anterior Deltoid','Triceps'], ARRAY['chest','pectoralis major (clavicular head)'], ARRAY['Smith Machine','Smith Machine + Incline Bench'],
  'Push – Incline (Guided)', 'Beginner', ARRAY['smith-machine','chest','upper-chest','incline','compound','push','guided-motion','smith'], 'Web Research (Original DB)', 'chest', 'smith-machine-incline-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Hombros en Máquina Smith', 'Smith Machine Shoulder Press', 'Seated or standing, press bar overhead in Smith machine. Removes balance requirement from overhead press.', 'Shoulders',
  ARRAY['Deltoid (Anterior & Medial)'], ARRAY['Triceps','Upper Trapezius'], ARRAY['shoulders','deltoid (anterior & medial)'], ARRAY['Smith Machine'],
  'Push – Vertical (Guided)', 'Beginner', ARRAY['smith-machine','shoulders','deltoid','overhead-press','push','compound','guided-motion','smith'], 'Web Research (Original DB)', 'shoulders', 'smith-machine-shoulder-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo Inclinado en Máquina Smith', 'Smith Machine Bent-Over Row', 'Hinge at hips, row Smith bar to lower chest/abdomen. Guided path helps maintain consistent form.', 'Back',
  ARRAY['Latissimus Dorsi','Rhomboids'], ARRAY['Biceps','Rear Delt'], ARRAY['back','latissimus dorsi','rhomboids'], ARRAY['Smith Machine'],
  'Pull – Horizontal (Guided)', 'Beginner', ARRAY['smith-machine','back','lats','row','compound','pull','guided-motion','smith'], 'Web Research (Original DB)', 'back', 'smith-machine-bent-over-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Estocada en Máquina Smith', 'Smith Machine Lunge', 'Bar on shoulders in Smith. Step forward into lunge. Guided bar removes balance concern, allowing focus on leg work.', 'Legs',
  ARRAY['Quadriceps','Glutes'], ARRAY['Hamstrings','Hip Flexors'], ARRAY['legs','quadriceps','glutes'], ARRAY['Smith Machine'],
  'Lunge – Guided', 'Beginner', ARRAY['smith-machine','legs','quads','glutes','lunge','unilateral','compound','guided-motion','smith'], 'Web Research (Original DB)', 'legs', 'smith-machine-lunge'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación de Talones en Máquina Smith', 'Smith Machine Calf Raise', 'Bar on shoulders, toes on platform edge. Full range calf raise with heavy loading capability.', 'Legs',
  ARRAY['Gastrocnemius','Soleus'], ARRAY['Tibialis Anterior'], ARRAY['legs','gastrocnemius','soleus'], ARRAY['Smith Machine'],
  'Calf Raise – Guided', 'Beginner', ARRAY['smith-machine','legs','calves','gastrocnemius','calf-raise','smith'], 'Web Research (Original DB)', 'legs', 'smith-machine-calf-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación de Cadera en Máquina Smith', 'Smith Machine Hip Thrust', 'Shoulders on bench, bar across hips in Smith machine. Drive hips to full extension. Allows heavy glute loading safely.', 'Legs',
  ARRAY['Gluteus Maximus'], ARRAY['Hamstrings','Core'], ARRAY['legs','gluteus maximus'], ARRAY['Smith Machine','Smith Machine + Bench'],
  'Hip Thrust – Guided', 'Intermediate', ARRAY['smith-machine','legs','glutes','glute-max','hip-thrust','isolation','posterior-chain','smith'], 'Web Research (Original DB)', 'legs', 'smith-machine-hip-thrust'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Abdominales', 'Ab Crunch Machine', 'Sit in machine, grip handles and crunch forward contracting abs. Allows weighted progressive overload for abdominals.', 'Core',
  ARRAY['Rectus Abdominis'], ARRAY['Obliques'], ARRAY['core','rectus abdominis'], ARRAY['Machine (Selectorized)','Ab Crunch Machine'],
  'Flexion – Spinal (Guided)', 'Beginner', ARRAY['machine','core','abs','rectus-abdominis','crunch','isolation','selectorized','weighted-abs'], 'Web Research (Original DB)', 'core', 'ab-crunch-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de Rotación de Torso', 'Rotary Torso Machine', 'Sit and rotate torso against resistance. Isolates obliques through rotational movement in the transverse plane.', 'Core',
  ARRAY['Obliques (External & Internal)'], ARRAY['Transverse Abdominis'], ARRAY['core','obliques (external & internal)'], ARRAY['Machine (Selectorized)','Rotary Torso Machine'],
  'Rotation – Torso (Guided)', 'Beginner', ARRAY['machine','core','obliques','rotation','transverse-plane','isolation','selectorized','functional'], 'Web Research (Original DB)', 'core', 'rotary-torso-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Hiperextensión en Banco Romano', 'Roman Chair Back Extension', 'Hips on pad, feet anchored. Hinge at hip to lower torso, then raise back to horizontal. Strengthens lower back and glutes.', 'Back',
  ARRAY['Erector Spinae','Gluteus Maximus'], ARRAY['Hamstrings'], ARRAY['back','erector spinae','gluteus maximus'], ARRAY['Machine','Roman Chair / Hyperextension Bench'],
  'Extension – Spinal', 'Beginner', ARRAY['machine','back','lower-back','erector-spinae','glutes','back-extension','roman-chair','hyperextension','rehabilitation','posture'], 'Web Research (Original DB)', 'back', 'roman-chair-back-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevación de Piernas en Silla del Capitán', 'Captain''s Chair Leg Raise', 'Brace on padded armrests. Raise knees to chest (bent) or legs straight (advanced). Excellent lower ab movement.', 'Core',
  ARRAY['Rectus Abdominis (Lower)','Hip Flexors'], ARRAY['Obliques'], ARRAY['core','rectus abdominis (lower)','hip flexors'], ARRAY['Machine','Captain''s Chair / Power Tower'],
  'Raise – Hanging', 'Intermediate', ARRAY['machine','core','abs','lower-abs','hip-flexors','leg-raise','captains-chair','power-tower','bodyweight'], 'Web Research (Original DB)', 'core', 'captains-chair-leg-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de Banca', 'Bench Press (Barbell)', 'El movimiento es el mismo, pero las manos permanecen mucho más juntas, con unos 20 centímetros de separación entre sí. El trabajo del pectoral cede parte del prota- gonismo al tríceps. No se debe realizar este ejercicio si se sufre de las muñecas, en cualquier caso, el peso utilizado es menor que en el ejercicio básico.', 'Chest',
  ARRAY['pectoral mayor','tríceps y deltoides anterior'], ARRAY['coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor','tríceps y deltoides anterior'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Empuje / Push', 'Intermedio', ARRAY['peso-corporal','calistenia','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.37', 'chest', 'bench-press-barbell'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca inclinado', 'Incline Bench Press', 'Con el banco en idéntica posición y las mancuernas partiendo de las rodillas o del suelo, nos tumbamos y movemos el peso del mismo modo que si se tratase de la barra, con la salvedad de que permite un acerca- miento de las mismas ("cerrando") en su parte final del movimiento, en teoría para favorecer un trabajo pro- ximal del pectoral cercano al esternón. Sin embargo, no puede haber grandes diferencias, pues todo el músculo se contrae al no haber inserciones a medio camino entre la zona interna ', 'Chest',
  ARRAY['pectoral mayor (zona clavicular)','tríceps y deltoides anterior'], ARRAY['deltoides medio','coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor (zona clavicular)','tríceps y deltoides anterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.39', 'chest', 'incline-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca declinado', 'Decline Bench Press', 'Se adopta la misma posición que al usar la barra, pero ahora debemos recostarnos al tiempo que sujetamos las mancuernas con los brazos flexionados (si no nos las da un compañero). Aunque permite un mayor recorrido del movimiento hay que añadir a los inconvenientes del pressdeclinado el manejo del peso en una postura tan poco habitual, especialmente al empezar y al acabar la serie. Por todo ello, la recomenda- ción es no hacer series pesadas y solicitar la ayuda de alguien. Puede ser peligroso pa', 'Chest',
  ARRAY['pectoral mayor (zona inferior)','tríceps y deltoides anterior'], ARRAY['pectoral menor','coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor (zona inferior)','tríceps y deltoides anterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.41', 'chest', 'decline-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press con mancuernas', 'Dumbbell Press', 'Se realiza, esencialmente, como el ejercicio base, pero en este caso se produce un giro de los pulgares hacia fuera y de los meñiques hacia dentro, de modo que se acercan estos últimos en su parte final. Este giro pretende proporcionar una mayor contracción final en su parte esternal, pero el giro suele reali- zarse en el antebrazo. En esa parte final del movimiento, el pec- toral ya casi no lucha contra la gravedad, lo que le resta eficacia (ver ejercicio 2.3).', 'Chest',
  ARRAY['pectoral mayor','tríceps y deltoides anterior'], ARRAY['coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor','tríceps y deltoides anterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.43', 'chest', 'dumbbell-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas / aberturas con mancuernas', 'Dumbbell Fly', 'Se realiza, esencialmente, como el ejercicio básico, pero sobre un banco inclinado de 30º a 45º (ver "Pressde banca inclinado con mancuernas", ejercicio 2.2). Obvia- mente, las fibras más demandadas son las superiores, aunque el resto también con- tribuyen.', 'Chest',
  ARRAY['pectoral mayor','deltoides anterior y serrato anterior'], ARRAY['coracobraquial','subescapular y bíceps braquial'], ARRAY['chest','pectoral mayor','deltoides anterior y serrato anterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Apertura / Fly', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','apertura-fly','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.45', 'chest', 'dumbbell-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Fondos en el suelo', 'Push-Ups', 'Ejecución Se realiza igual que el anterior, pero El movimiento es el mismo, pero los pies permanecen en el suelo y ahora los pies permanecen sobre un las manos sobre un banco o esca- banco o escalón. El trabajo del pec- lón. El trabajo del pectoral se loca- toral se concentra más sobre su liza más sobre su parte inferior y parte superior (clavicular) y media. media.', 'Chest',
  ARRAY['pectoral mayor','tríceps y deltoides anterior'], ARRAY['serrato anterior','coracobraquial y subescapular'], ARRAY['chest','pectoral mayor','tríceps y deltoides anterior'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Empuje / Push', 'Intermedio', ARRAY['peso-corporal','calistenia','pectorales','pecho','fondos-dips','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.47', 'chest', 'push-ups'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Fondos en paralelas', 'Dips', 'Se efectúa el mismo movimiento y con las mismas premisas que en el ejercicio básico. La única diferencia es el peso que colgaremos sobre el cinturón o cintura (o sujetando unas mancuer- nas con los pies cruzados) para dar más intensidad al ejercicio. Obviamente, las precauciones señaladas en el ejercicio base deben ser ahora respetadas con mayor cautela, porque esta- mos añadiendo riesgo a las zonas solicitadas. Se recomienda bajar la velocidad de ejecución y aumentar las repeticiones, mejor que', 'Chest',
  ARRAY['pectoral mayor (inferior)','tríceps','deltoides anterior y pectoral menor'], ARRAY['serrato anterior','coracobraquial y subescapular'], ARRAY['chest','pectoral mayor (inferior)','tríceps','deltoides anterior y pectoral menor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','pectorales','pecho','fondos-dips','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.49', 'chest', 'dips'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pull over con mancuerna', 'Dumbbell Pullover', 'En esta ocasión sujetamos una barra corta en pronación (con las palmas hacia los pies) y realizamos el mismo movimiento que con las mancuernas. Este ejercicio re- sulta más peligroso que con mancuernas por la posibilidad de desequilibrio.', 'Chest',
  ARRAY['dorsal ancho','redondos y pectoral mayor'], ARRAY['serrato anterior','coracobraquial','tríceps y romboides'], ARRAY['chest','dorsal ancho','redondos y pectoral mayor'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.51', 'chest', 'dumbbell-pullover-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas con mancuernas inclinadas', 'Incline Dumbbell Fly', 'Tumbado sobre un banco, sujetamos las mancuernas verticalmente - con las palmas enfrentadas - frente a no- sotros. Con los codos semiflexionados bajamos lentamente el peso por encima y detrás de nuestra cabeza al tiempo que inspiramos (como en "pull over", ej.8), sin modificar la flexión del codo. Al llegar a la altura de nues- tra cabeza abrimos en cruz en aducción los brazos para juntarlos al costado, desde ahí los elevamos en an- tepulsión (flexión de hombros) hasta la posición inicial. Todo ', 'Chest',
  ARRAY['Pectoral','deltoides'], ARRAY['Serrato anterior','coracobraquial','bíceps'], ARRAY['chest','pectoral','deltoides'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Apertura / Fly', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','apertura-fly','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.53', 'chest', 'incline-dumbbell-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca con barra y agarre cerrado', 'Close-Grip Barbell Bench Press', 'Hay que colocarse de pie, sujetando una barra con un disco con una mano en el extremo en pronación y la otra en la mitad en supinación. La mano del extremo permanece quieta mientras la otra levanta, en semicír- culo, el peso hasta colocarlo en posición vertical. Luego la deja descender suavemente hasta el inicio. Se ins- pira en la bajada y se espira al terminar de subir.', 'Chest',
  ARRAY['pectorales (zona clavicular) y deltoides anterior'], ARRAY['serrato anterior','coracobraquial y bíceps'], ARRAY['chest','pectorales (zona clavicular) y deltoides anterior'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Empuje / Push', 'Intermedio', ARRAY['barra','peso-libre','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.55', 'chest', 'close-grip-barbell-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pull over con mancuerna en suelo', 'Floor Dumbbell Pullover', 'Se parte de la misma posición que en "Fondos rodando con mancuernas" (ver ejercicio 10), pero con las mismas orientadas hacia delante. Se dejan rodar hacia el frente y se acerca el tronco al suelo, luego se regresa hasta al principio. Se inspira al bajar, se mantiene en apnea abajo y se espira al terminar de subir.', 'Chest',
  ARRAY['pectoral mayor','dorsal ancho y abdominales'], ARRAY['redondos','serrato anterior','coracobraquial','tríceps y romboides'], ARRAY['chest','pectoral mayor','dorsal ancho y abdominales'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','pectorales','pecho','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.57', 'chest', 'floor-dumbbell-pullover'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca en máquina', 'Machine Chest Press', 'El movimiento es el mismo, pero la inclinación o el diseño de la máquina desplaza el trabajo hacia la zona alta (clavicular) de los pectorales, así como a los hombros en su parte anterior.', 'Chest',
  ARRAY['pectoral mayor','tríceps y deltoides anterior'], ARRAY['coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor','tríceps y deltoides anterior'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Empuje / Push', 'Principiante', ARRAY['maquina','selectorizada','guiado','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.59', 'chest', 'machine-chest-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca en multipower', 'Smith Machine Bench Press', 'El movimiento es el mismo que el del El movimiento es el mismo que en el ejercicio bá- ejercicio básico, pero la inclinación del sico, pero la inclinación del banco se mantiene banco se coloca entre 30º y 45º apro- en unos 30º negativos aproximadamente. El tra- ximadamente. Como en el caso de la bajo del pectoral es más intenso en sus fibras barra libre (ver ejercicio 2), la implica- inferiores. ción del pectoral se mantiene pero se Hay que tener en cuenta los inconvenientes del desplaza el trab', 'Chest',
  ARRAY['pectoral mayor','tríceps y deltoides anterior'], ARRAY['coracobraquial','serrato anterior y subescapular'], ARRAY['chest','pectoral mayor','tríceps y deltoides anterior'], ARRAY['Smith Machine / Multipower'],
  'Empuje / Push', 'Intermedio', ARRAY['smith-machine','multipower','guiado','pectorales','pecho','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.61', 'chest', 'smith-machine-bench-press-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Cruce de poleas', 'Cable Crossover', 'Lejos de ser un error, podemos convertir Se realiza en la misma postura que los anteriores el cruce en un buen ejercicio pectoral. Con pero sólo se usa un brazo, mientras permanece el la misma postura, pero distinto movimiento. otro en la cintura. Resulta más cómodo adelantar la los codos se doblan al abrir y se extienden pierna contraria al brazo que trabaja. El movimiento al juntar las manos al frente. Esto permite puede ser del tipo apertura (cruce de poleas con- utilizar más carga sin poner ', 'Chest',
  ARRAY['pectoral mayor y deltoides anterior'], ARRAY['pectoral menor','coracobraquial','serrato anterior','subescapular y bíceps'], ARRAY['chest','pectoral mayor y deltoides anterior'], ARRAY['Polea / Cable','Polea Cruce / Cable Crossover'],
  'Apertura / Fly', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','pectorales','pecho','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.63', 'chest', 'cable-crossover'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aperturas en poleas bajas', 'Low Cable Chest Fly', 'Se efectúa, esencialmente, como el ejercicio básico, pero sobre un banco inclinado de 30º a 45º (ver "Aperturas con mancuer- nas inclinadas", ejercicio 5.2). Resulta excelente para una buena congestión de la zona supe- rior del pectoral que no se puede conseguir de manera tan efec- tiva con el peso libre de las mancuernas. Solicita una zona de los pectorales que suele desarrollarse con mayor dificultad que el resto, por lo que la inclusión de este ejer- cicio en las rutinas de entrenamiento (o d', 'Chest',
  ARRAY['pectoral mayor y deltoides anterior'], ARRAY['coracobraquial','subescapular','serratos y bíceps braquial'], ARRAY['chest','pectoral mayor y deltoides anterior'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Apertura / Fly', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','pectorales','pecho','apertura-fly','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.65', 'chest', 'low-cable-chest-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Contractor', 'Pec Deck Machine', 'Se realiza igual que el ejercicio básico ya que la extensión de los codos no afecta al pectoral, pero simula la realización de unas aperturas o de "un abrazo". La ventaja sobre las aperturas se aprecia en que durante todo el recorrido la tensión permanece más o menos constante, sin perderse en su fase de cierre.', 'Chest',
  ARRAY['pectoral mayor y deltoides anterior'], ARRAY['coracobraquial','subescapular y bíceps (porción corta)'], ARRAY['chest','pectoral mayor y deltoides anterior'], ARRAY['Máquina (Selectorizada)','Contractor / Pec Deck'],
  'Compuesto / Compound', 'Principiante', ARRAY['maquina','selectorizada','guiado','pectorales','pecho','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.67', 'chest', 'pec-deck-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Fondos en paralelas asistidos (polea)', 'Assisted Dips (Cable)', 'Tumbado sobre un banco con la cabeza en el borde, sujetamos la barra o la cuerda (enganchada a la polea baja) frente a los ojos. Con los codos semiflexionados, bajamos lentamente el peso por encima y por detrás de nuestra cabeza al tiempo que realizamos una profunda inspiración, sin modificar la flexión del codo. Hemos de notar cómo se estiran los músculos pectorales. Retrocedemos hasta la vertical de nuestros ojos mientras contraemos el pectoral. Se espira al terminar de subir.', 'Chest',
  ARRAY['dorsal ancho','redondos y pectoral mayor'], ARRAY['serrato anterior','coracobraquial','tríceps y romboides'], ARRAY['chest','dorsal ancho','redondos y pectoral mayor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','pectorales','pecho','fondos-dips','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.69', 'chest', 'assisted-dips-cable'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Dominadas', 'Pull-Ups / Chin-Ups', NULL, 'Back',
  ARRAY['dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['pectoral mayor (inferior y externo)','tríceps largo','redondo menor','romboides','braquio-'], ARRAY['back','dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Jalón / Pull', 'Intermedio', ARRAY['barra','peso-libre','dorsales','espalda','lats','dominadas-pullups','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.73', 'back', 'pull-ups-chin-ups'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo con barra', 'Barbell Bent-Over Row', 'Las mancuernas permiten un Ejecución Este ejercicio es similar al ejercicio 4 agarre neutro, un mayor re- Se realiza con barra o con y al ejercicio 2.2. Se efectúa un aga- corrido y acercar el peso al mancuernas e implica algo rre neutro y las mancuernas trans- "centro de gravedad" del más al bíceps. A nivel dor- curren todo el tiempo cercanas al cuerpo (más seguro). sal, varía poco pues el tronco. El trabajo del dorsal se des- cambio está en el ante- plaza ligeramente hacia la zona brazo y no e', 'Back',
  ARRAY['dorsal ancho','redondos y deltoides posterior'], ARRAY['romboides','bíceps','braquial anterior','braquiorradial','trapecio','infraespinoso y'], ARRAY['back','dorsal ancho','redondos y deltoides posterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.75', 'back', 'barbell-bent-over-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'PRemo en punta', 'T-Bar Row', 'El ejercicio es prácticamente igual que el remo en punta, pero el agarre, más ancho, desplaza parte del trabajo a la zona alta de la espalda. El recorrido es menor, como siempre que se abre mucho el agarre en la barra, en este tipo de tracciones dorsa- les (dominadas, remos...).', 'Back',
  ARRAY['dorsal ancho','redondos y deltoides posterior'], ARRAY['romboides','bíceps','braquial anterior','braquiorradial','trapecio','infraespinoso y'], ARRAY['back','dorsal ancho','redondos y deltoides posterior'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Jalón / Pull', 'Intermedio', ARRAY['barra','peso-libre','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.77', 'back', 't-bar-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo con mancuerna', 'Dumbbell Single-Arm Row', 'La única diferencia con el ejercicio base El apoyo ya no es totalmente horizontal reside en llevar el codo más separado del con respecto al suelo sino oblicuo, y el cuerpo para desplazar parte del trabajo a tronco permanece en diagonal y con algo la zona más alta de la espalda (deltoides menos de peso que en el ejercicio básico. posteriores, trapecio, romboides...). Con ello, el trabajo del trapecio y del resto de la parte alta de la espalda es mayor. Sin embargo, el movimiento de la man- cuerna', 'Back',
  ARRAY['dorsal ancho','redondos y deltoides posterior'], ARRAY['romboides','braquial anterior','bíceps','braquiorradial y trapecio'], ARRAY['back','dorsal ancho','redondos y deltoides posterior'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.79', 'back', 'dumbbell-single-arm-row-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pull over con mancuerna', 'Dumbbell Pullover', 'Se realiza la misma ejecución que en el ejercicio base, pero con dos mancuernas menores y de forma alternativa. Permite una mayor localización, de forma independiente, en los músculos tra- bajados, pero una menor influencia en la caja torácica y en la res- piración. En líneas generales, no es un ejercicio superior al básico arriba explicado.', 'Back',
  ARRAY['dorsal mayor','redondos y pectoral mayor'], ARRAY['serrato anterior','tríceps (especialmente la cabeza larga) y romboides'], ARRAY['back','dorsal mayor','redondos y pectoral mayor'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','dorsales','espalda','lats','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.81', 'back', 'dumbbell-pullover-3'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo con barra T invertida', 'Inverted T-Bar Row', 'Nos colocamos de pie y de lado a una barra firme (horizontal o, mejor, vertical), con los pies cerca de ella y sujetos con una mano a la misma mientras la otra se coloca en la cintura. Se deja caer el cuerpo lateralmente y rígido, sin mover los pies del lugar, luego se tira del brazo para volver a acercarlo, aproximando el codo al costado. Se inspira en la primera mitad del movimiento y se espira en la última.', 'Back',
  ARRAY['dorsal ancho','bíceps','braquial y redondo mayor'], ARRAY['romboides','pectoral mayor','tríceps largo','redondo menor','braquiorradial y trapecio'], ARRAY['back','dorsal ancho','bíceps','braquial y redondo mayor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Jalón / Pull', 'Intermedio', ARRAY['barra','peso-libre','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.83', 'back', 'inverted-t-bar-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Máquina de dorsal / Jalón en máquina', 'Máquina De Dorsal / Jalón En Máquina', 'Si la máquina es de palancas independientes permitirá el ejercicio a una mano (aunque también se puede hacer en la máquina normal, pero con una postura más incómoda). Para ello, se recomienda que la otra sostenga el peso arriba en isométrico y de esta manera se consiga estabilizar la columna. Se puede realizar toda la serie con una mano o de forma alterna, en cualquier caso -siempre que el diseño sea acertado- se obten- drá un buen recorrido del movimiento.', 'Back',
  ARRAY['dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['pectoral mayor (inferior y externo)','tríceps largo','redondo menor','romboides','braquio-'], ARRAY['back','dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['Máquina (Selectorizada)','Máquina Jalón / Lat Pulldown Machine'],
  'Jalón / Pull', 'Principiante', ARRAY['maquina','selectorizada','guiado','dorsales','espalda','lats','jalon-pulldown','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.85', 'back', 'máquina-de-dorsal-jalón-en-máquina'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón polea al pecho', 'Lat Pulldown', 'El cuerpo se coloca más verti- trecho, con las palmas hacia Se realiza un agarre estrecho cal y se adelanta la cabeza dentro, y se implica algo más al con pronación, o en la barra para bajar la barra tras la nuca bíceps, al braquial y a otros; se efectúa un agarre cerrado y pero sin golpearla. Esta va- también estira el dorsal de una neutro. El dorsal se trabaja en riante resulta menos propensa forma muy característica. No se su totalidad y con buen reco- a trampas y a fallos a pesar de debe ext', 'Back',
  ARRAY['dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['pectoral mayor (inferior y externo)','tríceps largo','redondo menor','romboides','braquio-'], ARRAY['back','dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','jalon-pulldown','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.87', 'back', 'lat-pulldown'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo en polea / Gironda', 'Remo En Polea / Gironda', 'Ejecución Se tira desde la polea alta y con menos Se realiza de idéntica forma al básico peso. Está a medio camino entre el remo pero con un agarre ancho con pronación y el jalón. Si se aumenta la carga, los pies en la barra y los codos siempre separa- han de colocarse más arriba para evitar dos del tronco (brazos horizontales al que el cuerpo se eleve, pero no hay que suelo). El trabajo se desplaza a la zona extender más el tronco hacia atrás, pues lo alta de la espalda. convertiríamos en un re', 'Back',
  ARRAY['dorsal ancho','braquial','bíceps y redondos'], ARRAY['romboides','tríceps (largo)','braquiorradial','trapecio (medio e inferior)','deltoides poste-'], ARRAY['back','dorsal ancho','braquial','bíceps y redondos'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.89', 'back', 'remo-en-polea-gironda'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo en máquina', 'Machine Row', 'Se realiza de forma idéntica al ejercicio básico, con la salvedad de utilizar un agarre ancho en pronación y con los codos siem- pre separados del tronco (se mueven horizontales al suelo). El trabajo se desplaza a la zona alta de la espalda, con mayor in- cidencia del deltoides posterior y del romboides, además del dorsal y de músculos adyacentes. Algunas máquinas, menos frecuentes, permiten un agarre en supinación (ver "Remo con barra en supinación", ejercicio 2.3).', 'Back',
  ARRAY['dorsal ancho','braquial','bíceps y redondos'], ARRAY['romboides','tríceps (largo)','braquiorradial','trapecio (inferior) y deltoides posterior'], ARRAY['back','dorsal ancho','braquial','bíceps y redondos'], ARRAY['Máquina (Selectorizada)','Máquina de Remo / Seated Row'],
  'Jalón / Pull', 'Principiante', ARRAY['maquina','selectorizada','guiado','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.91', 'back', 'machine-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo de pie en polea baja', 'Standing Low Cable Row', 'Si la polea de la que tiramos está arriba, el cuerpo debe perma- necer más erguido, a medio camino entre el ejercicio básico antes descrito y el "jalón polea al pecho" (ver ejercicio 9). Se descarga esfuerzo de la zona lumbar, pero también se utiliza poco peso (debido al desequilibrio que se produciría). Es un buen comple- mento si se añade en superserie al pull overdesde polea alta (ver ejercicio 13) cuando éste se lleva hasta el punto de fallo muscular.', 'Back',
  ARRAY['dorsal ancho','braquial y redondos'], ARRAY['bíceps','(lumbar y paravertebrales)','romboides','tríceps (largo)','braquiorradial','trapecio'], ARRAY['back','dorsal ancho','braquial y redondos'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.93', 'back', 'standing-low-cable-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Pull over en polea alta', 'Cable Straight-Arm Pulldown', 'Existen pocas diferencias con el ejercicio básico. Ahora el aga- rre es neutro o en ligera pronación, y la utilización de la cuerda permite una mayor contracción final al no chocar la barra con el cuerpo (más énfasis en deltoides posterior, dorsal y redondos). La cuerda también permite realizar el ejercicio con una sola mano, aunque no aporta ventajas adicionales y puede resultar más difícil realizarlo de forma correcta.', 'Back',
  ARRAY['dorsal ancho','redondos y tríceps'], ARRAY['deltoides posterior','romboides','pectoral mayor (inferior)','trapecio y serratos'], ARRAY['back','dorsal ancho','redondos y tríceps'], ARRAY['Polea / Cable','Polea Alta / High Pulley'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.95', 'back', 'cable-straight-arm-pulldown-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Dominadas en máquina con ayuda', 'Assisted Pull-Up Machine', 'Si el aparato tiene diseñado unos agarres neutros (ni en prona- ción ni en supinación), podemos utilizarlos para dar variedad a este ejercicio. Equivale, en gran medida, a "jalones con agarre enfrentado/neutro" (ver ejercicio 9.6). El agarre supinado/invertido también es posible en algunas má- quinas de dominadas con ayuda, pero es menos habitual ya que la barra suele estar partida en dos, sin la parte central, precisa- mente de donde debería agarrarse. En caso de permitirlo, se debe revisar el ', 'Back',
  ARRAY['dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['pectoral mayor (inferior y externo)','tríceps largo','redondo menor','romboides','braquio-'], ARRAY['back','dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Jalón / Pull', 'Principiante', ARRAY['maquina','selectorizada','guiado','dorsales','espalda','lats','dominadas-pullups','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.97', 'back', 'assisted-pull-up-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón a una mano', 'Single-Arm Cable Pulldown', 'Sentándonos en el suelo o poniéndonos de rodillas, logramos, en general, un mayor recorrido que en el ejercicio básico. Pero la posición suele invitar a extender el tronco ligeramente hacia atrás, y lo convierte en un ejercicio a medio camino entre el jalón en polea alta y el remo en polea baja.', 'Back',
  ARRAY['dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['pectoral mayor (inferior y externo)','tríceps largo','redondo menor','romboides','braquio-'], ARRAY['back','dorsal ancho','bíceps (corto)','braquial y redondo mayor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','jalon-pulldown','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.99', 'back', 'single-arm-cable-pulldown'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Jalón al pecho agarre neutro', 'Neutral-Grip Lat Pulldown', 'Nos colocamos de pie entre las dos poleas, con las piernas semiflexionadas, o una más adelantada, el tronco ligeramente flexionado (menos que en el caso de cruces para pectoral) y con la fijación de los músculos abdo- minales y lumbares. Se parte con los brazos en cruz, con los codos semiflexionados, y se juntan detrás del tronco y abajo (en "aducción vertical"), sin variar la flexión del codo en todo el recorrido. En resumen, se realiza como el "cruce de poleas" para pectoral (ver ejercicio 16)', 'Back',
  ARRAY['dorsal ancho y pectoral mayor'], ARRAY['tríceps largo','redondo mayor','bíceps corto y deltoides'], ARRAY['back','dorsal ancho y pectoral mayor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','dorsales','espalda','lats','jalon-pulldown','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.101', 'back', 'neutral-grip-lat-pulldown'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo con barra en Multipower', 'Smith Machine Row', 'Se ejecuta como en el caso del peso libre (ver ejercicio 2). De pie, con el tronco recto e inclinado y las rodi- llas semiflexionadas, pero bloqueadas, se sujeta la barra en pronación (con las palmas hacia el cuerpo), con una separación algo superior a la de los hombros. Tiramos de los brazos con los codos siempre abiertos hasta llevar la barra a la zona abdominal. Se inspira justo antes de bajar el peso mediante una bocanada de aire, se mantiene en apnea durante el recorrido y se expulsa (rápid', 'Back',
  ARRAY['dorsal ancho','redondos y deltoides posterior'], ARRAY['romboides','bíceps','braquial anterior','braquiorradial','trapecio','infraespinoso y lumbares'], ARRAY['back','dorsal ancho','redondos y deltoides posterior'], ARRAY['Smith Machine / Multipower'],
  'Jalón / Pull', 'Intermedio', ARRAY['smith-machine','multipower','guiado','dorsales','espalda','lats','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.103', 'back', 'smith-machine-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press militar / frontal con barra', 'Military Press (Barbell)', 'El movimiento es el mismo, pero el banco está más vertical y se flexiona ligeramente la cabeza para bajar la barra tras ella, hasta cerca de la nuca. Se trata de un ejercicio variante del press militar que no difiere prácticamente de él, si acaso lo empeora y puede llegar a ser lesivo. El deltoides posterior no resulta más demandado aquí pese a que muchos entrenadores y vete- ranos culturistas se obcequen en ello, sólo hay que observar la posición y el movimiento del brazo en las dos variantes p', 'Shoulders',
  ARRAY['deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['deltoides (posterior)','pectoral (superior)','trapecio (superior)','bíceps (largo)','serrato an-'], ARRAY['shoulders','deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Empuje / Push', 'Intermedio', ARRAY['barra','peso-libre','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.109', 'shoulders', 'military-press-barbell'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press con mancuernas', 'Dumbbell Press', 'Permite añadir un ligero im- Ejecución Este ejercicio se realiza igual pulso de piernas en las repe- Requiere un potente blo- que el básico, pero las man- ticiones forzadas. Puede queo del tronco. Las des- cuernas se levantan de forma comprometer la espalda en ventajas son las peligrosas alterna y parando una arriba. una mala postura, y dificulta inclinaciones y rotaciones Aumenta la intensidad porque ser ayudado por alguien. de columna que pueden los brazos siempre mantienen la realizarse con c', 'Shoulders',
  ARRAY['deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['deltoides (posterior)','pectoral (superior)','trapecio (superior)','bíceps (largo)','serrato'], ARRAY['shoulders','deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.111', 'shoulders', 'dumbbell-press-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press frontal con mancuernas', 'Dumbbell Arnold Press', 'Se desarrolla prácticamente igual que el ejercicio base, pero se inclina el banco a unos 45º-60º con respecto a la horizontal y se realiza el pressen diagonal al frente, no totalmente vertical. Aunque la utilización del peso es menor, se consigue un buen trabajo de la zona anterior del deltoides (menos trabajo del tríceps aunque algo más del pectoral superior). Con series más ligeras y largas se obtiene una alta congestión. Resulta útil tomar una referencia visual en algo frente a nosotros hacia', 'Shoulders',
  ARRAY['deltoides (anterior)','coracobraquial','tríceps (excepto largo) y supraespinoso'], ARRAY['deltoides (medio y posterior)','pectoral (superior)','bíceps (largo)','trapecio y tríceps'], ARRAY['shoulders','deltoides (anterior)','coracobraquial','tríceps (excepto largo) y supraespinoso'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.113', 'shoulders', 'dumbbell-arnold-press-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales con mancuernas', 'Dumbbell Lateral Raise', 'Ejecución Esta rotación interna del brazo ayudaría a Las manos se elevan con los pulgares aislar más fácilmente el trabajo de la zona hacia arriba y el codo hacia abajo (ro- media y posterior del deltoides, pero el bí- tación escápulo-humeral externa), para ceps ya no protege tan eficazmente la ten- desplazar parte del trabajo a la zona dencia a la luxación del hombro en rotación anterior del deltoides e incluso del bí- medial del húmero, por tanto, hay que utili- ceps (especialmente a la cabeza', 'Shoulders',
  ARRAY['deltoides (lateral) y supraespinoso'], ARRAY['deltoides (anterior y posterior)','trapecio y serrato anterior (especialmente desde 90º a'], ARRAY['shoulders','deltoides (lateral) y supraespinoso'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Elevación / Raise', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.115', 'shoulders', 'dumbbell-lateral-raise-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales a una mano', 'Elevaciones Laterales A Una Mano', 'sobre un banco inclinado unos 45º-60º. La prin- De pie, se coloca el cuerpo al cipal ventaja reside en que se consigue una ten- contrario que en el anterior ejer- sión constante durante todo el recorrido al cicio y se sujeta en un soporte eliminar el punto muerto vertical que pudiera firme para no caer. Se logra pro- existir en las elevaciones convencionales. Ade- ducir una gran contracción final más, trabaja de forma muy efectiva la porción la- si se hace de forma estricta, im- teral/acromial d', 'Shoulders',
  ARRAY['deltoides (medio o lateral) y supraespinoso'], ARRAY['deltoides (anterior y posterior)','trapecio y serrato anterior (especialmente desde 90º a'], ARRAY['shoulders','deltoides (medio o lateral) y supraespinoso'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.117', 'shoulders', 'elevaciones-laterales-a-una-mano'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones frontales / flexiones', 'Dumbbell Front Raise', 'Existe una mayor tensión en los lumbares Se realiza igual que el ejercicio básico, y los paravertebrales, y casi asegura la uti- pero la posición en semipronación o neu- lización de trampas para completar una tra de las manos ayuda a concentrar el serie pesada. Por encontrar alguna ven- trabajo en la zona anterior, además de me- taja: se ganan unos segundos en acabar jorar el agarre. Nunca se debe extender el ejercicio y se fortalecen, isométrica- del todo el antebrazo. mente, los músculos fijad', 'Shoulders',
  ARRAY['deltoides (anterior)','coracobraquial y pectoral (superior)'], ARRAY['deltoides medio y posterior','trapecio (medio y superior)','bíceps y serrato'], ARRAY['shoulders','deltoides (anterior)','coracobraquial y pectoral (superior)'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Curl / Flexión', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','curl','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.119', 'shoulders', 'dumbbell-front-raise-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones posteriores / pájaros de pie', 'Bent-Over Rear Delt Fly', 'Se realiza igual, pero sentado en el Es una excelente variante. En decúbito borde de un banco. Se pasan las man- prono (tumbado sobre el pecho y el vientre) cuernas bajo las piernas, que perma- en un banco poco inclinado, eliminamos la necen juntas y adelantadas. El pecho trampa del balanceo así como la tensión mo- está en contacto con los muslos. La lesta (y hasta peligrosa según el caso) de mayor ventaja es el mejor equilibrio y la zona lumbar. la menor tensión lumbar, pero se suele Si se real', 'Shoulders',
  ARRAY['deltoides (posterior) y trapecio'], ARRAY['deltoides (medio)','dorsal ancho','romboides','redondos','tríceps','infraespinoso y (lumbar'], ARRAY['shoulders','deltoides (posterior) y trapecio'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.121', 'shoulders', 'bent-over-rear-delt-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones posteriores tumbado lateral', 'Side-Lying Rear Delt Raise', 'Se realiza en idéntica posición que el anterior, pero esta vez el codo se mueve mucho más cerca del cuerpo. La ventaja radica en la mayor utilización de peso a costa de una más intensa so- licitación dorsal. El deltoides sostiene el brazo casi en isométrico para que no se pegue al costado, y esto puede llevar a engaño en la creencia de que es él quien recibe todo el trabajo.', 'Shoulders',
  ARRAY['deltoides (posterior) y trapecio'], ARRAY['deltoides (medio)','dorsal','redondos','romboides','tríceps e infraespinoso'], ARRAY['shoulders','deltoides (posterior) y trapecio'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.123', 'shoulders', 'side-lying-rear-delt-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Remo al cuello con barra', 'Barbell Upright Row', 'rior). El movimiento es exactamente igual hasta llegar al Ejecución cuello, posición desde la que se parte para extender Se trata del mismo ejer- al frente la barra y bajarla en contracción excéntrica cicio pero se utilizan las (negativa) del deltoides (sobre todo anterior). El mancuernas en lugar de trapecio no trabaja mejor con este cambio, pues se la barra. No hay cambios desplaza responsabilidad al hombro en dicha zona significativos en el hom- frontal (imagínese que simplemente se ha añadid', 'Shoulders',
  ARRAY['deltoides'], ARRAY['trapecio','elevador de la escápula','supraespinoso','bíceps','flexores de los antebrazos'], ARRAY['shoulders','deltoides'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.125', 'shoulders', 'barbell-upright-row'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones / encogimientos de hombros', 'Shoulder Shrug', NULL, 'Shoulders',
  ARRAY['trapecio (superior) y elevador de la escápula'], ARRAY['romboideos','trapecio (medio)','deltoides y supraespinoso'], ARRAY['shoulders','trapecio (superior) y elevador de la escápula'], ARRAY['Smith Machine / Multipower'],
  'Elevación / Raise', 'Intermedio', ARRAY['smith-machine','multipower','guiado','hombros','deltoides','elevacion','encogimiento-shrug','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.127', 'shoulders', 'shoulder-shrug'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de hombros con mancuerna unilateral', 'Unilateral Dumbbell Shoulder Press', 'En decúbito lateral sobre un banco o colchoneta en el suelo, se sujeta, tipo martillo (semipronación), una mancuerna con la mano de arriba y el codo en ángulo recto apoyado en el costado. Se rota el brazo hasta completar 80º, y se baja el antebrazo para situarlo paralelo al suelo o ligeramente más allá. No se varía la fle- xión de ninguna articulación, tan sólo se rota el hombro desde el lateral hasta el frente. La respiración será de forma natural, o se inspirará al bajar el peso y se espirará ', 'Shoulders',
  ARRAY['infraespinoso y redondo menor (a veces fusionado con el primero)'], ARRAY['deltoides posterior','romboides y trapecio'], ARRAY['shoulders','infraespinoso y redondo menor (a veces fusionado con el primero)'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.129', 'shoulders', 'unilateral-dumbbell-shoulder-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Encogimiento de hombros con mancuernas', 'Dumbbell Shrug', 'Sentado en un banco inclinado (45º a 60º), se sujetan las mancuernas en posición neutra a los lados del cuerpo, con los codos semiflexionados (nunca extendidos). Se elevan frontalmente (en antepulsión), de forma alterna y sin modificar la flexión de los codos, hasta una altura algo superior a la cabeza. Puede realizarse de forma alterna o simultánea. Se toma aire al comenzar el movimiento y se espira al bajar.', 'Shoulders',
  ARRAY['deltoides (anterior)','coracobraquial y pectoral (superior)'], ARRAY['bíceps','deltoides medio y posterior','trapecio (medio y superior) y serrato'], ARRAY['shoulders','deltoides (anterior)','coracobraquial y pectoral (superior)'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Contracción / Crunch', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','encogimiento-shrug','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.131', 'shoulders', 'dumbbell-shrug-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Rotaciones externas con mancuerna', 'Dumbbell External Rotation', 'Hay que colocarse como en el ejercicio de "Remo con mancuerna" (ver ejercicio 4, "Dorsales"), apoyados sobre un banco horizontal con la mano y la rodilla del mismo lado. La otra mano sujeta la mancuerna en po- sición neutra mientras la pierna extendida o semiflexionada se apoya en el suelo, en diagonal y algo más atra- sada que el cuerpo (según altura). El tronco permanece horizontal y alineado. Se eleva el brazo en antepulsión de hombro y sin modificar la flexión de los codos, hasta la altura d', 'Shoulders',
  ARRAY['deltoides (posterior) y trapecio'], ARRAY['deltoides (medio)','romboides','infraespinoso','(lumbar y paravertebrales)'], ARRAY['shoulders','deltoides (posterior) y trapecio'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Rotación / Twist', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','hombros','deltoides','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.133', 'shoulders', 'dumbbell-external-rotation'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Rotaciones internas/externas en el suelo', 'Floor Shoulder Rotation', 'En decúbito prono (sobre el pecho y el vientre) en un banco plano, con el pecho apoyado en su borde y la cabeza fuera de él, se puede abrazar el banco para guardar el equilibrio. Se realiza el gesto de mirar al frente y, a continuación, se deja caer la cabeza suavemente hasta mirar más allá del suelo, aunque se puede hacer con los ojos cerrados. Se respirará de forma natural.', 'Shoulders',
  ARRAY['trapecio (cervical)','semiespinal y esplenios'], ARRAY['interespinosos','espinal cervical','erectores','recto posterior mayor y menor de la nuca'], ARRAY['shoulders','trapecio (cervical)','semiespinal y esplenios'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Rotación / Twist', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.135', 'shoulders', 'floor-shoulder-rotation'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales con banda', 'Resistance Band Lateral Raise', 'En decúbito supino (sobre la espalda) sobre un banco plano, con los hombros apoyados en su borde y la ca- beza fuera de él, se sujeta el banco en los laterales para guardar el equilibrio. Se flexiona la cabeza y el cue- llo hasta mirar hacia los pies, y se dejan caer hacia atrás no mucho más de la horizontal, si se desea con los ojos cerrados. La respiración se realizará de forma natural, preferiblemente inspirando al dejar caer la cabeza.', 'Shoulders',
  ARRAY['esternocleidomastoideo','escalenos (anterior','medio','posterior y mínimo -cuando existe-)'], ARRAY['largos de la cabeza y cuello','recto anterior','milohioideo','tirohioideo','esternocleidohioi-'], ARRAY['shoulders','esternocleidomastoideo','escalenos (anterior','medio','posterior y mínimo -cuando existe-)'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.137', 'shoulders', 'resistance-band-lateral-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press en máquina', 'Machine Shoulder Press', 'Se realiza en la misma posición que el ejercicio básico o con algo más de inclinación del banco. El movimiento es el mismo, pero los codos descienden frontales a nuestro cuerpo, de esta manera se pretende hacer trabajar de forma más intensa los haces anteriores de los deltoides y los superiores del pectoral (éstos últimos especialmente en los primeros grados de subida).', 'Shoulders',
  ARRAY['deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['deltoides (posterior)','pectoral (superior)','trapecio (superior)','bíceps (largo)','serrato'], ARRAY['shoulders','deltoides (anterior','medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Empuje / Push', 'Principiante', ARRAY['maquina','selectorizada','guiado','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.139', 'shoulders', 'machine-shoulder-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press frontal / militar en multipower', 'Smith Machine Shoulder Press', 'Es una réplica casi exacta al pressmilitar con la única variante de bajar la barra tras la cabeza, no por delante. Para ello, el respaldo del banco ha de estar vertical y se debe flexionar muy ligeramente la cabeza. Con- trariamente a lo que se suele creer, éste no resulta un ejercicio espe- cífico para la zona posterior del hombro (en realidad el movimiento de los brazos, como podrá observarse, es el mismo), pues trabaja de forma muy intensa las tres cabezas, si bien la anterior y la media se s', 'Shoulders',
  ARRAY['deltoides (anterior y medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['deltoides (posterior)','pectoral (superior)','trapecio (superior)','bíceps (largo)','serrato'], ARRAY['shoulders','deltoides (anterior y medio)','tríceps (excepto largo) y supraespinoso'], ARRAY['Smith Machine / Multipower'],
  'Empuje / Push', 'Intermedio', ARRAY['smith-machine','multipower','guiado','hombros','deltoides','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.141', 'shoulders', 'smith-machine-shoulder-press-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales en máquina', 'Machine Lateral Raise', 'Se realiza igual que el ejercicio con dos brazos simultáneamente, pero esta vez se practica sólo con uno durante toda la serie o de forma alternativa. No hay modificaciones en la solicitación muscular, que es idéntica. Sí hay que tener cui- dado, como en muchos otros ejercicios unilaterales, en la correcta fijación de la co- lumna y del resto del cuerpo. No hay ventajas en utilizar esta variante con respecto a la que se emplean los dos bra- zos al mismo tiempo, incluso algunos diseños de máquina', 'Shoulders',
  ARRAY['deltoides (lateral) y supraespinoso'], ARRAY['deltoides (anterior y posterior)','trapecio y serrato anterior (especialmente desde 90º a'], ARRAY['shoulders','deltoides (lateral) y supraespinoso'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Elevación / Raise', 'Principiante', ARRAY['maquina','selectorizada','guiado','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.143', 'shoulders', 'machine-lateral-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales en polea baja a una', 'Cable Lateral Raise (Single)', 'Se realiza exactamente igual que el ejercicio básico, si bien ahora la cuerda pasa por detrás del cuerpo. La principal dife- rencia reside en que, en ocasiones, existe una mayor concen- tración en la zona trabajada debido a que la mano no puede llevarse al frente durante la subida (pues la cuerda toparía con- tra el cuerpo).', 'Shoulders',
  ARRAY['deltoides (lateral) y supraespinoso'], ARRAY['deltoides (anterior y posterior)','trapecio y serrato anterior (especialmente desde 90º a'], ARRAY['shoulders','deltoides (lateral) y supraespinoso'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Elevación / Raise', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.145', 'shoulders', 'cable-lateral-raise-single'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones frontales en polea baja', 'Cable Front Raise', 'Se realiza igual que el ejercicio básico pero en esta ocasión se sujeta una cuerda o una barra con las dos manos, con los codos en semiflexión, y se pasa la cuerda de la polea entre las piernas. Aunque se gana algo de tiempo al utilizar las dos manos a la vez, la tensión que se produce en la espalda baja lo desaconseja para algunas personas con problemas en esa zona.', 'Shoulders',
  ARRAY['deltoides (anterior) y coracobraquial'], ARRAY['pectoral (superior)','deltoides lateral y posterior','bíceps','serrato y trapecio (medio y su-'], ARRAY['shoulders','deltoides (anterior) y coracobraquial'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Elevación / Raise', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','hombros','deltoides','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.147', 'shoulders', 'cable-front-raise-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'PPájaros a una mano en polea', 'Cable Rear Delt Fly (Single)', 'La posición se asemeja al equivalente con las mancuernas (ver ejercicio 8.3), se debe mirar a la polea y atrasar la pierna del brazo que trabaja. Se eleva la barra con el brazo recto cerca del tronco en extensión/retropulsión. La solicitación del dorsal es importante, como ocurría con la utilización de mancuernas. Del mismo modo, se puede realizar el movimiento simultáneo a dos manos, con cuerda o barra.', 'Shoulders',
  ARRAY['deltoides (posterior) y trapecio'], ARRAY['deltoides (medio)','dorsal','redondos','tríceps y romboides'], ARRAY['shoulders','deltoides (posterior) y trapecio'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Compuesto / Compound', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','hombros','deltoides','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.149', 'shoulders', 'cable-rear-delt-fly-single'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'PPájaro sentado en máquina horizontal', 'Rear Delt Machine Fly', 'Se parece al ejercicio anterior, pero ahora el cuerpo se coloca en la "máquina con- tractora" para pectoral, pero al revés, con el pecho apoyado en el respaldo y los bra- zos en abducción de 90º. Si la máquina tiene un diseño adecuado (no siempre), podremos apoyar los codos en las almohadillas para los antebrazos y realizar un re- corrido (casi siempre parcial) de contracción para deltoides posterior. Esta máquina puede evitarse si se tiene una específica para los deltoides posteriores, pero no ', 'Shoulders',
  ARRAY['deltoides (posterior) y trapecio'], ARRAY['deltoides (medio)','romboides','dorsal','redondos y tríceps'], ARRAY['shoulders','deltoides (posterior) y trapecio'], ARRAY['Máquina (Selectorizada)','Máquina de Deltoides Posterior / Rear Delt'],
  'Compuesto / Compound', 'Principiante', ARRAY['maquina','selectorizada','guiado','hombros','deltoides','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.151', 'shoulders', 'rear-delt-machine-fly'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'PRemo al cuello en polea baja', 'Cable Upright Row', 'Se trata de realizar el mismo movimiento que de pie, pero tum- bado en la polea de remo. De este modo, se consigue que el tronco permanezca inmóvil y se descargue el peso de la zona lumbar. El único inconveniente es el diseño inadecuado de al- gunas poleas para este ejercicio.', 'Shoulders',
  ARRAY['deltoides'], ARRAY['trapecio','elevador de la escápula','supraespinoso','bíceps','flexores de los antebrazos'], ARRAY['shoulders','deltoides'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Jalón / Pull', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','hombros','deltoides','remo','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.153', 'shoulders', 'cable-upright-row-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones / encogimientos de hombros en', 'Shoulder Shrug', 'La posición y el movimiento son los El comienzo es muy similar a "Remo al cuello en mismos que en la polea, pero ahora polea baja" (ver ejercicio 28, puede considerarse se emplea el multipowery, posible- una variante del mismo), pero al llegar arriba mente, más peso. Puede asirse por ahora se extienden los brazos en horizontal y se delante o por detrás del cuerpo, aun- baja el peso con los codos casi extendidos, im- que la diferencia entre una posición y plicando mucho más la zona anterior de lo', 'Shoulders',
  ARRAY['trapecio (superior) y elevador de la escápula'], ARRAY['romboideos','trapecio (medio)','deltoides y supraespinoso'], ARRAY['shoulders','trapecio (superior) y elevador de la escápula'], ARRAY['Smith Machine / Multipower'],
  'Elevación / Raise', 'Intermedio', ARRAY['smith-machine','multipower','guiado','hombros','deltoides','elevacion','encogimiento-shrug','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.155', 'shoulders', 'shoulder-shrug-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Rotaciones internas en polea', 'Cable Internal Rotation', 'En decúbito lateral sobre un banco o colchoneta en el suelo, se sujeta el agarre tipo martillo (semipronación) con la mano de arriba y el codo en ángulo recto apoyado en el costado. Con el antebrazo paralelo al suelo se rota externamente el hombro hasta completar 80º. No se varía la flexión de ninguna articulación, tan sólo se rota el hombro desde el frente hasta el lateral. La respiración se realizará de forma natural.', 'Shoulders',
  ARRAY['infraespinoso y redondo menor'], ARRAY['deltoides posterior'], ARRAY['shoulders','infraespinoso y redondo menor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Rotación / Twist', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','hombros','deltoides','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.157', 'shoulders', 'cable-internal-rotation'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl con barra', 'Barbell Bicep Curl', 'El agarre resulta anatómicamente El trabajo del bíceps sigue La serie consta de 21 repeticiones más racional, y además propicia siendo activo, sobre todo, la seguidas: 7 desde la máxima exten- una ligera mayor implicación del cabeza lateral/larga, y se sión hasta los 90º de flexión, 7 braquiorradial y de la cabeza larga pasa parte del protagonismo desde ahí hasta arriba y 7 comple- del bíceps. El inconveniente radica al resto de flexores. La flexión tas. La implicación muscular es idén- en que e', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Curl / Flexión', 'Intermedio', ARRAY['barra','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.161', 'arms', 'barbell-bicep-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl con mancuerna y giro', 'Dumbbell Supination Curl', 'Es un excelente ejercicio, similar al "curl Se asemeja al "curlcon barra tipo martillo" (ver con barra" (ver ejercicio 1), pero se ejercicio 1.3), por tanto, el trabajo del bíceps realiza a manos alternas. Hay que pro- sigue siendo activo, sobre todo la cabeza late- curar no extender del todo y relajar, ral/larga, pero se cede más protagonismo al pues en máxima extensión bajo carga, el resto de flexores del codo. La flexión es más tendón distal del bíceps soporta mucha "natural" en esta posición', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.163', 'arms', 'dumbbell-supination-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de barra con apoyo en banco / Scott', 'Preacher Curl (Scott Bench)', 'La única diferencia consiste en el empleo de una mano y de una mancuerna, alternando los dos brazos. La mano libre se emplea para sujetarse y guardar el equilibrio, o para completar alguna repetición extra, ayudando a la otra al final de la serie. Igualmente, se pueden emplear dos mancuernas simultánea- mente, de esta manera se asemeja, entonces, aún más al ejer- cicio con barra.', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.165', 'arms', 'preacher-curl-scott-bench'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl concentrado / apoyo en muslo', 'Concentration Curl', 'De pie, con la cadera flexionada casi 90º, una mano apoyada en un soporte frente a nosotros (o en nuestra propia pierna) para descargar el peso del tronco y la otra colgada hacia abajo sujetando la mancuerna en posición neutra, se sube hacia el hombro contrario de forma estricta y se mantiene un instante antes de bajar. Se respira igual que en el ejercicio base. Hay que procurar no balancear el brazo, excepto si deseamos com- pletar una serie forzada.', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.167', 'arms', 'concentration-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de bíceps con barra EZ', 'EZ Bar Curl', 'En decúbito supino (sobre la espalda) en un banco plano, se sujetan unas mancuernas livianas y se dejan bajar hasta donde permita la flexibilidad. Se sube de nuevo hasta terminar de vencer la gravedad. Se realiza la res- piración natural o se inspira al bajar el peso y se espira cuando termina de subir.', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.169', 'arms', 'ez-bar-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl de bíceps en banco inclinado', 'Incline Dumbbell Curl', 'De pie, en idéntica postura que el curl, con mancuernas tradicionales (ver ejercicio 2) y las manos en posi- ción neutra, se sube una mancuerna pegada al estómago al tiempo que se supina, se abre el giro y se baja en ligera rotación externa del brazo. La subida se efectúa en posición neutra y la bajada -tras el giro- supi- nada. Se repite el movimiento con el otro brazo. Se inspira al subir y se espira al bajar.', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.171', 'arms', 'incline-dumbbell-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl en máquina', 'Bicep Curl Machine', 'Si el diseño de los agarres lo permite, en algunas máquinas, éstos se pue- den sujetar en posición neutra. Con ello, proporcionamos (como en otros ejercicios de tipo martillo) una distribución mayor del esfuerzo hacia el resto de flexores del codo e implicamos algo más la cabeza larga del bíceps. Se debe recordar que en esta posición de máxima coaptación radio-cúbito la fle- xión es más "natural".', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Máquina (Selectorizada)','Máquina de Curl / Leg Curl'],
  'Curl / Flexión', 'Principiante', ARRAY['maquina','selectorizada','guiado','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.173', 'arms', 'bicep-curl-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl en polea baja', 'Cable Bicep Curl', 'Al utilizar una cuerda, las manos se De espaldas a la polea y con un solo agarre, colocan en posición neutra (tipo "mar- desde casi la máxima extensión, se flexiona el tillo"). Como en otros casos, hay codo como en el ejercicio básico (también se mayor protagonismo del resto de fle- puede realizar de frente a la polea). Suele xores del codo y de la cabeza larga. acompañarse de una ligera extensión en el Un giro en supinación final dificulta el hombro, la tensión es alta desde el principio. No mo', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Polea / Cable','Polea Baja / Low Pulley'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.175', 'arms', 'cable-bicep-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl en polea alta a una mano', 'High Cable Curl (Single Arm)', 'quiorradial. Esta variante poco convencional utiliza una o, mejor, dos manos a la vez desde Ejecución una polea vertical situada frente a la cabeza (y algo retrasada) mientras se per- Si la separación entre dos po- manece en decúbito supino (tumbado sobre la espalda). Se tira de la barra leas altas enfrentadas es la ade- desde casi la máxima extensión hacia la frente o la parte superior de la ca- cuada, podemos realizar el beza. Como en el caso del "curl en polea baja tumbado", aquí la espalda d', 'Arms',
  ARRAY['bíceps braquial','braquial anterior y braquiorradial'], ARRAY['pronador redondo','extensor largo radial del carpo','flexor superficial de los dedos','pal-'], ARRAY['arms','bíceps braquial','braquial anterior y braquiorradial'], ARRAY['Polea / Cable','Polea Alta / High Pulley'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','biceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.177', 'arms', 'high-cable-curl-single-arm'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press francés / extensiones con barra', 'French Press / Skull Crusher (Bar)', 'Generalmente, el ser humano no puede Proporciona un agarre neutro más realizar una pronación completa de 90º, al cómodo y con mejor coaptación chocar el radio contra el cúbito, y se queda (ajuste) radio-cubital. La implicación en 85º, por lo que no se podría sujetar una muscular es casi idéntica, aunque barra recta en pronación sin separar los algún estudio haya sugerido una li- codos de la vertical. Además, puede re- gera mayor intervención de la cabeza sultar molesto llegar al límite de rotaci', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Empuje / Push', 'Intermedio', ARRAY['barra','peso-libre','biceps','brazos','press','extension','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.181', 'arms', 'french-press-skull-crusher-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press francés con mancuernas', 'French Press / Skull Crusher (Dumbbell)', 'Se sujeta una sola mancuerna en pronación, y con la otra mano se fija el brazo sujetándolo por el bí- ceps. Se deja caer el peso hacia el hombro con- trario de modo que el pulgar se acerca a él. Algunas personas sienten menos molestias con esta pequeña variante, al tiempo que resulta más fácil guardar el equilibrio del brazo sujeto. Como en todos los ejercicios de tríceps, trabajan las tres cabezas, aunque se suele recomendar esta va- riante para el vasto externo.', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Empuje / Push', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','biceps','brazos','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.183', 'arms', 'french-press-skull-crusher-dumbbell'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Fondos en paralelas', 'Dips', 'En los también llamados dippings, apoyamos las manos en pronación en el borde de un banco, con las piernas extendidas con los talones al frente. Se deja caer el cuerpo en vertical (con la espalda cerca del banco) flexionando los codos hacia atrás, y con una extensión controlada del tríceps se devuelve el cuerpo hacia arriba. Para hacer el ejercicio más li- viano, hay que apoyar la planta de los pies más cerca en lugar de apoyar los talones al frente.', 'Arms',
  ARRAY['tríceps braquial','pectoral mayor (inferior) y deltoides anterior'], ARRAY['pectoral menor','serrato anterior','coracobraquial','subescapular y ancóneo'], ARRAY['arms','tríceps braquial','pectoral mayor (inferior) y deltoides anterior'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Empuje / Push', 'Intermedio', ARRAY['peso-corporal','calistenia','biceps','brazos','fondos-dips','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.185', 'arms', 'dips-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Fondos en el suelo', 'Push-Ups', 'El movimiento es el mismo, pero ahora no apoyamos las manos paralelas sino una sobre otra. El trabajo solicitado en el trí- ceps resulta casi idéntico.', 'Arms',
  ARRAY['tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['pectoral menor','serrato anterior','coracobraquial','subescapular y ancóneo'], ARRAY['arms','tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Empuje / Push', 'Intermedio', ARRAY['peso-corporal','calistenia','triceps','brazos','fondos-dips','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.187', 'arms', 'push-ups-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Patadas con mancuerna', 'Tricep Kickback', 'El agarre se mantiene en pronación, Se desarrolla al contrario que el an- de modo que al subir los nudillos apun- terior, con la palma de la mano hacia tan hacia abajo. Puede existir una li- el suelo. Puede existir una ligera gera mayor implicación de la cabeza mayor implicación de la cabeza ex- interna, pero la diferencia es pequeña terna, pero la diferencia es pequeña (ver ejercicio 1.4). (ver ejercicio 1.4).', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo','(deltoides posterior','dorsal ancho)'], ARRAY['arms','tríceps braquial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Extensión de cadera', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','triceps','brazos','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.189', 'arms', 'tricep-kickback'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de banca con agarre estrecho', 'Close-Grip Bench Press', 'Se realiza con igual posición y agarre que el ejercicio básico, pero los codos al bajar se separan del tronco y transcurren perpendiculares a éste. Es un paso in- termedio entre el pressestrecho y el pressde banca convencional, si bien al mantener un agarre cerrado todavía el trabajo del tríceps resulta significativo. Pue- den experimentarse molestias en la muñeca que lo desaconsejarían.', 'Arms',
  ARRAY['tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['coracobraquial','serrato anterior','pectoral menor','subescapular y ancóneo'], ARRAY['arms','tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Empuje / Push', 'Intermedio', ARRAY['peso-corporal','calistenia','triceps','brazos','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.191', 'arms', 'close-grip-bench-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones de mancuerna a dos manos', 'Overhead Tricep Extension (Dumbbell)', 'Se utiliza en esta ocasión una barra corta to- mada en pronación a una distancia similar a la de los hombros. Algún estudio por RMN ha dado como resultado una menor implicación de la ca- beza larga que en el resto de este tipo de ejer- cicios, pero en opinión del autor no puede haber grandes cambios. Esta variante se encuentra en desuso por lo incómodo de la posición y del equilibrio, sin ofrecer ninguna ventaja frente a las otras.', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Extensión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.193', 'arms', 'overhead-tricep-extension-dumbbell'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones en polea', 'Cable Tricep Pushdown (Bar)', 'Hay quien prefiere utilizar un solo agarre Se realiza igual que el ejercicio a una mano en pronación y realizar el trabajo de bra- pero en supinación (con la palma hacia zos alternativamente. No hay diferencias arriba). Se afirma que se consigue una li- en el trabajo muscular. Por la posición del gera mayor implicación de la cabeza late- cuerpo, se utiliza, generalmente y en pro- ral (discutible), si bien el agarre obliga a porción, menos peso que con ambas utilizar menos peso aún (ver ejercicio', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Extensión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.195', 'arms', 'cable-tricep-pushdown-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones en polea con cuerda', 'Cable Tricep Pushdown (Rope)', 'De espaldas a la polea alta (o baja), con un pie bajo En postura similar a la anterior (y al ejercicio 7.3) ella y el otro bastante adelantado sobre el que se pero con el cuerpo más vertical, se sujeta la descarga el peso, se toma la cuerda por encima de cuerda proveniente de la polea baja con una la cabeza con los codos cercanos a la misma, y se mano, y se extiende hasta arriba manteniendo el extiende al frente sin modificar la posición de los brazo vertical. La variante a dos manos se de- codo', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Extensión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.197', 'arms', 'cable-tricep-pushdown-rope-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones de tríceps en máquina', 'Tricep Extension Machine', 'Sentado en un banco similar al Scott para bíceps (ver ejercicio 3), se apoyan los brazos en el acolchado, con los codos fuera (si el diseño lo permite), alineados con el eje de la máquina. Se sujeta el agarre en posición neutra (u otra si se puede en ese aparato en concreto) y se extiende hasta casi el máximo. Se toma aire al flexionar los codos y se expulsa al terminar de extenderlos.', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo'], ARRAY['arms','tríceps braquial'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Extensión', 'Principiante', ARRAY['maquina','selectorizada','guiado','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.199', 'arms', 'tricep-extension-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Press de tríceps en máquina', 'Tricep Press Machine', 'Sentado en la máquina de presshorizontal para pecho-tríceps (siempre que disponga de una posición para éste último), se sujeta en agarre cerrado con los codos pegados al cuerpo. Se efectúa un press-extensión de los brazos (nunca hasta el bloqueo), procurando que el esfuerzo recaiga sobre el tríceps y no tanto en el pec- toral o en los hombros. Se inspira antes de la flexión del codo y se espira al terminar la extensión.', 'Arms',
  ARRAY['tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['pectoral menor','coracobraquial','serrato anterior','subescapular y ancóneo'], ARRAY['arms','tríceps braquial','pectoral mayor y deltoides anterior'], ARRAY['Máquina (Selectorizada)','Máquina Guiada / Selectorized Machine'],
  'Empuje / Push', 'Principiante', ARRAY['maquina','selectorizada','guiado','triceps','brazos','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.201', 'arms', 'tricep-press-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones de tríceps en polea alta', 'Overhead Cable Tricep Extension', 'De pie, de espaldas a la polea alta, se sujeta el agarre en pronación o supinación indistintamente, pero de- trás de nuestro tronco, como en un ejercicio de "fondos en banco". Con los pies un poco abiertos y parale- los, se bloquea el tronco. Se efectúa una extensión de los codos hacia abajo y por detrás, luego se sube de forma controlada. Se toma aire en el final de la subida y se expulsa cuando se ha completado el recorrido descendente.', 'Arms',
  ARRAY['tríceps braquial'], ARRAY['ancóneo','pectorales y deltoides anterior'], ARRAY['arms','tríceps braquial'], ARRAY['Polea / Cable','Polea Alta / High Pulley'],
  'Extensión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.203', 'arms', 'overhead-cable-tricep-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl / flexiones de antebrazo con barra', 'Wrist Curl (Barbell)', 'Sentado en un banco que deje los antebrazos horizontales o en ligera inclinación descendente, se apoyan éstos en los muslos con la muñeca en el borde de las rodi- llas y las manos fuera. Se sujeta la barra -en supinación- en extensión sobre la punta de los dedos, se flexionan los dedos y luego la muñeca. Se deja caer el peso de forma controlada. Si se dispone de una barra ancha (que no cierre mucho el agarre de los dedos), la participación de los flexores de los dedos será mayor y resultará inne', 'Arms',
  ARRAY['cubital anterior','palmar mayor y menor'], ARRAY['flexores de los dedos (profundos','superficiales','largo del pulgar)'], ARRAY['arms','cubital anterior','palmar mayor y menor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Curl / Flexión', 'Intermedio', ARRAY['barra','peso-libre','triceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.209', 'arms', 'wrist-curl-barbell'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones con barra sentado', 'Reverse Wrist Curl', 'Se realiza igual que con barra, pero en esta ocasión las dos manos van independientes, sujetando las mancuernas en pro- nación. Si se desea, se puede hacer el trabajo con una mano y luego la otra. Sin embargo, a algunas personas les resulta más incómodo guardar el equilibrio de la posición de la muñeca que en el caso de la flexión.', 'Arms',
  ARRAY['extensor de los dedos'], ARRAY['extensor largo y corto del carpo','extensor del índice','extensor largo del pulgar','exten-'], ARRAY['arms','extensor de los dedos'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Extensión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','triceps','brazos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.211', 'arms', 'reverse-wrist-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl con barra en pronación', 'Reverse Curl (Pronated)', 'Este ejercicio de bíceps no lo es tanto, al tener la mano en po- sición neutra. Puede considerarse a medio camino entre el bí- ceps y el antebrazo, pues ambos intervienen. Admite bastante peso.', 'Arms',
  ARRAY['braquial anterior y braquiorradial'], ARRAY['pronador redondo','bíceps braquial'], ARRAY['arms','braquial anterior y braquiorradial'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Curl / Flexión', 'Intermedio', ARRAY['barra','peso-libre','triceps','brazos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.213', 'arms', 'reverse-curl-pronated'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Enrollamiento de cuerda palmar', 'Rope Wrist Roll', 'Se realiza en la misma posición que el anterior, pero ahora se realizan extensiones (flexiones dorsales) para subir el peso, por lo que la cuerda se enrolla al contrario. De este modo, se tra- baja el conjunto de extensores de la muñeca.', 'Arms',
  ARRAY['cubital anterior y palmar mayor y menor'], ARRAY['flexores de los dedos (profundos','superficiales y largo del pulgar)'], ARRAY['arms','cubital anterior y palmar mayor y menor'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Compuesto / Compound', 'Intermedio', ARRAY['peso-corporal','calistenia','triceps','brazos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.215', 'arms', 'rope-wrist-roll'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Abduciones / flexiones radiales sentado', 'Wrist Radial Flexion', 'Para trabajar la zona contraria, hay que tumbarse, colocar el brazo flexionado 90º y el antebrazo horizontal sujetando el peso de igual manera que el anterior. Así reali- zamos flexiones dejando caer el peso hacia un lateral de la cabeza para luego subirlo de forma controlada. Hay que tener en cuenta que es un ejercicio de poco recorrido, y el peso a utilizar no ha de ser muy grande para permitir un movimiento correcto y sin riesgos. Una variante algo más incómoda es colocarse del mismo modo que', 'Arms',
  ARRAY['extensor largo radial del carpo y separador largo del pulgar'], ARRAY['extensor largo del pulgar','flexor radial del carpo','flexor largo del pulgar'], ARRAY['arms','extensor largo radial del carpo y separador largo del pulgar'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Curl / Flexión', 'Intermedio', ARRAY['peso-corporal','calistenia','antebrazo','brazos','curl','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.217', 'arms', 'wrist-radial-flexion'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla', 'Barbell Squat', 'Se colocan y se abren más anteriores y los antebrazos cruzados Se flexiona una rodilla para las piernas al bajar, los pies o no sobre el pecho, con el tórax en- colocar el empeine en un apuntan hacia fuera. Se con- sanchado y los codos elevados. Se uti- banco tras nosotros, la sigue un mayor trabajo de liza menos peso, pero se evita pierna sobre el suelo es la los aductores. flexionar la espalda hacia delante, pro- que recibirá casi todo el tegiéndola por ambos motivos. La so- peso al bajar. Ayu', 'Arms',
  ARRAY['cuádriceps y glúteo mayor'], ARRAY['isquiotibiales','aductores','gastrocnemios','lumbares','paravertebrales'], ARRAY['arms','cuádriceps y glúteo mayor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Sentadilla / Squat', 'Intermedio', ARRAY['barra','peso-libre','antebrazo','brazos','sentadilla-squat','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.223', 'arms', 'barbell-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Escalón', 'Step-Up', 'Se realiza exactamente igual que el ante- rior, si bien no se cambia de pie al bajar, sino que se mantiene arriba hasta com- pletar la serie. Lógicamente, es un poco más exigente, al eliminar los breves tiem- pos de descanso.', 'Arms',
  ARRAY['glúteo mayor y cuádriceps'], ARRAY['isquiotibiales','aductores'], ARRAY['arms','glúteo mayor y cuádriceps'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Sentadilla / Squat', 'Intermedio', ARRAY['peso-corporal','calistenia','antebrazo','brazos','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.225', 'arms', 'step-up'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Zancadas / tijeras', 'Lunges', 'Resulta similar al anterior, pero ahora la pierna que trabaja se queda en el sitio y se retrasa la otra. Al llevar el peso hacia de- lante al subir y no hacia atrás, es posible localizar algo más de esfuerzo en los glúteos (si la técnica es adecuada). Esta variante se puede ejecutar atando una cuerda desde la polea baja a la cintura, pero suele ser más incómoda que con el peso libre.', 'Legs',
  ARRAY['cuádriceps','glúteo mayor y aductores'], ARRAY['isquiotibiales','recto femoral del cuádriceps'], ARRAY['legs','cuádriceps','glúteo mayor y aductores'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Sentadilla / Squat', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.227', 'legs', 'lunges'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Peso muerto', 'Deadlift', 'La única diferencia es la utilización de una El movimiento es similar al ejercicio básico, o dos mancuernas, en el primer caso ésta aunque técnicamente un poco más com- se sujeta con ambas manos. La variante plicado y peligroso. La barra se sitúa como que lleva la mancuerna de un lado hacia el en la sentadilla (ver ejercicio 1) aunque el pie contrario (rotando el tronco) está to- peso es muy inferior, pues el punto de apli- talmente desaconsejada. cación de la carga está muy alejado del eje del ', 'Back',
  ARRAY['glúteo mayor','isquiotibiales','semimembranoso','semitendinoso','cabeza larga del bíceps'], ARRAY['glúteo medio (fibras posteriores)','aductor mayor','aductor menor y piriforme'], ARRAY['back','glúteo mayor','isquiotibiales','semimembranoso','semitendinoso','cabeza larga del bíceps'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Bisagra de cadera / Hinge', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','piernas','cuadriceps','isquiotibiales','gluteos','peso-muerto-deadlift','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.229', 'back', 'deadlift'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de talones', 'Standing Calf Raise', 'Es un paso intermedio en intensidad entre En este tradicional ejercicio culturista, un el ejercicio a dos pies y la utilización de compañero hará de lastre sentándose lastre. El resto se desarrolla de forma sobre las caderas (no la espalda) del que idéntica. trabaja, el cual habrá flexionado el tronco casi 90º y se habrá sujetado a un soporte para guardar el equilibrio. La posición del tronco no modifica el reclutamiento mus- cular del tríceps sural.', 'Legs',
  ARRAY['tríceps sural (sóleo y gemelos)'], ARRAY['peroneos largo y corto','tibial posterior y flexor largo de los dedos'], ARRAY['legs','tríceps sural (sóleo y gemelos)'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','piernas','cuadriceps','isquiotibiales','gluteos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.231', 'legs', 'standing-calf-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de talones sentado con barra', 'Seated Calf Raise (Bar)', 'Se realiza igual que con la barra, pero ahora se sostienen unas mancuernas y se apoya la cara plana del disco sobre el lugar donde se apoyaba la barra. La única diferencia es la preferen- cia de este lastre sobre el otro, quizá por presionar de forma menos dolorosa que la barra sobre la pierna o por la colocación más cómoda (¿?) al empezar y al acabar el ejercicio.', 'Legs',
  ARRAY['sóleo'], ARRAY['peroneos largo y corto','gemelos','tibial posterior y flexores plantares'], ARRAY['legs','sóleo'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Elevación / Raise', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','piernas','cuadriceps','isquiotibiales','gluteos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.233', 'legs', 'seated-calf-raise-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Patadas de gluteo', 'Glute Kickback', 'En decúbito prono (sobre el pecho) en un banco, abrazado a él y con las piernas completamente fuera y dobladas, se elevan éstas, al tiempo, hasta la vertical, se sostienen un instante y se descienden de nuevo. Esta variante es bastante más exigente que la anterior, pero la solicitación del músculo principal -el glúteo mayor- no es mucho más intensa. La dificultad viene dada por la fuerte contracción isométrica de los músculos lumbares para fijar la articulación.', 'Legs',
  ARRAY['semimembranoso','semitendinoso y bíceps femoral (cabeza larga)'], ARRAY['glúteo mayor','medio-fibras posteriores','(y menor)','aductor mayor','piriforme y cuadrado'], ARRAY['legs','semimembranoso','semitendinoso y bíceps femoral (cabeza larga)'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Extensión de cadera', 'Intermedio', ARRAY['peso-corporal','calistenia','piernas','cuadriceps','isquiotibiales','gluteos','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.235', 'legs', 'glute-kickback'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de pierna laterales', 'Side Leg Raise', 'El movimiento se puede realizar tumbado de lado. Se llevan las piernas en abducción, igualmente, teniendo especial cuidado de no doblar la cintura para producir una flexión y no una abducción, como es preceptivo. La ventaja del suelo es la per- manente contracción en contra de la gravedad, que desapare- cía en la parte más baja del movimiento de pie. Igual que en aquel caso, se recomienda casi siempre la utilización de tobille- ras lastradas.', 'Legs',
  ARRAY['glúteo medio','deltoides glúteo (fibras superficiales del glúteo mayor y tensor de la fascia'], ARRAY['glúteo menor','piriforme','obturador interno','géminos','gemelos','sartorio'], ARRAY['legs','glúteo medio','deltoides glúteo (fibras superficiales del glúteo mayor y tensor de la fascia'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Compuesto / Compound', 'Intermedio', ARRAY['peso-corporal','calistenia','piernas','cuadriceps','isquiotibiales','gluteos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.237', 'legs', 'side-leg-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aductores de pie / aducción de cadera', 'Standing Hip Adduction', 'El movimiento se puede realizar tumbado de lado, para ello la pierna contraria (la superior) apoya la planta del pie, y se deja flexionada ligeramente la cintura. La ventaja del suelo es el per- manente trabajo en contra de la gravedad, algo que no ocurría en la parte más baja del movimiento de pie, aunque aquí hay más participación del psoas-iliaco. Igual que en aquel caso, es recomendable casi siempre la utilización de tobilleras lastradas.', 'Legs',
  ARRAY['aductores (mayor','mediano','menor y mínimo)'], ARRAY['glúteo mayor profundo','grácil','pectíneo','cuadrado femoral','obturador externo','psoas-'], ARRAY['legs','aductores (mayor','mediano','menor y mínimo)'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Aducción / Abducción', 'Intermedio', ARRAY['peso-corporal','calistenia','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.239', 'legs', 'standing-hip-adduction'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Glúteos en polea de pie', 'Standing Cable Glute Extension', 'Sentado, con las rodillas flexionadas 90º y con los talones sobre un escalón bajo, se sostiene un disco o un lastre similar sobre la punta del pie (en el empeine). Se eleva hasta el máximo recorrido posible (máximo 30º aproximadamente) y, tras sostenerlo un instante, se desciende de nuevo. La respiración se realiza natural.', 'Legs',
  ARRAY['tibial anterior y extensor largo de los dedos'], ARRAY['extensor largo del dedo grueso'], ARRAY['legs','tibial anterior y extensor largo de los dedos'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Extensión de cadera', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.241', 'legs', 'standing-cable-glute-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla en máquina', 'Smith Machine Squat', 'Se realiza exactamente igual que en la máquina, pero colocando la barra como en el caso de la sentadilla convencional de peso libre, si bien los pies permanecen más adelantados (no hay peligro de caer hacia atrás). La sentadilla encuentra aquí un buen aliado, pues el multipower-o má- quina Smith- permite concentrarse en levantar el peso sin preocuparse tanto del equilibrio. Además, al mantener los pies adelantados, el glúteo trabaja de forma más intensa y se reduce la tensión en la rótula. La po', 'Legs',
  ARRAY['cuádriceps y glúteo mayor'], ARRAY['isquiotibiales','aductores','gastrocnemios','lumbares','paravertebrales'], ARRAY['legs','cuádriceps y glúteo mayor'], ARRAY['Smith Machine / Multipower'],
  'Sentadilla / Squat', 'Intermedio', ARRAY['smith-machine','multipower','guiado','piernas','cuadriceps','isquiotibiales','gluteos','sentadilla-squat','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.243', 'legs', 'smith-machine-squat-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Prensa / press de piernas', 'Leg Press Machine', 'Los pies se colocan en la parte alta de la prensa Se deben colocar los pies más abajo y consiguen desplazar gran parte del esfuerzo a de lo habitual. Algunos estudios se- los glúteos (por la extensión de la cadera). Algún ñalan que aquí el aductor largo pierde estudio da muy poca participación a los isquioti- protagonismo, y a favor del bíceps fe- biales, especialmente, en cargas ligeras. Las in- moral. Lo que sí parece más evidente formaciones sobre el recto femoral son es la mayor solicitación', 'Legs',
  ARRAY['cuádriceps','glúteo mayor y aductores'], ARRAY['isquiotibiales'], ARRAY['legs','cuádriceps','glúteo mayor y aductores'], ARRAY['Máquina (Selectorizada)','Prensa de Piernas / Leg Press'],
  'Empuje / Push', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','press','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.245', 'legs', 'leg-press-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones para cuádriceps / de rodilla', 'Leg Extension Machine', 'Cuando la rodilla está flexionada puede rotarse levemente, aunque aquí dicha rota- ción se produce, sobre todo, en la cadera y en los tobillos. En esta variante con menos peso, se pueden colocar las puntas de los pies hacia dentro y apoyar la zona medial del muslo en el banco. Así, se traslada más esfuerzo a los vastos externos del cuá- driceps. El resto sigue actuando, pero de forma algo menos intensa. No se debe realizar una extensión completa. Sólo es recomendable en ejercicios de rehabilitac', 'Legs',
  ARRAY['cuádriceps (vasto interno','externo y crural)'], ARRAY['recto anterior del cuádriceps y deltoides glúteo (tensor de la fascia lata y fibras superfi-'], ARRAY['legs','cuádriceps (vasto interno','externo y crural)'], ARRAY['Máquina (Selectorizada)','Máquina de Extensiones / Leg Extension'],
  'Extensión', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.247', 'legs', 'leg-extension-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl / flexiones para femoral tumbado', 'Lying Leg Curl Machine', 'colocar las puntas de los pies A la inversa que el anterior, se Se puede realizar toda una hacia dentro y apoyar el late- pasa un poco más de es- serie con la misma pierna o ral de la pierna (rotación in- fuerzo al bíceps femoral una repetición con cada una terna de pierna y de cadera). (zona lateral del muslo) (ver de ellas, esto último resulta Así se pasa un poco más de ejercicio 14). más liviano por los breves esfuerzo al semimembranoso descansos (ver ejercicio y al semitendinoso, aunque 14.4', 'Legs',
  ARRAY['bíceps femoral corto','isquiotibiales (semimembranoso','semitendinoso y cabeza larga del'], ARRAY['grácil','sartorio','gastrocnemios','poplíteo'], ARRAY['legs','bíceps femoral corto','isquiotibiales (semimembranoso','semitendinoso y cabeza larga del'], ARRAY['Máquina (Selectorizada)','Máquina de Curl / Leg Curl'],
  'Curl / Flexión', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.249', 'legs', 'lying-leg-curl-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de talones en máquina', 'Standing Calf Raise Machine', 'Con una rotación medial de la pierna, Con una rotación lateral de la pierna, acompañada de una ligera supinación, el acompañada de una ligera pronación, trabajo es más acentuado en los gastroc- el trabajo es más acentuado en los nemios laterales. Se realiza con muy poco gastrocnemios internos. Se realiza peso y sólo en el caso de descompensa- con muy poco peso y sólo en el caso ción muscular de ese lado del gemelo. de descompensación muscular de ese lado del gemelo.', 'Legs',
  ARRAY['tríceps sural (sóleo y gemelos)'], ARRAY['peroneos largo y corto','flexor largo de los dedos y tibial posterior'], ARRAY['legs','tríceps sural (sóleo y gemelos)'], ARRAY['Máquina (Selectorizada)','Máquina de Gemelos / Calf Raise Machine'],
  'Elevación / Raise', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.251', 'legs', 'standing-calf-raise-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Gemelos en prensa', 'Calf Press on Leg Press', 'Se realiza un movimiento idéntico, pero colocado en la prensa horizontal de placas, no de discos ni de palanca. La ventaja de esta variante reside en un dominio del mo- vimiento, más sencillo si se realiza lenta y controladamente. Resulta una buena va- riante para series pesadas protegiendo la espalda, respetando escrupulosamente la técnica y evitando los errores antes mencionados. Una variante se puede realizar en la máquina jaca/hack al revés, es decir, mirando hacia el respaldo. Se colocan lo', 'Legs',
  ARRAY['tríceps sural (sóleo y gemelos)'], ARRAY['peroneos largo y corto','flexor largo de los dedos y tibial posterior'], ARRAY['legs','tríceps sural (sóleo y gemelos)'], ARRAY['Máquina (Selectorizada)','Prensa de Piernas / Leg Press'],
  'Elevación de talones / Calf Raise', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.253', 'legs', 'calf-press-on-leg-press'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de talones sentado', 'Seated Calf Raise Machine', 'Se realiza igual que el anterior ejercicio, pero con otro diseño de la máquina, pues ahora son las puntas de los pies las que des- cienden en flexión plantar. No hay modificaciones en la solicitación muscular, si bien es menos frecuente encontrar un buen diseño de este aparato (por el poco rango de recorrido que conlleva). Se debe descargar el peso antes de retirar un pie.', 'Legs',
  ARRAY['sóleo'], ARRAY['peroneos largo y corto','gemelos','tibial posterior y flexores plantares'], ARRAY['legs','sóleo'], ARRAY['Máquina (Selectorizada)','Máquina de Gemelos / Calf Raise Machine'],
  'Elevación / Raise', 'Principiante', ARRAY['maquina','selectorizada','guiado','piernas','cuadriceps','isquiotibiales','gluteos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.255', 'legs', 'seated-calf-raise-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Aductores sentado', 'Hip Adductor Machine', 'Ejecución De pie, lateralmente colocado en la polea baja, hay que sujetarse al aparato y permanecer lo Se desarrolla de manera exacta al ejercicio básico, suficientemente separado de la polea como pero con una notable mayor inclinación del respaldo para permitir un movimiento significativo antes hacia atrás. De este modo, parte del trabajo solici- de tocar las placas del peso al bajar. Se tira tado pasa a los músculos posteriores de las piernas de la cuerda atada a la tobillera y proveniente que', 'Legs',
  ARRAY['aductores (mayor','mediano','menor y mínimo)'], ARRAY['glúteo mayor profundo','pectíneo','grácil','cuadrado femoral','obturador externo','psoas-'], ARRAY['legs','aductores (mayor','mediano','menor y mínimo)'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Aducción / Abducción', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.257', 'legs', 'hip-adductor-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Músculos abductores sentado', 'Hip Abductor Machine', 'De pie, lateralmente colocado en la polea baja, hay que sujetarse al aparato y permanecer lo su- ficientemente separado de la polea como para permitir un movimiento significativo antes de tocar las placas del peso al bajar. Se tira de la cuerda atada a la tobillera en la pierna alejada de la polea y se levanta en abducción en todo el rango de recorrido posible sin llegar al choque articular de la cadera. Hay que procurar no flexionar apenas la cadera y permanecer lateralmente para no realizar un', 'Legs',
  ARRAY['glúteo medio y deltoides glúteo (tensor de la fascia lata y fibras superficiales del glúteo'], ARRAY['glúteo menor','piriforme','obturador interno','géminos','gemelos','sartorio'], ARRAY['legs','glúteo medio y deltoides glúteo (tensor de la fascia lata y fibras superficiales del glúteo'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Aducción / Abducción', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.259', 'legs', 'hip-abductor-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Glúteos en multipolea', 'Cable Glute Kickback', 'De pie frente a la polea baja, con el cuerpo li- geramente flexionado y con las manos suje- tas en la máquina, se ata la tobillera a la polea y se lanza en extensión el muslo siguiendo los mismos principios que el ejercicio en máquina antes explicado. Generalmente, no se puede conseguir tanta amplitud, ni tan lograda bio- mecánicamente hablando, como en la multi- polea.', 'Legs',
  ARRAY['isquiotibiales'], ARRAY['glúteo mayor','medio (fibras posteriores)','aductor mayor','piriforme','cuadrado femoral y'], ARRAY['legs','isquiotibiales'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Extensión de cadera', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.261', 'legs', 'cable-glute-kickback-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Flexiones de cadera en polea', 'Cable Hip Flexion', 'Posición similar al ejercicio para glúteo (ejercicio 21), pero colocando la zona tibial anterior de la pierna o -según diseño de la máquina- la parte inferior del cuádriceps, en el rodillo pre- viamente retrasado respecto a nosotros. Flexionar 45 a 65º aproximadamente con respecto a la vertical, momento en que se retrocede hasta la posición inicial. Se procurará llevar la rodilla casi extendida y bloqueada.', 'Legs',
  ARRAY['psoas (mayor y menor) e iliaco'], ARRAY['recto anterior del cuádriceps','tensor de la fascia lata','sartorio','pectíneo','aductores'], ARRAY['legs','psoas (mayor y menor) e iliaco'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','curl','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.263', 'legs', 'cable-hip-flexion'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Peso muerto rumano en Smith', 'Smith Machine Romanian Deadlift', 'De pie, con la barra sobre el trapecio y los deltoides sujeta en pronación como en la sentadilla en multipower (ver ejercicio 12.2 y similares), se retrocede una pierna, se acerca su rodilla al suelo, como si se anduviese hacia atrás, y se deja caer el peso sobre la pierna adelantada. La espalda permanece recta, y el pie adelan- tado debe quedar bajo la rodilla. Luego, se levanta la barra con un empuje de la pierna adelantada. Se ins- pira en el comienzo de la bajada y se espira al terminar de s', 'Back',
  ARRAY['glúteo mayor','cuádriceps y aductores'], ARRAY['isquiotibiales','recto femoral del cuádriceps'], ARRAY['back','glúteo mayor','cuádriceps y aductores'], ARRAY['Smith Machine / Multipower'],
  'Bisagra de cadera / Hinge', 'Intermedio', ARRAY['smith-machine','multipower','guiado','piernas','cuadriceps','isquiotibiales','gluteos','peso-muerto-deadlift','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.265', 'back', 'smith-machine-romanian-deadlift'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Sentadilla Hack en polea', 'Cable Hack Squat', 'Nos colocamos en decúbito prono sobre un banco o sobre el suelo si la polea está a esa altura (aunque en ese caso se debería buscar un agarre donde sujetarse), con los pies orientados hacia la polea baja y nos su- jetamos al banco para estabilizarnos. Desde la casi máxima extensión, se flexiona la rodilla todo lo posible (unos 120º), de forma controlada pero sin hiperextender la zona lumbar. Si la carga es ligera, se respira de forma natural, si es más pesada se inspira en el comienzo de la baja', 'Legs',
  ARRAY['bíceps femoral corto e isquiotibiales (semimembranoso','semitendinoso','cabeza larga del'], ARRAY['grácil','sartorio','gastrocnemios'], ARRAY['legs','bíceps femoral corto e isquiotibiales (semimembranoso','semitendinoso','cabeza larga del'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Sentadilla / Squat', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','sentadilla-squat','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.267', 'legs', 'cable-hack-squat'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Curl femoral en polea de pie', 'Standing Cable Hamstring Curl', 'Se realiza igual que el anterior, pero la tensión de la polea viene del lado contrario del cuerpo, en abducción. La respiración se realiza de forma natural o, si se utiliza mucho peso (infrecuente), se inspira al comenzar a subir el peso y se espira al terminar de bajarlo.', 'Legs',
  ARRAY['glúteo medio y deltoides glúteo (tensor de la fascia lata y fibras superficiales del glúteo'], ARRAY['glúteo menor','piriforme','obturador interno','géminos','gemelos','sartorio'], ARRAY['legs','glúteo medio y deltoides glúteo (tensor de la fascia lata y fibras superficiales del glúteo'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','curl','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.269', 'legs', 'standing-cable-hamstring-curl'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensión de cadera en polea', 'Cable Hip Extension', 'Sentado lateralmente a la polea, con la cuerda sujeta a la punta del pie más alejado, se efectúa una rotación lateral de la rodilla en movimiento lento y estricto (máximo 40º), dejando el talón apoyado y la punta móvil. La respiración se realiza de forma natural.', 'Legs',
  ARRAY['bíceps femoral'], ARRAY['en ocasiones','leve colaboración del tensor de la fascia lata y varios sinergistas de la'], ARRAY['legs','bíceps femoral'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Extensión', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','piernas','cuadriceps','isquiotibiales','gluteos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.271', 'legs', 'cable-hip-extension'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Contracciones tumbado', 'Crunch (Floor)', 'Se realiza de forma similar al anterior, pero ahora se cruza una pierna sobre la otra (como re- ferencia) y se extiende el brazo del mismo lado en el suelo para estabilizar el cuerpo. La otra mano toca la cabeza para llevar el codo hacia la rodilla contraria (la cruzada) en un movimiento combinado de flexión y rotación. No es el ejercicio más específico para los oblicuos, que efec- tivamente trabajan el interno (menor) de su lado y el externo (mayor) del opuesto, pues el recto abdominal realiza ', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','transverso abdominal','(piramidal)'], ARRAY['core','recto abdominal mayor'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Contracción / Crunch', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.275', 'core', 'crunch-floor'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de tronco en banco / silla', 'Decline Sit-Up', 'tiempo que se sube para implicar más al oblicuo in- En esta variante se sostiene un terno (menor) del lado que se contrae y el externo disco u otro lastre en el pecho con (mayor) del opuesto (además del resto de flexo- las manos cruzadas sobre él, pre- res). A la subida y a la rotación hay que añadir, cisamente, esta carga puede desa- igualmente, un encogimiento entre las costillas y la consejar este ejercicio en algunos pelvis. La combinación flexión más rotación de casos (especialmente si se a', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','psoas','recto anterior del cuádriceps','trans-'], ARRAY['core','recto abdominal mayor'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.277', 'core', 'decline-sit-up'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones verticales de piernas, tumbado', 'Lying Leg Raise', 'Se desarrolla en la misma posición que el anterior pero hay que sujetarse en un soporte por encima de la cabeza, o bien apoyar las manos en el suelo (como muestra la imagen). Se flexionan las rodillas y la cadera en mayor o en menor grado en función del nivel del ejecutante. Se apoya toda la espalda, se elevan las piernas y se llevan las rodillas hacia los hombros, pero sin modificar apenas la flexión de la cadera (no cambiar la distancia que separa los muslos del abdomen), de no hacerlo así los', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','transverso abdominal','psoas-iliaco y (pira-'], ARRAY['core','recto abdominal mayor'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Compuesto / Compound', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.279', 'core', 'lying-leg-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de pelvis en banco vertical', 'Hanging Leg Raise', 'Nos colocamos colgados de las manos, en pronación, en una barra. Tiene más dificultad que el ejercicio antes explicado, al ser difícil man- tener el tronco siempre vertical y sin oscilaciones. Sirven las mismas indicaciones sobre el trabajo muscular que la variante en banco. Una variante muy avanzada es colgarse de los tobillos con agarres es- peciales en forma de gancho y efectuar una flexión de tronco hasta tocar la barra. Pero no es muy recomendable realizar ejercicios con la cabeza más baja ', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','psoas-iliaco','recto anterior del cuádriceps'], ARRAY['core','recto abdominal mayor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Elevación / Raise', 'Intermedio', ARRAY['barra','peso-libre','abdominales','core','oblicuos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.281', 'core', 'hanging-leg-raise'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Patadas de rana / tijeras / uve / carpa', 'Floor Ab Variations', 'Todo se realiza igual que en el ejercicio básico, pero las manos permanecen cruzadas en el pecho o -más fácil- ex- tendidas al frente. Se trata de una variante más exigente que la anterior, siempre que el recorrido del tronco y de las pier- nas sean los mismos. Sin embargo, las tensiones lumbares vuelven a desaconsejarlo.', 'Core',
  ARRAY['recto abdominal mayor','psoas-iliaco y recto anterior del cuádriceps'], ARRAY['oblicuos abdominales mayores y menores','transverso abdominal y (piramidal)'], ARRAY['core','recto abdominal mayor','psoas-iliaco y recto anterior del cuádriceps'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Sentadilla / Squat', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.283', 'core', 'floor-ab-variations'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Giros con pica', 'Barbell Twists / Russian Twist with Bar', 'Colocado en un banco inclinado como en las elevaciones de tronco, se deja caer un poco el cuerpo hacia atrás para conseguir la contracción de la faja abdominal. Con esta variante se logra el permanente trabajo abdominal que se ocupa de no dejar caer el cuerpo hacia atrás, al tiempo que lo gira en cada rotación con la pica. Sin em- bargo, puede ser perjudicial para los discos interverte- brales por lo que, en general, debe evitarse. Su inclusión en esta obra está justificada como información.', 'Core',
  ARRAY['oblicuos interno y externo'], ARRAY['recto abdominal','transverso abdominal','cuadrado lumbar y (piramidal)'], ARRAY['core','oblicuos interno y externo'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Rotación / Twist', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.285', 'core', 'barbell-twists-russian-twist-with-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Inclinaciones / flexiones laterales con pica', 'Barbell Side Bend', 'En esta variante se sujeta una mancuerna ligera o media (nunca pe- sada) en posición neutra a un lado del cuerpo, mientras que la otra permanece libre o en la cintura (sin peso). El movimiento es el mismo, mejor más lento, y se procura concentrar en los oblicuos contrarios del lado al que se baja con peso, hay que recordar que gran parte del esfuerzo lo realiza el cuadrado lumbar del lado con- trario al que mantenemos la carga. De poco sirve utilizar dos mancuernas, una por mano, pues se anu- la', 'Core',
  ARRAY['cuadrado lumbar y oblicuos interno y externo'], ARRAY['músculos autóctonos de la columna','recto abdominal y psoas'], ARRAY['core','cuadrado lumbar y oblicuos interno y externo'], ARRAY['Peso Libre - Mancuerna','Mancuerna (Dumbbell)'],
  'Curl / Flexión', 'Principiante-Intermedio', ARRAY['mancuerna','peso-libre','abdominales','core','oblicuos','curl','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.287', 'core', 'barbell-side-bend'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones laterales tumbado', 'Side-Lying Oblique Crunch', 'La posición de partida es similar a la anterior, pero sin sujetar ni cruzar las piernas. Se coloca una sobre otra y se elevan al mismo tiempo en flexión y en ligera abducción de la superior. En definitiva, hay que acercar el tronco y las piernas simultáneamente. Aunque el abdomen no contribuye a la elevación de las piernas, su movimiento ayuda a sentir el trabajo sobre los músculos trabajados en algunas personas.', 'Core',
  ARRAY['oblicuos interno y externo'], ARRAY['recto abdominal','cuadrado lumbar y paravertebrales'], ARRAY['core','oblicuos interno y externo'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Elevación / Raise', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.289', 'core', 'side-lying-oblique-crunch'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones del tronco en banco inclinado', 'Back Extension (Incline Bench)', 'Es idéntico al ejercicio antes explicado, pero ahora se sostiene un lastre en el pecho con los brazos cruzados sobre él. Si se usa menos peso, también se puede colocar en la nuca, si bien resulta menos recomendable. Obviamente, esta variante es para personas entrenadas y las precauciones -principalmente calentamiento- han de ser más acentuadas. Nunca se deben sumar giros a este movimiento. Para aumentar la intensidad, se recomienda realizar el mo- vimiento más lento antes que añadir lastre.', 'Core',
  ARRAY['erectores espinales','dorsal largo','cuadrado lumbar','iliocostal','dorsal ancho','espinosos'], ARRAY['serrato posterior inferior','glúteo mediano (fibras posteriores)','aductor mayor y piri-'], ARRAY['core','erectores espinales','dorsal largo','cuadrado lumbar','iliocostal','dorsal ancho','espinosos'], ARRAY['Peso Corporal','Peso Corporal / Bodyweight'],
  'Extensión', 'Intermedio', ARRAY['peso-corporal','calistenia','abdominales','core','oblicuos','extension','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.293', 'core', 'back-extension-incline-bench'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Elevaciones de piernas en barra fija', 'Hanging Leg Raise (Bar)', 'Colgado con la cabeza abajo, con enganches en los tobillos sobre una barra, se eleva el tronco y se flexiona por la cintura redondeando la espalda. La respiración se realiza de forma natural.', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','psoas','recto anterior del cuádriceps y trans-'], ARRAY['core','recto abdominal mayor'], ARRAY['Peso Libre - Barra','Barra Olímpica (Barbell)'],
  'Compuesto / Compound', 'Intermedio', ARRAY['barra','peso-libre','abdominales','core','oblicuos','elevacion','aislamiento','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.295', 'core', 'hanging-leg-raise-bar'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Contracciones en máquina sentado', 'Ab Crunch Machine', 'En decúbito supino (sobre la espalda), con el tronco inmovili- zado por correas o por la sujeción de las manos, se elevan los topes con los pies o con los muslos -según diseño- en flexión de cadera. Aunque se produzca un trabajo de los músculos flexores de la cadera, como el psoas o el recto anterior del cuádriceps, si el aparato está bien diseñado también producirá un encogimiento abdominal que acercará la pelvis hacia las costillas. La zona más solicitada es la inferior, pero todo el recto ant', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','psoas','recto anterior del cuádriceps y trans-'], ARRAY['core','recto abdominal mayor'], ARRAY['Máquina (Selectorizada)','Máquina Abdominal / Ab Machine'],
  'Contracción / Crunch', 'Principiante', ARRAY['maquina','selectorizada','guiado','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.297', 'core', 'ab-crunch-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Contracciones en polea alta', 'Cable Crunch (Kneeling)', 'Esta variante también se llama "de rezo". De rodillas y de frente a la polea alta -preferiblemente la de extensiones de tríceps- y con la barra o la cuerda de igual manera, se repite el mismo esquema de movimiento que en el ejercicio de pie. Hay que tener especial cuidado en no realizar flexiones de cadera sin participa- ción suficiente del recto abdominal, pues esta postura de rodillas predispone a este error. Por lo tanto, el cuerpo está bloqueado de pelvis hacia abajo (no hay variación de la ', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','transverso abdominal'], ARRAY['core','recto abdominal mayor'], ARRAY['Polea / Cable','Polea Alta / High Pulley'],
  'Contracción / Crunch', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.299', 'core', 'cable-crunch-kneeling'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Giros en disco', 'Rotary Torso Machine', 'Sentado en la máquina con el lastre seleccionado, y con el cuerpo bloqueado de cin- tura hacia abajo, se gira en uno u otro sentido levantando el peso de forma controlada. Es una máquina poco extendida en las salas de entrenamiento al ser más cara que el disco, pero localiza el trabajo en los músculos deseados de forma más eficaz y segura que el primero, además se considera la más específica para los oblicuos. No obstante, eso no debe hacer descuidar las precauciones siempre máximas, como en tod', 'Core',
  ARRAY['oblicuos interno y externo'], ARRAY['recto abdominal','transverso abdominal y cuadrado lumbar'], ARRAY['core','oblicuos interno y externo'], ARRAY['Máquina (Selectorizada)','Máquina de Giros / Rotary Torso'],
  'Rotación / Twist', 'Principiante', ARRAY['maquina','selectorizada','guiado','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.301', 'core', 'rotary-torso-machine-2'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Extensiones de tronco en remo sentado', 'Seated Back Extension Machine', 'Sentado y con la espalda apoyada (zona superior) sobre el so- porte acolchado, se realiza una extensión hasta la horizontal. Al bajar, se arquea ligeramente la espalda para, al enderezarla, tra- bajar efectivamente todos los músculos adyacentes. Si el diseño es óptimo, caben pocos errores de ejecución. Al producir una ex- tensión bastante estricta de la cadera, pero no acompañada de un enderezamiento de la columna, los músculos más solicitados son los inferiores lumbares, y no tanto los propios ', 'Core',
  ARRAY['erectores espinales','dorsal largo','cuadrado lumbar','iliocostal','dorsal ancho','espinosos'], ARRAY['serrato posterior inferior','glúteo mediano (fibras posteriores)','aductor mayor y piri-'], ARRAY['core','erectores espinales','dorsal largo','cuadrado lumbar','iliocostal','dorsal ancho','espinosos'], ARRAY['Máquina (Selectorizada)','Máquina de Remo / Seated Row'],
  'Jalón / Pull', 'Principiante', ARRAY['maquina','selectorizada','guiado','abdominales','core','oblicuos','remo','extension','compuesto','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.303', 'core', 'seated-back-extension-machine'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;

INSERT INTO exercise_library (
  name, name_en, description, primary_group,
  primary_muscles, secondary_muscles, muscle_groups, equipment,
  movement_pattern, difficulty, tags, source, icon_id, slug
) VALUES (
  'Enrollamiento abdominal en polea', 'Standing Cable Ab Rollout', 'Sentado en el suelo como en el caso del peso libre (ver ejercicio 2), las manos sostienen el agarre que viene de la polea desde atrás. Se eleva el tronco mediante una contracción de los abdominales, y se procura acor- tar el espacio entre la pelvis y el esternón. No se debe bajar demasiado y hay que realizar movimientos cor- tos para no forzar la zona lumbar. Se inspira al bajar y se espira mientras se sube.', 'Core',
  ARRAY['recto abdominal mayor'], ARRAY['oblicuos abdominales mayores y menores','psoas','recto anterior del cuádriceps y trans-'], ARRAY['core','recto abdominal mayor'], ARRAY['Polea / Cable','Máquina de Poleas / Cable Machine'],
  'Compuesto / Compound', 'Principiante-Intermedio', ARRAY['polea','cable','tension-constante','abdominales','core','oblicuos','libro:enciclopedia-musculacion'], 'Enciclopedia Musculación p.305', 'core', 'standing-cable-ab-rollout'
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  name_en          = EXCLUDED.name_en,
  description      = EXCLUDED.description,
  primary_group    = EXCLUDED.primary_group,
  primary_muscles  = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles,
  muscle_groups    = EXCLUDED.muscle_groups,
  equipment        = EXCLUDED.equipment,
  movement_pattern = EXCLUDED.movement_pattern,
  difficulty       = EXCLUDED.difficulty,
  tags             = EXCLUDED.tags,
  source           = EXCLUDED.source,
  icon_id          = EXCLUDED.icon_id;
