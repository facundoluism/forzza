// content/quotes.ts — Frases motivacionales de deportistas (puro, sin deps).
//
// Compartido entre mobile (welcome + "frase del día" del home) y web (landing).
// Solo temática deportiva / esfuerzo / perseverancia. SIN política, guerra ni violencia.
//
// IMPORTANTE: `verified` arranca en false en TODAS. Son citas ampliamente
// atribuidas pero la atribución exacta debe validarla un humano antes de
// producción (HUMAN_REVIEW). Al confirmar una cita, poné `verified: true`.

export interface MotivationalQuote {
  id: string;
  /** Texto en español rioplatense (voseo cuando aplique). */
  text_es: string;
  /** Texto en inglés. */
  text_en: string;
  /** Nombre del deportista al que se atribuye. */
  author: string;
  /** Deporte / disciplina. */
  sport: string;
  /** true solo tras validación humana de la atribución. */
  verified: boolean;
}

export const QUOTES: MotivationalQuote[] = [
  { id: "ali-days", text_es: "No cuentes los días. Hacé que los días cuenten.", text_en: "Don't count the days; make the days count.", author: "Muhammad Ali", sport: "Boxeo", verified: false },
  { id: "jordan-shots", text_es: "Fallé más de 9.000 tiros en mi carrera. Por eso tengo éxito.", text_en: "I've missed more than 9,000 shots in my career. That is why I succeed.", author: "Michael Jordan", sport: "Básquet", verified: false },
  { id: "gretzky-shots", text_es: "Errás el 100% de los tiros que no tomás.", text_en: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", sport: "Hockey", verified: false },
  { id: "pele-success", text_es: "El éxito no es casualidad: es trabajo duro, perseverancia y sacrificio.", text_en: "Success is no accident. It is hard work, perseverance, and sacrifice.", author: "Pelé", sport: "Fútbol", verified: false },
  { id: "ruth-giveup", text_es: "Es difícil ganarle a alguien que nunca se rinde.", text_en: "It's hard to beat a person who never gives up.", author: "Babe Ruth", sport: "Béisbol", verified: false },
  { id: "arnold-reps", text_es: "Las últimas repeticiones son las que hacen crecer el músculo.", text_en: "The last few reps are what make the muscle grow.", author: "Arnold Schwarzenegger", sport: "Fisicoculturismo", verified: false },
  { id: "coleman-weights", text_es: "Todos quieren ser fuertes, pero nadie quiere levantar pesado.", text_en: "Everybody wants to be strong, but nobody wants to lift heavy weights.", author: "Ronnie Coleman", sport: "Fisicoculturismo", verified: false },
  { id: "bolt-worry", text_es: "Preocuparse no te lleva a ningún lado. Enfocate en entrenar.", text_en: "Worrying gets you nowhere. Focus on the work.", author: "Usain Bolt", sport: "Atletismo", verified: false },
  { id: "serena-champion", text_es: "Un campeón se define por cómo se recupera cuando cae.", text_en: "A champion is defined by how they recover when they fall.", author: "Serena Williams", sport: "Tenis", verified: false },
  { id: "kobe-pressure", text_es: "Todo lo negativo —presión, desafíos— es una oportunidad para crecer.", text_en: "Everything negative — pressure, challenges — is a chance for me to rise.", author: "Kobe Bryant", sport: "Básquet", verified: false },
  { id: "messi-fight", text_es: "Hay que pelear por el sueño. Hay que sacrificarse y trabajar duro.", text_en: "You have to fight to reach your dream. Sacrifice and work hard for it.", author: "Lionel Messi", sport: "Fútbol", verified: false },
  { id: "ronaldo-talent", text_es: "El talento sin trabajo duro no es nada.", text_en: "Talent without working hard is nothing.", author: "Cristiano Ronaldo", sport: "Fútbol", verified: false },
  { id: "phelps-limit", text_es: "No le pongas límite a nada. Cuanto más soñás, más lejos llegás.", text_en: "You can't put a limit on anything. The more you dream, the farther you get.", author: "Michael Phelps", sport: "Natación", verified: false },
  { id: "biles-risk", text_es: "Prefiero arrepentirme de los riesgos que tomé y no de las chances que no aproveché.", text_en: "I'd rather regret the risks that didn't work out than the chances I didn't take.", author: "Simone Biles", sport: "Gimnasia", verified: false },
  { id: "owens-dreams", text_es: "Todos tenemos sueños. Hacerlos realidad exige dedicación, disciplina y esfuerzo.", text_en: "We all have dreams. To make them real takes dedication, discipline and effort.", author: "Jesse Owens", sport: "Atletismo", verified: false },
  { id: "king-right", text_es: "Los campeones siguen jugando hasta que les sale bien.", text_en: "Champions keep playing until they get it right.", author: "Billie Jean King", sport: "Tenis", verified: false },
  { id: "brady-believe", text_es: "Si no creés en vos mismo, ¿por qué lo haría alguien más?", text_en: "If you don't believe in yourself, why is anybody else going to believe in you?", author: "Tom Brady", sport: "Fútbol americano", verified: false },
  { id: "rudolph-spirit", text_es: "Nunca subestimes el poder de los sueños y la fuerza del espíritu humano.", text_en: "Never underestimate the power of dreams and the strength of the human spirit.", author: "Wilma Rudolph", sport: "Atletismo", verified: false },
  { id: "jjk-prepare", text_es: "Es mejor mirar adelante y prepararse que mirar atrás y arrepentirse.", text_en: "It is better to look ahead and prepare than to look back and regret.", author: "Jackie Joyner-Kersee", sport: "Atletismo", verified: false },
  { id: "hamm-love", text_es: "Detrás de la atleta que sos hay una nena que se enamoró del juego.", text_en: "Behind the athlete you've become is a kid who fell in love with the game.", author: "Mia Hamm", sport: "Fútbol", verified: false },
  { id: "navratilova-commit", text_es: "La diferencia entre involucrarse y comprometerse es total: hay que comprometerse.", text_en: "The difference between involvement and commitment is everything — commit.", author: "Martina Navratilova", sport: "Tenis", verified: false },
  { id: "federer-effortless", text_es: "Lo que parece fácil es el resultado de un esfuerzo enorme.", text_en: "What looks effortless is the result of enormous effort.", author: "Roger Federer", sport: "Tenis", verified: false },
  { id: "nadal-endure", text_es: "Aguantar el sufrimiento del entrenamiento es parte de competir.", text_en: "Enduring the suffering of training is part of competing.", author: "Rafael Nadal", sport: "Tenis", verified: false },
  { id: "maradona-getup", text_es: "La pelota no se mancha; lo que importa es volver a levantarse.", text_en: "What matters is getting back up every time.", author: "Diego Maradona", sport: "Fútbol", verified: false },
  { id: "ginobili-team", text_es: "El talento gana partidos, pero el trabajo en equipo gana campeonatos.", text_en: "Talent wins games, but teamwork wins championships.", author: "Manu Ginóbili", sport: "Básquet", verified: false },
  { id: "lebron-nothinggiven", text_es: "Nada te es dado. Todo se gana.", text_en: "Nothing is given. Everything is earned.", author: "LeBron James", sport: "Básquet", verified: false },
  { id: "curry-doubt", text_es: "Usá la duda de los demás como combustible.", text_en: "Use everyone else's doubt as fuel.", author: "Stephen Curry", sport: "Básquet", verified: false },
  { id: "ledecky-process", text_es: "Enamorate del proceso y los resultados llegan.", text_en: "Fall in love with the process and the results will come.", author: "Katie Ledecky", sport: "Natación", verified: false },
  { id: "bannister-barrier", text_es: "Las barreras están primero en la mente.", text_en: "The barriers are in the mind first.", author: "Roger Bannister", sport: "Atletismo", verified: false },
  { id: "lewis-discipline", text_es: "La disciplina de hoy es la libertad de mañana.", text_en: "Today's discipline is tomorrow's freedom.", author: "Carl Lewis", sport: "Atletismo", verified: false },
];

/**
 * Frase "del día": determinística por número de día (epoch day = floor(epochMs/86400000)).
 * El CALLER pasa el día (mantiene esta función pura y testeable).
 */
export function quoteOfTheDay(epochDay: number): MotivationalQuote {
  const idx = ((Math.floor(epochDay) % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[idx]!;
}

/**
 * Frase por índice/seed arbitrario (para rotación o selección "aleatoria").
 * El CALLER provee el seed (ej. un contador o un random precomputado) para
 * mantener la función pura.
 */
export function quoteByIndex(seed: number): MotivationalQuote {
  const idx = ((Math.floor(seed) % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[idx]!;
}

/** Devuelve el texto localizado de una frase según el idioma activo. */
export function quoteText(q: MotivationalQuote, lang: "es" | "en"): string {
  return lang === "en" ? q.text_en : q.text_es;
}
