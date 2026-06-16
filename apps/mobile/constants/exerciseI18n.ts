/**
 * exerciseI18n.ts — Mapas de traducción EN→ES para metadata de ejercicios.
 *
 * Fuente de verdad: supabase/seed/exercises.sql (234 ejercicios).
 *
 * Decisión sobre tags: los tags son keywords de búsqueda técnica (ej.
 * "flat-bench", "hypertrophy", "compound") y NO se traducen. Son usados
 * internamente para filtrado y no se muestran al usuario final en esta versión.
 * Si en el futuro se muestran en UI, agregar un mapa aquí.
 *
 * Valores sin mapeo explícito (músculos en español del seed): el seed contiene
 * algunos músculos ya en español (ej. "bíceps braquial", "glúteo mayor"). Estos
 * pasan directamente sin traducción cuando lang === 'es', ya que el fallback
 * devuelve el value original.
 */

// ─── primary_group (6 valores) ───────────────────────────────────────────────

const GROUP_MAP: Record<string, string> = {
  Chest: "Pecho",
  Back: "Espalda",
  Legs: "Piernas",
  Shoulders: "Hombros",
  Arms: "Brazos",
  Core: "Core",
};

// ─── difficulty (3 valores) ──────────────────────────────────────────────────

const DIFFICULTY_MAP: Record<string, string> = {
  Beginner: "Principiante",
  Intermediate: "Intermedio",
  Advanced: "Avanzado",
};

// ─── movement_pattern (88 valores) ──────────────────────────────────────────

const MOVEMENT_MAP: Record<string, string> = {
  // Push – Horizontal
  "Push – Horizontal": "Empuje – Horizontal",
  "Push – Horizontal (Guided)": "Empuje – Horizontal (Guiado)",
  "Push – Incline": "Empuje – Inclinado",
  "Push – Incline (Guided)": "Empuje – Inclinado (Guiado)",
  "Push – Decline": "Empuje – Declinado",
  "Push – Vertical": "Empuje – Vertical",
  "Push – Vertical (Guided)": "Empuje – Vertical (Guiado)",
  "Push – Standing": "Empuje – De pie",
  "Push – Close Grip": "Empuje – Agarre cerrado",
  "Push – Lower Body (Horizontal)": "Empuje – Tren inferior (Horizontal)",
  "Push – Lower Body (Incline)": "Empuje – Tren inferior (Inclinado)",
  "Push – Rotational Vertical": "Empuje – Rotacional Vertical",

  // Pull – Vertical / Horizontal
  "Pull – Vertical": "Jalón – Vertical",
  "Pull – Vertical (Wide)": "Jalón – Vertical (Ancho)",
  "Pull – Vertical (Narrow)": "Jalón – Vertical (Cerrado)",
  "Pull – Vertical (Reverse)": "Jalón – Vertical (Supino)",
  "Pull – Vertical (Guided)": "Jalón – Vertical (Guiado)",
  "Pull – Vertical (Assisted)": "Jalón – Vertical (Asistido)",
  "Pull – Horizontal": "Remo – Horizontal",
  "Pull – Horizontal (Guided)": "Remo – Horizontal (Guiado)",
  "Pull – Inclined Horizontal": "Remo – Horizontal Inclinado",
  "Pull – Unilateral Horizontal": "Remo – Horizontal Unilateral",
  "Pull – Straight Arm": "Jalón – Brazos extendidos",
  "Pull – Face": "Face Pull",
  "Pull – Arc": "Jalón en arco",
  "Pull – Anti-Rotation": "Jalón – Antirotacional",

  // Fly
  "Fly – Horizontal": "Apertura – Horizontal",
  "Fly – Incline": "Apertura – Inclinada",
  "Fly – Decline": "Apertura – Declinada",
  "Fly – High Pulley": "Apertura – Polea alta",
  "Fly – Low Pulley": "Apertura – Polea baja",
  "Fly – Reverse": "Apertura inversa",
  "Fly – Reverse (Guided)": "Apertura inversa (Guiada)",
  "Fly – Guided": "Apertura – Guiada",

  // Raise
  "Raise – Lateral": "Elevación lateral",
  "Raise – Lateral (Guided)": "Elevación lateral (Guiada)",
  "Raise – Frontal": "Elevación frontal",
  "Raise – Hanging": "Elevación colgado",

  // Curl
  Curl: "Curl",
  "Curl – Braced": "Curl – Apoyado",
  "Curl – EZ Bar": "Curl – Barra EZ",
  "Curl – Guided": "Curl – Guiado",
  "Curl – Isolation": "Curl – Aislamiento",
  "Curl – Neutral Grip": "Curl – Agarre neutro",
  "Curl – Overhead Stretch": "Curl – Estiramiento sobre cabeza",
  "Curl – Rotational": "Curl – Rotacional",
  "Curl – Stretch": "Curl – Estiramiento",

  // Extension
  "Extension – Overhead": "Extensión – Sobre cabeza",
  "Extension – Pushdown": "Extensión – Polea alta",
  "Extension – Kickback": "Extensión – Patada atrás",
  "Extension – Supine": "Extensión – Tumbado",
  "Extension – Guided": "Extensión – Guiada",
  "Extension – Knee (Sitting)": "Extensión – Rodilla (Sentado)",
  "Extension – Hip": "Extensión – Cadera",
  "Extension – Spinal": "Extensión – Columna",

  // Flexion
  "Flexion – Knee (Prone)": "Flexión – Rodilla (Boca abajo)",
  "Flexion – Knee (Sitting)": "Flexión – Rodilla (Sentado)",
  "Flexion – Kneeling": "Flexión – Arrodillado",
  "Flexion – Spinal (Guided)": "Flexión – Columna (Guiada)",

  // Squat / Lunge / Step
  Squat: "Sentadilla",
  "Squat – Wide": "Sentadilla – Ancha",
  "Squat – Guided": "Sentadilla – Guiada",
  "Split Squat – Elevated Rear Foot": "Sentadilla dividida – Pie trasero elevado",
  Lunges: "Zancada",
  "Lunge – Reverse": "Zancada – Inversa",
  "Lunge – Walking": "Zancada – Caminando",
  "Lunge – Unilateral": "Zancada – Unilateral",
  "Lunge – Guided": "Zancada – Guiada",
  "Step-Up – Unilateral": "Step-Up – Unilateral",

  // Hinge / Hip
  Hinge: "Bisagra de cadera",
  "Hinge – Full": "Bisagra de cadera – Completa",
  "Hip Thrust": "Hip Thrust",
  "Hip Thrust – Guided": "Hip Thrust – Guiado",
  "Hip Extension – Knee Flexion": "Extensión de cadera – Flexión de rodilla",

  // Calf Raise
  "Calf Raise": "Elevación de gemelos",
  "Calf Raise – Standing": "Elevación de gemelos – De pie",
  "Calf Raise – Seated": "Elevación de gemelos – Sentado",
  "Calf Raise – Guided": "Elevación de gemelos – Guiada",

  // Abduction / Adduction
  Abduction: "Abducción",
  "Abduction – Hip": "Abducción – Cadera",
  Adduction: "Aducción",
  "Adduction – Hip": "Aducción – Cadera",

  // Rotation / Anti-Rotation
  Rotation: "Rotación",
  "Rotation – Diagonal": "Rotación – Diagonal",
  "Rotation – Torso (Guided)": "Rotación – Torso (Guiada)",
  "Diagonal Chop": "Corte diagonal",
  "Anti-Rotation – Press": "Antirotación – Press",
  "Lateral Flexion": "Flexión lateral",

  // Core / Other
  Shrug: "Encogimiento de hombros",
};

// ─── muscle (valores EN distintos del seed) ──────────────────────────────────
// Nota: el seed también contiene valores ya en español (campos heredados de la
// base original). Esos pasan como fallback sin traducción.

const MUSCLE_MAP: Record<string, string> = {
  // Pectorales
  Pectoral: "Pectoral",
  "Pectoralis Major": "Pectoral mayor",
  "Pectoralis Major (Sternal Head)": "Pectoral mayor (porción esternal)",
  "Pectoralis Major (Clavicular Head)": "Pectoral mayor (porción clavicular)",
  "Pectoralis Major (Lower Head)": "Pectoral mayor (porción inferior)",
  "Pectoralis Major (Lower & Sternal)": "Pectoral mayor (inferior y esternal)",
  "Upper Pectoralis": "Pectoral superior",
  "Serratus Anterior": "Serrato anterior",

  // Deltoides
  "Deltoid (All Heads)": "Deltoides (todas las porciones)",
  "Deltoid (Anterior Head)": "Deltoides anterior",
  "Deltoid (Medial Head)": "Deltoides medial",
  "Deltoid (Medial)": "Deltoides medial",
  "Deltoid (Medial/Lateral Head)": "Deltoides medial / lateral",
  "Deltoid (Posterior Head)": "Deltoides posterior",
  "Deltoid (Anterior & Medial)": "Deltoides anterior y medial",
  "Posterior Deltoid": "Deltoides posterior",
  "Anterior Deltoid": "Deltoides anterior",
  "Rear Delt": "Deltoides posterior",

  // Tríceps
  Triceps: "Tríceps",
  "Triceps Brachii": "Tríceps braquial",
  "Triceps Brachii (All Heads)": "Tríceps braquial (todas las porciones)",
  "Triceps Brachii (Long Head)": "Tríceps braquial (porción larga)",
  "Triceps Brachii (Lateral Head)": "Tríceps braquial (porción lateral)",
  "Triceps Brachii (Medial & Lateral)": "Tríceps braquial (medial y lateral)",
  "Triceps Long Head": "Tríceps – porción larga",
  "Triceps Lateral & Medial Head": "Tríceps – lateral y medial",
  "Triceps Medial Head": "Tríceps – porción medial",
  "Triceps Medial & Lateral": "Tríceps – medial y lateral",

  // Bíceps / Braquial
  Biceps: "Bíceps",
  "Biceps Brachii": "Bíceps braquial",
  "Biceps Brachii (Long Head)": "Bíceps braquial (porción larga)",
  "Biceps Brachii (Short Head)": "Bíceps braquial (porción corta)",
  Brachialis: "Braquial anterior",
  Brachioradialis: "Braquiorradial",

  // Espalda
  "Latissimus Dorsi": "Dorsal ancho",
  Lats: "Dorsal ancho",
  "Middle Trapezius": "Trapecio (porción media)",
  "Upper Trapezius": "Trapecio superior",
  Traps: "Trapecio",
  Rhomboids: "Romboides",
  "Erector Spinae": "Erectores espinales",
  "Teres Major": "Redondo mayor",
  Levator: "Elevador de la escápula",
  "Levator Scapulae": "Elevador de la escápula",
  "Rotator Cuff": "Manguito rotador",
  Supraspinatus: "Supraespinoso",

  // Core
  "Rectus Abdominis": "Recto abdominal",
  "Rectus Abdominis (Lower)": "Recto abdominal (inferior)",
  Obliques: "Oblicuos",
  "Obliques (External & Internal)": "Oblicuos (externo e interno)",
  "Transverse Abdominis": "Transverso abdominal",
  "Core Stabilizers": "Estabilizadores del core",
  "Quadratus Lumborum": "Cuadrado lumbar",

  // Piernas – cuádriceps / glúteos / isquios
  Quadriceps: "Cuádriceps",
  "Quadriceps (All 4 Heads)": "Cuádriceps (las 4 porciones)",
  "Rectus Femoris": "Recto femoral",
  Glutes: "Glúteos",
  "Glutes (Gluteus Maximus)": "Glúteo mayor",
  "Glutes (Single Leg)": "Glúteo mayor (unilateral)",
  "Gluteus Maximus": "Glúteo mayor",
  "Gluteus Medius": "Glúteo medio",
  "Gluteus Minimus": "Glúteo menor",
  Hamstrings: "Isquiotibiales",
  "Hamstrings (All Heads – Seated Stretch)": "Isquiotibiales (todos – estiramiento sentado)",
  "Hamstrings (Biceps Femoris)": "Isquiotibiales (bíceps femoral)",
  VMO: "VMO (vasto interno oblicuo)",
  Adductors: "Aductores",
  Gracilis: "Grácil",
  "Hip Adductors": "Aductores de cadera",
  "Hip Adductors (Inner Thigh)": "Aductores (cara interna del muslo)",
  "Hip Abductors": "Abductores de cadera",
  "Hip Flexors": "Flexores de cadera",
  Pectineus: "Pectíneo",
  "Tensor Fascia Latae": "Tensor de la fascia lata",
  "Serrato anterior": "Serrato anterior",

  // Gemelos
  Gastrocnemius: "Gastrocnemio",
  Soleus: "Sóleo",
  Calves: "Gemelos",
  "Tibialis Anterior": "Tibial anterior",

  // Genéricos / varios
  Core: "Core",
  Chest: "Pecho",
  Shoulders: "Hombros",
  Hips: "Caderas",
  "Forearm Flexors": "Flexores del antebrazo",
  Anconeus: "Ancóneo",
};

// ─── equipment (valores EN distintos del seed) ───────────────────────────────
// Nota: el seed mezcla valores EN y ES. Los que ya están en español pasan
// como fallback sin mapeo explícito.

const EQUIPMENT_MAP: Record<string, string> = {
  // Pesos libres
  "Free Weight": "Peso libre",
  Dumbbell: "Mancuerna",
  "Dumbbell + Bench": "Mancuerna + banco",
  "Dumbbell + Flat Bench": "Mancuerna + banco plano",
  "Dumbbell + Incline Bench": "Mancuerna + banco inclinado",
  "Dumbbell + Decline Bench": "Mancuerna + banco declinado",
  "Dumbbell + Preacher Bench": "Mancuerna + banco Scott",
  "Dumbbell + Box/Bench": "Mancuerna + cajón / banco",
  Barbell: "Barra",
  "Barra Olímpica (Barbell)": "Barra olímpica",

  // Cable / Polea
  Cable: "Polea",
  "Cable Machine": "Máquina de poleas",
  "Cable Machine (High Pulley)": "Máquina de poleas (alta)",
  "Cable Machine (Low Pulley)": "Máquina de poleas (baja)",
  "Cable Machine (Mid Pulley)": "Máquina de poleas (media)",
  "Cable Crossover": "Cruce de poleas",
  "Cable Crossover / Functional Trainer": "Cruce de poleas / Funcional",

  // Máquinas guiadas
  Machine: "Máquina",
  "Machine (Assisted)": "Máquina (asistida)",
  "Machine (Plate-Loaded)": "Máquina (placas)",
  "Machine (Selectorized)": "Máquina (selectorizada)",
  "Machine (Selectorized / Plate-Loaded)": "Máquina (selectorizada / placas)",
  "Smith Machine": "Multipower",
  "Smith Machine + Bench": "Multipower + banco",
  "Smith Machine + Incline Bench": "Multipower + banco inclinado",
  "Smith Machine / Multipower": "Multipower",

  // Máquinas específicas
  "Chest Press Machine": "Máquina press de pecho",
  "Incline Chest Press Machine": "Máquina press inclinado",
  "Shoulder Press Machine": "Máquina press de hombros",
  "Lat Pulldown Machine": "Máquina jalón",
  "Seated Row Machine": "Máquina de remo sentado",
  "Seated Cable Row Machine": "Máquina de remo en polea",
  "T-Bar Row Machine": "Máquina remo en T",
  "Leg Press Machine 45°": "Prensa de piernas 45°",
  "Horizontal Leg Press": "Prensa de piernas horizontal",
  "Hack Squat Machine": "Máquina hack squat",
  "Leg Extension Machine": "Máquina de extensiones",
  "Lying Leg Curl Machine": "Máquina curl femoral tumbado",
  "Seated Leg Curl Machine": "Máquina curl femoral sentado",
  "Hip Abductor Machine": "Máquina de abductores",
  "Hip Adductor Machine": "Máquina de aductores",
  "Lateral Raise Machine": "Máquina de elevaciones laterales",
  "Pec Deck / Butterfly Machine": "Pec Deck / Mariposa",
  "Contractor / Pec Deck": "Contractora / Pec Deck",
  "Rear Delt Machine / Pec Deck (Reverse)": "Máquina deltoides posterior / Pec Deck inverso",
  "Bicep Curl Machine / Preacher Curl Machine": "Máquina curl bíceps / Scott",
  "Tricep Extension Machine": "Máquina extensiones de tríceps",
  "Standing Calf Raise Machine": "Máquina gemelos de pie",
  "Seated Calf Raise Machine": "Máquina gemelos sentado",
  "Ab Crunch Machine": "Máquina de abdominales",
  "Rotary Torso Machine": "Máquina de rotación de torso",
  "Assisted Pull-Up Machine": "Máquina dominadas asistidas",
  "Back Extension / Roman Chair": "Banco de extensiones / silla romana",
  "Roman Chair / Hyperextension Bench": "Silla romana / banco de hiperextensiones",
  "Glute Ham Developer (GHD)": "GHD (Glute Ham Developer)",
  "Captain": "Silla capitán",
  "s Chair / Power Tower": "Silla capitán / torre de potencia",

  // Peso corporal
  Bodyweight: "Peso corporal",
  "Push-Ups": "Flexiones",
  "Pull-Ups / Chin-Ups": "Dominadas",
};

// ─── Helper principal ────────────────────────────────────────────────────────

/**
 * Localiza un valor de metadata de ejercicio al idioma indicado.
 *
 * @param value  - Valor original de la DB (siempre string, puede ser en ES o EN).
 * @param kind   - Tipo de metadata a traducir.
 * @param lang   - Idioma activo ('es' | 'en').
 * @returns Traducción ES si existe; value original si no hay mapeo (fallback seguro,
 *          nunca devuelve string vacío). Si lang === 'en' devuelve el value sin modificar.
 */
export function localizeMeta(
  value: string,
  kind: "group" | "difficulty" | "movement" | "muscle" | "equipment",
  lang: "es" | "en"
): string {
  if (!value) return value;
  if (lang === "en") return value;

  const map: Record<string, string> =
    kind === "group"
      ? GROUP_MAP
      : kind === "difficulty"
        ? DIFFICULTY_MAP
        : kind === "movement"
          ? MOVEMENT_MAP
          : kind === "muscle"
            ? MUSCLE_MAP
            : EQUIPMENT_MAP;

  return map[value] ?? value;
}
