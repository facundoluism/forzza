-- =============================================================================
-- FORZZA — Seed: descripciones bilingues de exercise_library
-- HUMAN_REVIEW: traducciones autogeneradas, validar terminología fitness
-- antes de producción.
-- Idempotente: usa WHERE slug = '...' en cada UPDATE.
-- =============================================================================
-- Estrategia description_en:
--   La migración 20260616000002 ya realiza backfill de description → description_en
--   para ejercicios 1-110 (que tenían description en inglés). Por lo tanto, este
--   archivo SOLO actualiza description_en para ejercicios 111-234 (cuya description
--   original estaba en español y el backfill no sirve para ellos).
--   Los UPDATEs de description_en al final del archivo cubren exactamente esos casos.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- BLOQUE 1: description_es para ejercicios 1-110 (originalmente en inglés)
-- ---------------------------------------------------------------------------

UPDATE exercise_library SET description_es = 'Recostado en banco plano, sostenés las mancuernas a la altura del pecho con las palmas mirando hacia los pies. Empujás hacia arriba hasta extender los brazos y bajás con control.' WHERE slug = 'dumbbell-flat-bench-press';

UPDATE exercise_library SET description_es = 'Banco inclinado a 30-45°. Presionás las mancuernas hacia arriba desde el nivel del pecho. Trabaja el pectoral superior. Evitá abrir demasiado los codos.' WHERE slug = 'dumbbell-incline-bench-press';

UPDATE exercise_library SET description_es = 'Banco declinado a -15 o -30°. Presionás las mancuernas hacia arriba. Enfatiza las fibras del pectoral inferior.' WHERE slug = 'dumbbell-decline-bench-press';

UPDATE exercise_library SET description_es = 'Recostado en banco plano, sostenés las mancuernas sobre el pecho. Con los codos ligeramente flexionados (bloqueados), abrís los brazos hacia los lados hasta sentir el estiramiento en el pecho y luego los volvés al centro.' WHERE slug = 'dumbbell-flat-fly';

UPDATE exercise_library SET description_es = 'Igual que la apertura plana pero en banco inclinado a 30-45°. Mayor énfasis en las fibras superiores del pectoral.' WHERE slug = 'dumbbell-incline-fly';

UPDATE exercise_library SET description_es = 'Apertura en banco declinado que trabaja el pectoral inferior. Mantené una leve flexión de codos durante todo el arco del movimiento.' WHERE slug = 'dumbbell-decline-fly';

UPDATE exercise_library SET description_es = 'Recostado transversalmente sobre el banco, sujetás una mancuerna con ambas manos sobre el pecho. Bajás detrás de la cabeza en arco y volvés. Trabaja pecho y dorsales.' WHERE slug = 'dumbbell-pullover';

UPDATE exercise_library SET description_es = 'Sentado o de pie, presionás las mancuernas desde la altura de los hombros hacia arriba hasta extender los brazos. Movimiento completo de press de hombros.' WHERE slug = 'dumbbell-overhead-press';

UPDATE exercise_library SET description_es = 'Empezás con las palmas mirándote a la altura de los hombros y las rotás hacia adelante mientras empujás hacia arriba. Nombrado por Arnold Schwarzenegger. Activa las tres cabezas del deltoides.' WHERE slug = 'dumbbell-arnold-press';

UPDATE exercise_library SET description_es = 'De pie con las mancuernas a los costados, elevás los brazos lateralmente hasta la altura de los hombros con una leve flexión de codos. Bajás con control.' WHERE slug = 'dumbbell-lateral-raise';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas frente a los muslos. Elevás uno o ambos brazos hacia adelante hasta la altura de los hombros. Trabaja el deltoides anterior.' WHERE slug = 'dumbbell-front-raise';

UPDATE exercise_library SET description_es = 'Inclinado con el torso paralelo al suelo y los brazos colgando, elevás las mancuernas lateralmente con los codos ligeramente flexionados, apretando los deltoides posteriores y romboides en el punto más alto.' WHERE slug = 'dumbbell-rear-delt-fly';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas frente a los muslos y tirás los codos hacia arriba y afuera, llevando las mancuernas al nivel del mentón. Trabaja trapecios y deltoides mediales.' WHERE slug = 'dumbbell-upright-row';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas a los costados. Elevás los hombros en línea recta hacia las orejas, mantenés brevemente y bajás. Aísla el trapecio.' WHERE slug = 'dumbbell-shrug';

UPDATE exercise_library SET description_es = 'Inclinado con el torso a ~45°, remás ambas mancuernas hacia las caderas apretando los omóplatos. Ejercicio compuesto para la construcción de la espalda.' WHERE slug = 'dumbbell-bent-over-row';

UPDATE exercise_library SET description_es = 'Apoyás una rodilla y una mano en el banco para soporte. Remás la mancuerna hacia la cadera con el brazo de trabajo. Permite mayor carga y amplitud de movimiento.' WHERE slug = 'dumbbell-single-arm-row';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas frente a los muslos. Hacés una bisagra de cadera bajando el peso a lo largo de las piernas manteniendo la espalda plana. Sentís el estiramiento en los isquiotibiales y luego empujás las caderas hacia adelante.' WHERE slug = 'dumbbell-romanian-deadlift';

UPDATE exercise_library SET description_es = 'Mancuernas a los costados o frente a las piernas. Empujás el suelo, manteniendo la columna neutra desde el piso hasta pararte. Movimiento de cuerpo completo.' WHERE slug = 'dumbbell-deadlift';

UPDATE exercise_library SET description_es = 'Posición de plancha alta con las manos sobre las mancuernas. Remás una mancuerna hacia la cadera mientras te equilibrás con la otra. Requiere alta estabilidad de core.' WHERE slug = 'dumbbell-renegade-row';

UPDATE exercise_library SET description_es = 'Variante del pullover que enfatiza el trabajo del dorsal manteniendo los brazos más extendidos y concentrándote en el movimiento de jalón.' WHERE slug = 'dumbbell-pullover-back-focus';

UPDATE exercise_library SET description_es = 'De pie o sentado, sostenés las mancuernas con agarre en supinación. Curlás el peso hacia los hombros sin balancear el cuerpo. Ejercicio clásico para bíceps.' WHERE slug = 'dumbbell-bicep-curl';

UPDATE exercise_library SET description_es = 'Agarre neutro (palmas enfrentadas). Curlás las mancuernas hacia arriba. Enfatiza el braquial y el braquiorradial para mayor grosor del brazo.' WHERE slug = 'dumbbell-hammer-curl';

UPDATE exercise_library SET description_es = 'Sentado, apoyás la parte posterior del brazo contra la cara interna del muslo y curlás la mancuerna. Aísla completamente el pico del bíceps eliminando el impulso.' WHERE slug = 'dumbbell-concentration-curl';

UPDATE exercise_library SET description_es = 'Sentado en banco inclinado a 45-60° con los brazos colgando. Curlás hacia arriba desde una posición estirada, maximizando la activación de la cabeza larga.' WHERE slug = 'dumbbell-incline-curl';

UPDATE exercise_library SET description_es = 'Curlás con agarre supino, rotás a prono en el punto más alto y bajás con agarre prono. Entrena bíceps y braquiorradial de manera efectiva.' WHERE slug = 'dumbbell-zottman-curl';

UPDATE exercise_library SET description_es = 'Usás un banco Scott o banco inclinado como apoyo del brazo. Curlás desde la extensión completa hasta la contracción. Limita el trampeo y aísla el bíceps.' WHERE slug = 'dumbbell-preacher-curl';

UPDATE exercise_library SET description_es = 'Recostado en el banco con las mancuernas sobre el pecho. Bajás el peso hacia las sienes flexionando solo los codos. Presionás de vuelta arriba. Activa las tres cabezas del tríceps.' WHERE slug = 'dumbbell-skull-crusher';

UPDATE exercise_library SET description_es = 'Sostenés una mancuerna con ambas manos sobre la cabeza. Bajás detrás de la cabeza flexionando los codos y luego extendés hacia arriba. Maximiza el estiramiento de la cabeza larga del tríceps.' WHERE slug = 'dumbbell-overhead-tricep-extension';

UPDATE exercise_library SET description_es = 'Inclinado con las caderas, el brazo superior paralelo al suelo. Extendés el antebrazo hacia atrás hasta que el brazo quede recto. Enfocado en la contracción pico.' WHERE slug = 'dumbbell-tricep-kickback';

UPDATE exercise_library SET description_es = 'Press de banca plano con las mancuernas juntas (o cerca), codos pegados al cuerpo. Enfatiza los tríceps por encima del pectoral.' WHERE slug = 'dumbbell-close-grip-press';

UPDATE exercise_library SET description_es = 'Sostenés una mancuerna verticalmente frente al pecho. Hacés una sentadilla profunda con el torso erguido. Sentadilla amigable para principiantes con gran activación de cuádriceps y glúteos.' WHERE slug = 'dumbbell-goblet-squat';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas a los costados o a la altura de los hombros. Realizás una sentadilla estándar. Trabaja cuádriceps, glúteos, isquiotibiales y core.' WHERE slug = 'dumbbell-squat';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas a los costados, avanzás con un paso hasta llegar a la posición de estocada con ambas rodillas a 90°. Volvés al inicio. Movimiento unilateral de tren inferior.' WHERE slug = 'dumbbell-lunge';

UPDATE exercise_library SET description_es = 'Realizás estocadas alternadas avanzando por el gimnasio. Desafía el equilibrio y el sistema cardiovascular más que las estocadas en el lugar.' WHERE slug = 'dumbbell-walking-lunge';

UPDATE exercise_library SET description_es = 'Pie trasero elevado sobre el banco. Bajás la pierna delantera en posición de estocada profunda. Ejercicio altamente efectivo para cuádriceps y glúteos en una sola pierna.' WHERE slug = 'dumbbell-bulgarian-split-squat';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas, subís al banco o cajón con una pierna y empujás hacia arriba. Controlás la bajada. Activación unilateral de cuádriceps y glúteos.' WHERE slug = 'dumbbell-step-up';

UPDATE exercise_library SET description_es = 'Postura amplia con los pies apuntando hacia afuera. Sostenés una mancuerna entre las piernas y hacés una sentadilla profunda. Enfatiza los aductores y glúteos.' WHERE slug = 'dumbbell-sumo-squat';

UPDATE exercise_library SET description_es = 'Sostenés las mancuernas a los costados, te parás en el borde de un escalón. Subís en punta de pies, mantenés y bajás más allá de la posición neutra para un estiramiento completo.' WHERE slug = 'dumbbell-standing-calf-raise';

UPDATE exercise_library SET description_es = 'Hombros sobre el banco, mancuerna sobre las caderas. Empujás las caderas hacia arriba hasta la extensión completa, apretando los glúteos en el punto más alto. Potente activador de glúteos.' WHERE slug = 'dumbbell-hip-thrust';

UPDATE exercise_library SET description_es = 'Dás un paso hacia atrás para hacer la estocada. Reduce la tensión en la rodilla comparado con la estocada hacia adelante. Mayor activación de glúteos.' WHERE slug = 'dumbbell-reverse-lunge';

UPDATE exercise_library SET description_es = 'Sentado con rodillas flexionadas, inclinado hacia atrás ~45°. Sostenés la mancuerna con ambas manos y rotás el torso de lado a lado.' WHERE slug = 'dumbbell-russian-twist';

UPDATE exercise_library SET description_es = 'De pie sosteniendo una mancuerna en una mano. Te inclinás lateralmente hacia el peso y luego volvés con la contracción del oblicuo.' WHERE slug = 'dumbbell-side-bend';

UPDATE exercise_library SET description_es = 'Sostenés la mancuerna con ambas manos. Realizás un movimiento diagonal de hachazo de arriba hacia abajo (o de abajo hacia arriba). Potencia del core anti-rotacional.' WHERE slug = 'dumbbell-wood-chop';

UPDATE exercise_library SET description_es = 'Poleas en posición alta. Tirás las manijas hacia abajo y hacia adentro en un arco cruzado. Tensión constante sobre el pecho en todo el recorrido.' WHERE slug = 'cable-crossover-high-to-low';

UPDATE exercise_library SET description_es = 'Poleas en posición baja. Tirás las manijas hacia arriba y hacia adentro en arco. Trabaja la porción superior del pectoral con tensión constante, a diferencia de las aperturas con mancuernas.' WHERE slug = 'cable-chest-fly-low-pulley';

UPDATE exercise_library SET description_es = 'De pie entre las estaciones de cable o de espaldas a ellas. Presionás las manijas hacia adelante a la altura del pecho. Mayor amplitud de movimiento que el press con barra.' WHERE slug = 'cable-chest-press';

UPDATE exercise_library SET description_es = 'Polea en posición baja, inclinado hacia adelante o en banco inclinado. Presionás hacia arriba en ángulo inclinado activando el pectoral superior con tensión constante.' WHERE slug = 'cable-incline-press';

UPDATE exercise_library SET description_es = 'Agarre ancho en la barra, jalás hacia el pecho superior inclinándote levemente hacia atrás y apretando los dorsales. El ejercicio de dorsal más popular.' WHERE slug = 'lat-pulldown-wide-grip';

UPDATE exercise_library SET description_es = 'Usás una barra en V o manijas neutras. Los codos viajan cerca del cuerpo, permitiendo mayor amplitud de movimiento y participación de los bíceps.' WHERE slug = 'lat-pulldown-narrowneutral-grip';

UPDATE exercise_library SET description_es = 'Agarre en supinación (palmas hacia vos). Mayor reclutamiento de bíceps y una activación del dorsal levemente diferente comparada con el agarre prono.' WHERE slug = 'lat-pulldown-reverseunderhand-grip';

UPDATE exercise_library SET description_es = 'Sentado en la polea baja con los pies en los apoyos. Remás la manija hacia el abdomen apretando los omóplatos. Ejercicio compuesto para el grosor de la espalda.' WHERE slug = 'seated-cable-row';

UPDATE exercise_library SET description_es = 'De pie frente a la polea alta, brazos extendidos. Bajás la barra hasta las caderas en arco manteniendo los codos bloqueados. Aísla los dorsales sin involucrar los bíceps.' WHERE slug = 'cable-straight-arm-pulldown';

UPDATE exercise_library SET description_es = 'Accesorio de cuerda a la altura de los ojos. Tirás la cuerda hacia la cara abriéndola al final. Esencial para deltoides posteriores, manguito rotador y postura.' WHERE slug = 'cable-face-pull';

UPDATE exercise_library SET description_es = 'De pie con las manijas de la polea baja a los costados. Elevás los hombros en línea recta. La polea proporciona tensión constante a diferencia de las mancuernas.' WHERE slug = 'cable-shrug';

UPDATE exercise_library SET description_es = 'Polea baja con cuerda o manija. Inclinado hacia adelante, remás hacia el abdomen. Similar al remo en T pero usando la polea para tensión constante.' WHERE slug = 'cable-t-bar-row';

UPDATE exercise_library SET description_es = 'Polea baja con manija en D. Elevás el brazo lateralmente hasta la altura del hombro. Proporciona tensión constante vs. cero tensión en la parte inferior con mancuernas.' WHERE slug = 'cable-lateral-raise';

UPDATE exercise_library SET description_es = 'Polea baja, manija simple o doble. Elevás hacia adelante hasta la altura del hombro. Más tensión constante que la versión con mancuernas.' WHERE slug = 'cable-front-raise';

UPDATE exercise_library SET description_es = 'Poleas a la altura de los hombros o cables cruzados. Tirás las manijas hacia afuera, abriendo los brazos horizontalmente. Trabaja los deltoides posteriores.' WHERE slug = 'cable-rear-delt-fly';

UPDATE exercise_library SET description_es = 'Polea baja con cuerda o barra. Remás hasta el nivel del mentón manteniendo los codos altos. Trabaja trapecios y deltoides mediales con tensión constante de la polea.' WHERE slug = 'cable-upright-row';

UPDATE exercise_library SET description_es = 'Polea baja, barra recta. Curlás la barra hacia el pecho. Tensión constante en todo el recorrido, sin zona muerta como con las mancuernas.' WHERE slug = 'cable-bicep-curl-straight-bar';

UPDATE exercise_library SET description_es = 'Polea baja, accesorio de barra EZ. El agarre ergonómico reduce la tensión en las muñecas. Trabaja bíceps con participación del braquial.' WHERE slug = 'cable-bicep-curl-ez-bar';

UPDATE exercise_library SET description_es = 'Cuerda o manija neutra en polea baja. Curlás con agarre neutro. Trabaja el braquial y braquiorradial.' WHERE slug = 'cable-hammer-curl';

UPDATE exercise_library SET description_es = 'Ambas poleas en posición alta. Curlás desde una posición estirada con los brazos horizontales (como pose de doble bíceps). Maximiza el estiramiento.' WHERE slug = 'cable-overhead-bicep-curl';

UPDATE exercise_library SET description_es = 'Polea alta, accesorio de cuerda. Empujás hacia abajo y hacia afuera, extendiendo y separando la cuerda en la parte inferior. Activa las tres cabezas del tríceps.' WHERE slug = 'cable-tricep-pushdown-rope';

UPDATE exercise_library SET description_es = 'Polea alta, barra recta. Empujás hacia abajo hasta el nivel de las caderas manteniendo los codos pegados a los costados. Clásico constructor de masa para tríceps.' WHERE slug = 'cable-tricep-pushdown-straight-bar';

UPDATE exercise_library SET description_es = 'De espaldas a la polea baja. Sostenés la cuerda sobre la cabeza con los codos flexionados y extendés hacia arriba. Maximiza el estiramiento y crecimiento de la cabeza larga del tríceps.' WHERE slug = 'cable-overhead-tricep-extension';

UPDATE exercise_library SET description_es = 'Inclinado hacia adelante, polea en posición baja. Extendés el antebrazo hacia atrás manteniendo el brazo superior estático. Movimiento de tríceps enfocado en la contracción.' WHERE slug = 'cable-tricep-kickback';

UPDATE exercise_library SET description_es = 'Arrodillado frente a la polea alta con la cuerda. Crunchás el torso hacia abajo contrayendo los abdominales. Permite sobrecarga progresiva en los abdominales.' WHERE slug = 'cable-crunch';

UPDATE exercise_library SET description_es = 'Rotás y chocás de arriba hacia abajo (o de abajo hacia arriba). Patrón diagonal de rotación del core. Excelente para el entrenamiento funcional y deportivo.' WHERE slug = 'cable-wood-chop';

UPDATE exercise_library SET description_es = 'De lado a la polea. Extendés la manija en línea recta y mantenés. Ejercicio de estabilidad del core anti-rotacional. Ampliamente utilizado en rehabilitación.' WHERE slug = 'cable-pallof-press';

UPDATE exercise_library SET description_es = 'Enganchás la tobillera. Extendés la pierna hacia atrás apretando el glúteo en la extensión completa. Excelente movimiento de aislamiento de glúteos.' WHERE slug = 'cable-glute-kickback';

UPDATE exercise_library SET description_es = 'Tobillera en polea baja. Balanceás la pierna hacia afuera. Trabaja el glúteo medio y los abductores de cadera para la estabilidad de la cadera.' WHERE slug = 'cable-hip-abduction';

UPDATE exercise_library SET description_es = 'Tobillera en polea baja. Balanceás la pierna hacia adentro cruzando el cuerpo. Trabaja los aductores de la cara interna del muslo.' WHERE slug = 'cable-hip-adduction';

UPDATE exercise_library SET description_es = 'De espaldas a la polea baja con la cuerda entre las piernas. Bisagra de cadera y luego empujás las caderas hacia adelante. Construye la cadena posterior como el swing con kettlebell.' WHERE slug = 'cable-pull-through';

UPDATE exercise_library SET description_es = 'Sentado en la máquina, empujás las manijas hacia adelante hasta extender los brazos. Imita el movimiento del press de banca con un recorrido guiado y sin requisito de equilibrio.' WHERE slug = 'chest-press-machine';

UPDATE exercise_library SET description_es = 'Sentado con los brazos sobre los apoyos. Acercás los apoyos frente al pecho. Movimiento de apertura con arco guiado. Aísla los pectorales de manera segura.' WHERE slug = 'pec-deck-butterfly-machine';

UPDATE exercise_library SET description_es = 'Máquina de press angulada que trabaja el pectoral superior. Más seguro y controlado que el press inclinado con peso libre.' WHERE slug = 'incline-chest-press-machine';

UPDATE exercise_library SET description_es = 'Jalón en máquina selectorizada. Mismo movimiento que el jalón en polea pero con pila de pesas integrada y poleas fijas.' WHERE slug = 'lat-pulldown-machine';

UPDATE exercise_library SET description_es = 'Remo sentado con pecho apoyado o torso libre. Tirás las manijas hacia el torso. Plataforma estable para remar pesado con mínimo estrés en la zona lumbar.' WHERE slug = 'seated-row-machine';

UPDATE exercise_library SET description_es = 'De pie sobre la plataforma, agarrás las manijas y remás el peso hacia el pecho. Clásico constructor de masa para la espalda. También disponible en versión con peso libre.' WHERE slug = 't-bar-row-machine';

UPDATE exercise_library SET description_es = 'Anclás los pies, el torso cuelga hacia adelante. Extendés la espalda hacia arriba hasta la posición horizontal. Fortalece la zona lumbar y los glúteos.' WHERE slug = 'back-extension-machine';

UPDATE exercise_library SET description_es = 'Máquina de contrapeso para dominadas y jalones en supinación. Reduce la resistencia del peso corporal para principiantes. Progresás reduciendo la asistencia.' WHERE slug = 'assisted-pull-up-machine';

UPDATE exercise_library SET description_es = 'Press por encima de la cabeza sentado con recorrido guiado. Más seguro que el press de hombros con peso libre para principiantes. Trabaja todas las cabezas del deltoides.' WHERE slug = 'shoulder-press-machine';

UPDATE exercise_library SET description_es = 'Sentado con los brazos bajo los apoyos. Levantás los apoyos lateralmente hasta la altura de los hombros. Aísla el deltoides medial con un arco y resistencia consistentes.' WHERE slug = 'lateral-raise-machine';

UPDATE exercise_library SET description_es = 'Sentado frente al apoyo, agarrás las manijas y abrís los brazos hacia atrás. Diseñada específicamente para el desarrollo del deltoides posterior y los romboides.' WHERE slug = 'rear-delt-reverse-fly-machine';

UPDATE exercise_library SET description_es = 'El apoyo bloquea el codo. Curlás el brazo de la máquina hacia arriba. Previene el trampeo y maximiza el aislamiento del bíceps.' WHERE slug = 'preacher-curl-machine-bicep-machine';

UPDATE exercise_library SET description_es = 'Configuración de extensión por encima de la cabeza o hacia abajo. Extendés los brazos contra la resistencia. Aísla los tríceps sin necesidad de estabilización del hombro.' WHERE slug = 'tricep-extension-machine';

UPDATE exercise_library SET description_es = 'Reclinado en la plataforma a 45°. Empujás la plataforma con peso hacia arriba. Uno de los mejores constructores de masa para cuádriceps, isquiotibiales y glúteos.' WHERE slug = 'leg-press-machine-45';

UPDATE exercise_library SET description_es = 'Prensa de piernas horizontal sentada. Empujás la plataforma hacia adelante. Proporciona un excelente estímulo para el tren inferior con baja compresión de la columna.' WHERE slug = 'leg-press-machine-horizontalseated';

UPDATE exercise_library SET description_es = 'Espalda contra el apoyo angular, pies sobre la plataforma. Sentadilla hasta la profundidad. Énfasis en cuádriceps con reducción de la carga espinal vs. sentadilla con barra.' WHERE slug = 'hack-squat-machine';

UPDATE exercise_library SET description_es = 'Sentado con el tobillo bajo el apoyo. Extendés las rodillas hasta enderezar completamente las piernas. Aísla los cuádriceps. Usá un movimiento controlado para proteger las rodillas.' WHERE slug = 'leg-extension-machine';

UPDATE exercise_library SET description_es = 'Sentado con el tobillo sobre el apoyo. Flexionás las rodillas contra la resistencia. Investigaciones muestran mayor crecimiento de isquiotibiales vs. la versión acostada.' WHERE slug = 'seated-leg-curl-machine';

UPDATE exercise_library SET description_es = 'Acostado boca abajo, tobillos bajo el rodillo. Curlás los talones hacia los glúteos. Trabaja más el bíceps femoral (cara externa de los isquiotibiales) que la versión sentada.' WHERE slug = 'lying-leg-curl-machine';

UPDATE exercise_library SET description_es = 'Sentado con los apoyos en la parte externa de las rodillas. Presionás las piernas hacia afuera contra la resistencia. Fortalece el glúteo medio y los abductores de cadera.' WHERE slug = 'hip-abductor-machine';

UPDATE exercise_library SET description_es = 'Sentado con los apoyos en la parte interna de las rodillas. Presionás las piernas hacia adentro contra la resistencia. Trabaja los músculos aductores de la cara interna del muslo.' WHERE slug = 'hip-adductor-machine';

UPDATE exercise_library SET description_es = 'Hombros bajo los apoyos, puntas de los pies en el borde de la plataforma. Subís en punta de pies y bajás para el estiramiento completo. Máquina principal para pantorrillas.' WHERE slug = 'standing-calf-raise-machine';

UPDATE exercise_library SET description_es = 'Sentado con los apoyos sobre los muslos, puntas de los pies en la plataforma. Subís en punta de pies. Trabaja el sóleo (músculo profundo de la pantorrilla) más que la variante de pie.' WHERE slug = 'seated-calf-raise-machine';

UPDATE exercise_library SET description_es = 'Arrodillado en el GHD con los pies anclados. Bajás el torso hacia el suelo usando los isquiotibiales de manera excéntrica y luego volvés arriba. Ejercicio muy exigente para la cadena posterior.' WHERE slug = 'glute-ham-developer-ghd';

UPDATE exercise_library SET description_es = 'Barra a la altura de los hombros en el multipower. Sentadilla con el recorrido de barra guiado. Más estable que la sentadilla con barra libre; buena para el desarrollo de la técnica.' WHERE slug = 'smith-machine-squat';

UPDATE exercise_library SET description_es = 'Acostado en banco bajo la barra del multipower. Presionás hacia arriba con el recorrido guiado. Los ganchos de seguridad permiten entrenar solo sin asistente.' WHERE slug = 'smith-machine-bench-press';

UPDATE exercise_library SET description_es = 'Banco inclinado bajo el multipower. Trabaja el pectoral superior con la seguridad del recorrido guiado.' WHERE slug = 'smith-machine-incline-press';

UPDATE exercise_library SET description_es = 'Sentado o de pie, presionás la barra por encima de la cabeza en el multipower. Elimina el requisito de equilibrio del press de hombros.' WHERE slug = 'smith-machine-shoulder-press';

UPDATE exercise_library SET description_es = 'Inclinado con las caderas, remás la barra del multipower hacia el pecho/abdomen inferior. El recorrido guiado ayuda a mantener una técnica consistente.' WHERE slug = 'smith-machine-bent-over-row';

UPDATE exercise_library SET description_es = 'Barra sobre los hombros en el multipower. Avanzás a posición de estocada. La barra guiada elimina la preocupación por el equilibrio, permitiendo concentrarse en el trabajo de piernas.' WHERE slug = 'smith-machine-lunge';

UPDATE exercise_library SET description_es = 'Barra sobre los hombros, puntas de los pies en el borde de la plataforma. Elevación completa de pantorrillas con capacidad de carga pesada.' WHERE slug = 'smith-machine-calf-raise';

UPDATE exercise_library SET description_es = 'Hombros en banco, barra sobre las caderas en el multipower. Empujás las caderas hasta la extensión completa. Permite cargar los glúteos de manera pesada y segura.' WHERE slug = 'smith-machine-hip-thrust';

UPDATE exercise_library SET description_es = 'Sentado en la máquina, agarrás las manijas y crunchás hacia adelante contrayendo los abdominales. Permite sobrecarga progresiva para los abdominales.' WHERE slug = 'ab-crunch-machine';

UPDATE exercise_library SET description_es = 'Sentado, rotás el torso contra la resistencia. Aísla los oblicuos mediante movimiento rotacional en el plano transversal.' WHERE slug = 'rotary-torso-machine';

UPDATE exercise_library SET description_es = 'Caderas sobre el apoyo, pies anclados. Hacés una bisagra de cadera para bajar el torso y luego lo elevás hasta la posición horizontal. Fortalece la zona lumbar y los glúteos.' WHERE slug = 'roman-chair-back-extension';

UPDATE exercise_library SET description_es = 'Apoyado en los reposabrazos acolchados. Elevás las rodillas hacia el pecho (flexionadas) o las piernas extendidas (avanzado). Excelente movimiento para el abdomen inferior.' WHERE slug = 'captains-chair-leg-raise';

-- ---------------------------------------------------------------------------
-- BLOQUE 2: description_es para ejercicios 111-234 (originalmente en español,
-- reescritos de manera técnica y clara en español rioplatense)
-- ---------------------------------------------------------------------------

UPDATE exercise_library SET description_es = 'Acostado en banco plano, colocás las manos con una separación de unos 20 cm entre sí (agarre cerrado). El trabajo del pectoral cede protagonismo al tríceps. No se recomienda si tenés molestias en las muñecas.' WHERE slug = 'bench-press-barbell';

UPDATE exercise_library SET description_es = 'Banco inclinado con mancuernas. Te recostás y realizás el movimiento igual que con barra, con la ventaja de que podés acercar las mancuernas al final del movimiento para mayor contracción del pectoral esternal.' WHERE slug = 'incline-bench-press';

UPDATE exercise_library SET description_es = 'Banco declinado con mancuernas. Te recostás mientras sujetás las mancuernas con los brazos flexionados. Permite mayor recorrido que con barra. Usá cargas moderadas y solicitá asistencia para las series pesadas.' WHERE slug = 'decline-bench-press';

UPDATE exercise_library SET description_es = 'Similar al press de banca básico pero con mancuernas. Podés girar los pulgares hacia afuera al final del movimiento para mayor contracción del pectoral esternal. El giro generalmente se produce en el antebrazo.' WHERE slug = 'dumbbell-press';

UPDATE exercise_library SET description_es = 'Apertura con mancuernas en banco inclinado a 30-45°. Tumbado en el banco, abrís los brazos con los codos ligeramente flexionados y los acercás describiendo un arco. Las fibras superiores del pectoral son las más demandadas.' WHERE slug = 'dumbbell-fly';

UPDATE exercise_library SET description_es = 'Igual que las flexiones estándar pero los pies permanecen en el suelo. El movimiento es el mismo que en la versión avanzada, adaptado para practicantes con menor nivel de fuerza.' WHERE slug = 'push-ups';

UPDATE exercise_library SET description_es = 'Fondos en paralelas con el mismo movimiento y premisas que el ejercicio básico. La única diferencia es el peso utilizado según el nivel y los objetivos del practicante.' WHERE slug = 'dips';

UPDATE exercise_library SET description_es = 'Sujetás una barra corta en pronación (palmas hacia los pies) y realizás el mismo movimiento que en el pullover con mancuerna. El agarre en barra puede resultar más cómodo y estable para algunos.' WHERE slug = 'dumbbell-pullover-2';

UPDATE exercise_library SET description_es = 'Tumbado en banco plano, sujetás las mancuernas verticalmente con las palmas enfrentadas. Con los codos ligeramente flexionados, describís un arco amplio hasta sentir el estiramiento del pectoral y volvés a la posición inicial.' WHERE slug = 'incline-dumbbell-fly';

UPDATE exercise_library SET description_es = 'De pie, sujetás una barra con un disco en el extremo en pronación. Realizás el movimiento de pullover de pie para trabajar el pectoral y los dorsales con una mecánica diferente a la versión en banco.' WHERE slug = 'close-grip-barbell-bench-press';

UPDATE exercise_library SET description_es = 'En posición similar a los fondos con mancuernas, pero con las mancuernas orientadas de manera diferente. Se combina el movimiento de pullover con el apoyo en el suelo, aportando mayor estabilidad.' WHERE slug = 'floor-dumbbell-pullover';

UPDATE exercise_library SET description_es = 'El movimiento es el mismo que el press de pecho pero la inclinación o el diseño de la máquina desplaza el trabajo hacia la zona alta (clavicular) o baja (esternal) del pectoral. Seguro y controlado.' WHERE slug = 'machine-chest-press';

UPDATE exercise_library SET description_es = 'Press de banca en multipower. El movimiento es idéntico al ejercicio básico pero la inclinación o configuración de la máquina y la guía de la barra permiten variar el estímulo hacia diferentes zonas del pectoral.' WHERE slug = 'smith-machine-bench-press-2';

UPDATE exercise_library SET description_es = 'Cruce de poleas realizado en la misma postura que las aperturas estándar. La tensión constante de la polea convierte al cruce en un ejercicio efectivo para la porción interna y externa del pectoral.' WHERE slug = 'cable-crossover';

UPDATE exercise_library SET description_es = 'Apertura en polea baja realizada esencialmente como el ejercicio básico pero en banco inclinado a 30-45°. La polea baja dirige la tensión hacia la porción superior del pectoral.' WHERE slug = 'low-cable-chest-fly';

UPDATE exercise_library SET description_es = 'Igual que el ejercicio básico de aperturas ya que la extensión de los codos no afecta al pectoral. La máquina simula el movimiento de apertura con un arco guiado y resistencia constante.' WHERE slug = 'pec-deck-machine';

UPDATE exercise_library SET description_es = 'Tumbado en banco con la cabeza en el borde, sujetás la barra o cuerda de la polea baja. Realizás el movimiento de pullover con asistencia de la polea, lo que permite un mayor control de la resistencia.' WHERE slug = 'assisted-dips-cable';

UPDATE exercise_library SET description_es = 'Ejercicio de espalda: dominadas y jalones en supinación (chin-ups). Jalás el peso de tu cuerpo desde la barra colgado hacia arriba hasta que el mentón supera la barra. Trabaja dorsales y bíceps.' WHERE slug = 'pull-ups-chin-ups';

UPDATE exercise_library SET description_es = 'Remo con barra. Inclinado con el torso a unos 45°, remás la barra hacia el abdomen inferior apretando los omóplatos. Similar al remo con mancuernas pero con mayor capacidad de carga.' WHERE slug = 'barbell-bent-over-row';

UPDATE exercise_library SET description_es = 'Remo en T. Prácticamente igual que el remo en punta pero con agarre más ancho, lo que desplaza parte del trabajo hacia la zona media y superior de la espalda. Excelente ejercicio de grosor.' WHERE slug = 't-bar-row';

UPDATE exercise_library SET description_es = 'Remo con mancuerna a una mano. A diferencia del ejercicio base, llevás el codo más separado del cuerpo, lo que varía levemente el énfasis muscular hacia la zona superior de la espalda.' WHERE slug = 'dumbbell-single-arm-row-2';

UPDATE exercise_library SET description_es = 'Pullover con dos mancuernas de menor peso realizadas de forma alternativa. Permite mayor amplitud de movimiento y entrenamiento unilateral del dorsal y pectoral.' WHERE slug = 'dumbbell-pullover-3';

UPDATE exercise_library SET description_es = 'De pie de lado a una barra vertical firme, con los pies cercanos y el cuerpo inclinado. Realizás un movimiento de remo invertido usando el peso de tu propio cuerpo. Excelente para el trabajo de espalda sin equipamiento.' WHERE slug = 'inverted-t-bar-row';

UPDATE exercise_library SET description_es = 'Jalón en máquina de dorsales. Si la máquina tiene palancas independientes, podés realizar el ejercicio a una mano. La guía de la máquina aporta estabilidad y permite concentrarse en la contracción del dorsal.' WHERE slug = 'máquina-de-dorsal-jalón-en-máquina';

UPDATE exercise_library SET description_es = 'Jalón en polea con agarre estrecho, palmas enfrentadas o hacia vos. El cuerpo se coloca más vertical y se adelanta la cabeza de la polea, logrando un recorrido mayor y mayor activación del dorsal inferior.' WHERE slug = 'lat-pulldown';

UPDATE exercise_library SET description_es = 'Remo en polea al estilo Gironda. Se tira desde la polea alta con menos peso pero mayor recorrido y control. Está a mitad de camino entre el jalón y el remo tradicional en cuanto a estímulo muscular.' WHERE slug = 'remo-en-polea-gironda';

UPDATE exercise_library SET description_es = 'Remo en máquina con agarre ancho en pronación y codos separados del cuerpo. Se realiza de forma idéntica al ejercicio básico con la ventaja de la guía mecánica y la estabilidad.' WHERE slug = 'machine-row';

UPDATE exercise_library SET description_es = 'Remo en polea baja de pie. Si la polea está en posición alta, el cuerpo debe permanecer más erguido. Se obtiene un estímulo a mitad de camino entre el jalón y el remo inclinado.' WHERE slug = 'standing-low-cable-row';

UPDATE exercise_library SET description_es = 'Jalón de brazos extendidos en polea. Agarre neutro o en ligera pronación con una cuerda. La variante con cuerda favorece una mayor amplitud de movimiento al final.' WHERE slug = 'cable-straight-arm-pulldown-2';

UPDATE exercise_library SET description_es = 'Asistida en máquina con agarres neutros (ni en pronación ni en supinación). El agarre neutro reduce la tensión en las muñecas y varía levemente el estímulo en dorsales y bíceps.' WHERE slug = 'assisted-pull-up-machine-2';

UPDATE exercise_library SET description_es = 'Jalón a una mano en polea, sentado en el suelo o de rodillas. Esta posición logra en general un mayor recorrido que el jalón estándar en máquina, maximizando el estiramiento del dorsal.' WHERE slug = 'single-arm-cable-pulldown';

UPDATE exercise_library SET description_es = 'De pie entre dos poleas con las piernas semiflexionadas. Jalón con agarre neutro que combina el trabajo de dorsales con mayor participación del pectoral y el deltoides anterior.' WHERE slug = 'neutral-grip-lat-pulldown';

UPDATE exercise_library SET description_es = 'Remo en multipower. Se ejecuta igual que con peso libre: de pie con el tronco recto e inclinado y las rodillas semiflexionadas. La guía de la barra aporta estabilidad en el movimiento.' WHERE slug = 'smith-machine-row';

UPDATE exercise_library SET description_es = 'Press militar con barra detrás de la nuca. El banco está más vertical y se flexiona levemente la cabeza para bajar la barra. Requiere buena movilidad de hombros y no se recomienda ante dolencias cervicales.' WHERE slug = 'military-press-barbell';

UPDATE exercise_library SET description_es = 'Press de hombros con mancuernas de pie. Permite añadir un leve impulso de piernas en las repeticiones de mayor intensidad. Requiere mayor estabilización del core que la versión sentada.' WHERE slug = 'dumbbell-press-2';

UPDATE exercise_library SET description_es = 'Press Arnold en banco inclinado a 45-60°. Prácticamente igual que el ejercicio base pero el banco inclinado aumenta la estabilidad y reduce la carga en la columna lumbar.' WHERE slug = 'dumbbell-arnold-press-2';

UPDATE exercise_library SET description_es = 'Elevaciones laterales con mancuernas. Las manos se elevan con los pulgares apuntando levemente hacia abajo (rotación interna), lo que algunos autores proponen para aislar más fácilmente el deltoides medial.' WHERE slug = 'dumbbell-lateral-raise-2';

UPDATE exercise_library SET description_es = 'Elevaciones laterales a una mano, apoyado en banco inclinado a 45-60°. Permite mayor amplitud de movimiento y mejor aislamiento del deltoides medial al eliminar la compensación contralateral.' WHERE slug = 'elevaciones-laterales-a-una-mano';

UPDATE exercise_library SET description_es = 'Elevación frontal con mancuernas. Genera mayor tensión en los lumbares y paravertebrales que la versión con barra. Se realizan alternadas o simultáneas a la altura de los hombros.' WHERE slug = 'dumbbell-front-raise-2';

UPDATE exercise_library SET description_es = 'Pájaros (elevación posterior) sentado en el borde de un banco o en decúbito prono. Excelente variante para aislar los deltoides posteriores con la espalda apoyada, eliminando la compensación lumbar.' WHERE slug = 'bent-over-rear-delt-fly';

UPDATE exercise_library SET description_es = 'Elevación posterior en decúbito lateral. El codo se mueve más cerca del cuerpo que en la versión inclinada. Permite aislar el deltoides posterior con mayor control y menos carga lumbar.' WHERE slug = 'side-lying-rear-delt-raise';

UPDATE exercise_library SET description_es = 'Remo al cuello con barra. El movimiento es igual al ejercicio básico hasta llegar al cuello, posición desde la que se puede variar la extensión del remo para trabajar el trapecio o el deltoides medial.' WHERE slug = 'barbell-upright-row';

UPDATE exercise_library SET description_es = 'Encogimientos de hombros para trapecios. De pie o sentado, elevás los hombros hacia las orejas con la carga al costado del cuerpo. Movimiento de aislamiento para el trapecio superior.' WHERE slug = 'shoulder-shrug';

UPDATE exercise_library SET description_es = 'Press de hombros unilateral con mancuerna, en decúbito lateral sobre banco o colchoneta. Agarre tipo martillo (semipronación). Trabaja el deltoides de manera unilateral con mayor demanda de estabilización.' WHERE slug = 'unilateral-dumbbell-shoulder-press';

UPDATE exercise_library SET description_es = 'Encogimientos con mancuernas en banco inclinado a 45-60°. Sentado con las mancuernas en agarre neutro a los lados. El banco inclinado modifica el ángulo de trabajo del trapecio superior.' WHERE slug = 'dumbbell-shrug-2';

UPDATE exercise_library SET description_es = 'Rotación externa de hombro con mancuerna. Posición similar al remo con mancuerna, apoyados en banco horizontal. Trabaja los rotadores externos del manguito (infraespinoso y redondo menor).' WHERE slug = 'dumbbell-external-rotation';

UPDATE exercise_library SET description_es = 'Rotación de hombro en decúbito prono sobre banco plano, pecho apoyado en el borde. Trabaja los rotadores externos del hombro en una posición estable que minimiza las compensaciones.' WHERE slug = 'floor-shoulder-rotation';

UPDATE exercise_library SET description_es = 'Elevación lateral con banda elástica en decúbito supino sobre banco plano, hombros en el borde. La banda cambia el vector de resistencia trabajando el deltoides medial en un plano diferente.' WHERE slug = 'resistance-band-lateral-raise';

UPDATE exercise_library SET description_es = 'Press de hombros en máquina, misma posición que el ejercicio básico o con banco más inclinado. El movimiento guiado aporta seguridad y permite concentrarse en la contracción muscular.' WHERE slug = 'machine-shoulder-press';

UPDATE exercise_library SET description_es = 'Press militar en multipower bajando la barra detrás de la nuca. Réplica casi exacta al press militar con la única variante del recorrido posterior. Requiere buena movilidad cervical y de hombros.' WHERE slug = 'smith-machine-shoulder-press-2';

UPDATE exercise_library SET description_es = 'Elevación lateral en máquina a un solo brazo. Mismo movimiento que la versión bilateral pero realizando toda la serie con un solo brazo. Permite mayor concentración y corrección del desequilibrio entre lados.' WHERE slug = 'machine-lateral-raise';

UPDATE exercise_library SET description_es = 'Elevación lateral con polea cruzada (la polea pasa por detrás del cuerpo). La principal diferencia con la versión estándar es el vector de resistencia, que trabaja el deltoides medial desde un ángulo diferente.' WHERE slug = 'cable-lateral-raise-single';

UPDATE exercise_library SET description_es = 'Elevación frontal con polea usando cuerda o barra con ambas manos. La polea proporciona tensión constante durante todo el recorrido, a diferencia de la versión con mancuernas donde la tensión varía.' WHERE slug = 'cable-front-raise-2';

UPDATE exercise_library SET description_es = 'Pájaro a una mano en polea. La posición es similar al equivalente con mancuerna. Se trabaja el deltoides posterior y los romboides con la tensión constante de la polea.' WHERE slug = 'cable-rear-delt-fly-single';

UPDATE exercise_library SET description_es = 'Pájaro en máquina contractora para pectoral (usada en sentido inverso). El cuerpo se coloca mirando el apoyo y abre los brazos hacia atrás, trabajando el deltoides posterior con el arco guiado de la máquina.' WHERE slug = 'rear-delt-machine-fly';

UPDATE exercise_library SET description_es = 'Remo al cuello en polea, tumbado. Mismo movimiento que de pie pero en la polea de remo acostado. El ángulo del cuerpo permite un estímulo diferente en el trapecio y deltoides medial.' WHERE slug = 'cable-upright-row-2';

UPDATE exercise_library SET description_es = 'Encogimientos de hombros en multipower. La posición y el movimiento son similares al remo al cuello pero con el énfasis en la elevación del trapecio. La barra guiada facilita la sobrecarga.' WHERE slug = 'shoulder-shrug-2';

UPDATE exercise_library SET description_es = 'Rotación interna de hombro en decúbito lateral sobre banco. Agarre tipo martillo (semipronación). Trabaja los rotadores internos del hombro (subescapular), importante para el equilibrio del manguito rotador.' WHERE slug = 'cable-internal-rotation';

UPDATE exercise_library SET description_es = 'Curl de bíceps con barra. El agarre resulta más racional anatómicamente con barra EZ. La serie de 21 repeticiones (siete parciales abajo, siete parciales arriba, siete completas) es una variante popular.' WHERE slug = 'barbell-bicep-curl';

UPDATE exercise_library SET description_es = 'Curl con supinación progresiva con mancuernas. Excelente ejercicio similar al curl martillo pero con rotación del antebrazo de neutro a supino durante el recorrido para maximizar la contracción del bíceps.' WHERE slug = 'dumbbell-supination-curl';

UPDATE exercise_library SET description_es = 'Curl en banco Scott a una mano con mancuerna, alternando brazos. La mano libre sirve de apoyo en el banco. El apoyo bilateral reduce la capacidad de generar impulso y maximiza el aislamiento.' WHERE slug = 'preacher-curl-scott-bench';

UPDATE exercise_library SET description_es = 'Curl de concentración de pie, cadera flexionada ~90° con una mano apoyada en soporte. Igual que la versión sentada pero de pie, con la cadera casi paralela al suelo para máximo aislamiento del pico del bíceps.' WHERE slug = 'concentration-curl';

UPDATE exercise_library SET description_es = 'Curl con mancuernas ligeras en decúbito supino. Se dejan bajar las mancuernas hasta donde el estiramiento sea cómodo y se curla hacia arriba. Enfatiza el estiramiento del bíceps en la fase excéntrica.' WHERE slug = 'ez-bar-curl';

UPDATE exercise_library SET description_es = 'Curl martillo de pie con agarre neutro. Igual que el curl martillo estándar pero en la misma postura erguida. Trabaja el braquial y el braquiorradial con énfasis en el grosor del brazo.' WHERE slug = 'incline-dumbbell-curl';

UPDATE exercise_library SET description_es = 'Curl en máquina con agarre neutro (si el diseño lo permite). El agarre neutro desplaza parte del trabajo al braquial y braquiorradial, complementando el estímulo del bíceps.' WHERE slug = 'bicep-curl-machine';

UPDATE exercise_library SET description_es = 'Curl de bíceps en polea con cuerda, de espaldas a la polea y con un solo agarre. Las manos se colocan en posición neutra tipo martillo. La tensión constante de la polea mejora el estímulo en todo el recorrido.' WHERE slug = 'cable-bicep-curl';

UPDATE exercise_library SET description_es = 'Curl de bíceps en polea alta con una o dos manos desde posición elevada. Variante poco convencional que maximiza el estiramiento del bíceps al partir desde una posición con el brazo horizontal.' WHERE slug = 'high-cable-curl-single-arm';

UPDATE exercise_library SET description_es = 'Press francés (skull crusher) con barra. El agarre en barra EZ proporciona una posición más cómoda y neutra para las muñecas. Trabajás el tríceps con el codo apuntando al techo.' WHERE slug = 'french-press-skull-crusher-bar';

UPDATE exercise_library SET description_es = 'Press francés con una sola mancuerna. Sujetás la mancuerna en pronación y con la otra mano fijás el brazo sujetándolo por el bíceps. Dejás caer la mancuerna hacia atrás y extendés el codo.' WHERE slug = 'french-press-skull-crusher-dumbbell';

UPDATE exercise_library SET description_es = 'Fondos en banco (dipping). Apoyás las manos en pronación en el borde del banco con las piernas extendidas. Trabajás el tríceps (y algo el pectoral inferior) con el propio peso del cuerpo.' WHERE slug = 'dips-2';

UPDATE exercise_library SET description_es = 'Flexiones con las manos superpuestas (una sobre la otra). El trabajo solicitado al tríceps es mayor que en las flexiones con manos paralelas, aumentando la dificultad del ejercicio.' WHERE slug = 'push-ups-2';

UPDATE exercise_library SET description_es = 'Patada de tríceps (kickback) con agarre en pronación, codos por encima del torso. Se desarrolla de manera similar a la versión estándar pero el ángulo del brazo varía el énfasis muscular.' WHERE slug = 'tricep-kickback';

UPDATE exercise_library SET description_es = 'Press de banca con agarre cerrado. Igual posición que el press de banca estándar pero los codos se separan del tronco al bajar y el trabajo recae principalmente en el tríceps.' WHERE slug = 'close-grip-bench-press';

UPDATE exercise_library SET description_es = 'Extensión de tríceps sobre la cabeza con barra corta en pronación a la distancia de los hombros. Algunos estudios sugieren mayor activación de la cabeza larga del tríceps en la extensión overhead.' WHERE slug = 'overhead-tricep-extension-dumbbell';

UPDATE exercise_library SET description_es = 'Empuje de tríceps en polea alta con barra, a una mano o con agarre estándar. Movimiento idéntico al ejercicio básico pero con variación del accesorio para adaptar la comodidad de agarre.' WHERE slug = 'cable-tricep-pushdown-bar';

UPDATE exercise_library SET description_es = 'Empuje de tríceps en polea con cuerda de espaldas a la polea alta. Postura similar a la del empuje estándar pero de espaldas, lo que cambia el ángulo de tensión y trabaja la cabeza larga del tríceps.' WHERE slug = 'cable-tricep-pushdown-rope-2';

UPDATE exercise_library SET description_es = 'Extensión de tríceps en máquina Scott para bíceps. Los brazos se apoyan en el acolchado con los codos en el borde, realizando la extensión desde la flexión completa hasta la extensión total del codo.' WHERE slug = 'tricep-extension-machine-2';

UPDATE exercise_library SET description_es = 'Press de tríceps en máquina de press horizontal. Sentado en la máquina de press pecho-tríceps en configuración para tríceps, realizás el empuje con los codos pegados al cuerpo.' WHERE slug = 'tricep-press-machine';

UPDATE exercise_library SET description_es = 'Extensión de tríceps en polea alta de pie, de espaldas a la polea. Sujetás el agarre en pronación o supinación detrás de la nuca y extendés los codos hacia arriba. Trabaja especialmente la cabeza larga.' WHERE slug = 'overhead-cable-tricep-extension';

UPDATE exercise_library SET description_es = 'Flexión de muñeca con barra. Sentado con los antebrazos horizontales apoyados en los muslos, realizás la flexión palmar de la muñeca. Trabaja los flexores del antebrazo.' WHERE slug = 'wrist-curl-barbell';

UPDATE exercise_library SET description_es = 'Extensión de muñeca (flexión dorsal) con mancuernas. Igual que el curl de muñeca con barra pero en este caso las dos manos van independientes sujetando mancuernas en pronación.' WHERE slug = 'reverse-wrist-curl';

UPDATE exercise_library SET description_es = 'Curl prono o en agarre neutro. El ejercicio de bíceps con la mano en posición neutra o prona trabaja el braquial y braquiorradial. Puede considerarse a mitad de camino entre el curl de bíceps y el de antebrazo.' WHERE slug = 'reverse-curl-pronated';

UPDATE exercise_library SET description_es = 'Rodillo de muñeca con cuerda. Misma posición que el curl de muñeca pero realizás extensiones (flexiones dorsales) para subir el peso enrollando la cuerda. Trabaja los extensores del antebrazo.' WHERE slug = 'rope-wrist-roll';

UPDATE exercise_library SET description_es = 'Flexión radial de muñeca. Tumbado de lado, con el brazo flexionado a 90° y el antebrazo horizontal, realizás una flexión lateral de la muñeca hacia el radio. Trabaja los músculos radiales del antebrazo.' WHERE slug = 'wrist-radial-flexion';

UPDATE exercise_library SET description_es = 'Sentadilla con barra. Las piernas se colocan y abren más a medida que se baja, con los pies apuntando hacia afuera según la anatomía. Los antebrazos pueden ir cruzados o en agarre estándar sobre la barra.' WHERE slug = 'barbell-squat';

UPDATE exercise_library SET description_es = 'Subida al banco o cajón (step-up). Igual que el ejercicio anterior pero una vez arriba no se cambia de pie, sino que se mantiene la misma pierna arriba durante toda la serie antes de cambiar.' WHERE slug = 'step-up';

UPDATE exercise_library SET description_es = 'Estocadas (lunges). Similar al step-up pero ahora la pierna que trabaja se queda en el sitio y la otra se desplaza hacia atrás. Al llevar el peso del cuerpo hacia adelante se incrementa la demanda sobre el cuádriceps.' WHERE slug = 'lunges';

UPDATE exercise_library SET description_es = 'Peso muerto con mancuernas (una o dos). El movimiento es similar al básico con barra, con la diferencia de que las mancuernas van en posición neutra (palmas enfrentadas) lo que puede resultar más cómodo.' WHERE slug = 'deadlift';

UPDATE exercise_library SET description_es = 'Elevación de talones de pie (gemelos). Ejercicio clásico culturista: de pie sobre el borde de un escalón o plataforma, subís y bajás en punta de pies. Opción intermedia entre la versión a dos pies y la unilateral.' WHERE slug = 'standing-calf-raise';

UPDATE exercise_library SET description_es = 'Elevación de talones sentado con mancuernas. Igual que con barra pero ahora sostenés las mancuernas y apoyás el disco plano sobre los muslos. Trabaja el sóleo de manera similar a la máquina de gemelos sentado.' WHERE slug = 'seated-calf-raise-bar';

UPDATE exercise_library SET description_es = 'Patada de glúteos en decúbito prono sobre banco, abrazado al banco con las piernas fuera y dobladas. Elevás una pierna extendida contrayendo el glúteo en el punto más alto. Aislamiento de glúteos.' WHERE slug = 'glute-kickback';

UPDATE exercise_library SET description_es = 'Abducción de cadera de pie o tumbado de lado. Se llevan las piernas en abducción con cuidado de no inclinar el torso. Trabaja el glúteo medio y los abductores de cadera.' WHERE slug = 'side-leg-raise';

UPDATE exercise_library SET description_es = 'Aducción de cadera de pie (o tumbado de lado). La pierna contraria (superior) apoya la planta del pie para estabilizar. Se aduce la pierna inferior cruzándola por delante de la otra.' WHERE slug = 'standing-hip-adduction';

UPDATE exercise_library SET description_es = 'Extensión de glúteos en polea de pie. Sentado con las rodillas flexionadas y los talones sobre un escalón bajo, sostenés un disco o lastre similar. Extensión de cadera trabajando el glúteo mayor.' WHERE slug = 'standing-cable-glute-extension';

UPDATE exercise_library SET description_es = 'Sentadilla en multipower con los pies más adelantados. Igual que en la máquina, pero colocando la barra como en la sentadilla convencional. El multipower guía el movimiento reduciendo la demanda de equilibrio.' WHERE slug = 'smith-machine-squat-2';

UPDATE exercise_library SET description_es = 'Prensa de piernas. Los pies se colocan en la parte alta de la plataforma para mayor activación de los isquiotibiales y glúteos. Variante de la posición estándar de la prensa.' WHERE slug = 'leg-press-machine';

UPDATE exercise_library SET description_es = 'Extensión de piernas en máquina. Cuando la rodilla está flexionada puede realizarse una leve rotación del pie, aunque esta rotación se produce principalmente en la cadera y no altera significativamente el estímulo del cuádriceps.' WHERE slug = 'leg-extension-machine-2';

UPDATE exercise_library SET description_es = 'Curl de piernas acostado boca abajo. Se pueden apuntar las puntas de los pies hacia adentro o apoyar lateralmente el muslo. A la inversa que el anterior: la versión con pies en punta hacia afuera trabaja más la cabeza corta del bíceps femoral.' WHERE slug = 'lying-leg-curl-machine-2';

UPDATE exercise_library SET description_es = 'Elevación de talones de pie en máquina con rotación de la pierna. Con una rotación medial (pies hacia adentro) se enfatizan las fibras externas del sóleo; con rotación lateral (pies hacia afuera), las fibras internas del gastrocnemio.' WHERE slug = 'standing-calf-raise-machine-2';

UPDATE exercise_library SET description_es = 'Press de pantorrillas en la prensa horizontal de placas. Realizás el mismo movimiento de elevación de talones pero colocado en la prensa horizontal, lo que aporta mayor comodidad en la carga y el recorrido.' WHERE slug = 'calf-press-on-leg-press';

UPDATE exercise_library SET description_es = 'Elevación de talones sentado en máquina con otro diseño: ahora son las puntas de los pies las que se apoyan en la plataforma y la resistencia recae sobre los muslos con un sistema diferente al anterior.' WHERE slug = 'seated-calf-raise-machine-2';

UPDATE exercise_library SET description_es = 'Aducción de cadera en máquina o de pie en polea baja. De pie, lateralmente a la polea baja, sujetás el aparato y adducís la pierna cruzándola por delante. Trabaja los aductores de la cara interna del muslo.' WHERE slug = 'hip-adductor-machine-2';

UPDATE exercise_library SET description_es = 'Abducción de cadera de pie en polea baja. De pie lateralmente a la polea baja, sujetás el aparato y abducís la pierna hacia afuera. Trabaja el glúteo medio y los abductores de cadera.' WHERE slug = 'hip-abductor-machine-2';

UPDATE exercise_library SET description_es = 'Patada de glúteos en polea baja de pie. Con el cuerpo ligeramente flexionado hacia adelante y las manos en la máquina, extendés la pierna con la tobillera hacia atrás contrayendo el glúteo.' WHERE slug = 'cable-glute-kickback-2';

UPDATE exercise_library SET description_es = 'Flexión de cadera en polea. Posición similar a la patada de glúteos pero con la polea traccionando desde el frente. Se flexiona la cadera elevando la rodilla, trabajando el psoas y los flexores de cadera.' WHERE slug = 'cable-hip-flexion';

UPDATE exercise_library SET description_es = 'Peso muerto rumano en multipower. De pie con la barra sobre el trapecio y los deltoides, realizás la bisagra de cadera bajando la barra a lo largo de las piernas. Similar a la sentadilla en multipower pero con énfasis en los isquiotibiales.' WHERE slug = 'smith-machine-romanian-deadlift';

UPDATE exercise_library SET description_es = 'Hack squat en polea. En decúbito prono sobre un banco o en el suelo si la polea está baja, realizás el movimiento de extensión de cadera y rodilla similar al hack squat pero con el vector de resistencia de la polea.' WHERE slug = 'cable-hack-squat';

UPDATE exercise_library SET description_es = 'Curl de isquiotibiales en polea de pie. Igual que el anterior pero la tensión de la polea viene desde el lado contrario del cuerpo (en abducción), variando el ángulo de trabajo de los isquiotibiales.' WHERE slug = 'standing-cable-hamstring-curl';

UPDATE exercise_library SET description_es = 'Extensión de cadera sentado en polea lateral. Sentado de lado a la polea con la cuerda sujeta al pie más alejado, realizás una rotación lateral de cadera. Trabaja el glúteo mayor y los rotadores externos de la cadera.' WHERE slug = 'cable-hip-extension';

UPDATE exercise_library SET description_es = 'Crunch abdominal en el suelo. Similar al crunch básico pero se cruza una pierna sobre la otra (como referencia) y se extiende el brazo del lado opuesto para mayor implicación del oblicuo.' WHERE slug = 'crunch-floor';

UPDATE exercise_library SET description_es = 'Sit-up declinado. En banco declinado, subís el torso contrayendo los abdominales. En esta variante se sostiene un lastre en el pecho con los brazos cruzados para aumentar la resistencia.' WHERE slug = 'decline-sit-up';

UPDATE exercise_library SET description_es = 'Elevación de piernas acostado. Misma posición que el crunch pero sostenés un soporte por encima de la cabeza. Elevás las piernas extendidas o flexionadas hasta la vertical, trabajando el recto abdominal inferior.' WHERE slug = 'lying-leg-raise';

UPDATE exercise_library SET description_es = 'Elevación de piernas colgado. Colgado de una barra con agarre en pronación, elevás las rodillas o las piernas extendidas. Mayor dificultad que la versión apoyada en banco por la demanda de estabilización de la cintura escapular.' WHERE slug = 'hanging-leg-raise';

UPDATE exercise_library SET description_es = 'Variaciones de crunch en el suelo. Todo igual que en el ejercicio básico pero las manos permanecen cruzadas en el pecho (más fácil) o extendidas frente al cuerpo (más difícil), según el nivel del practicante.' WHERE slug = 'floor-ab-variations';

UPDATE exercise_library SET description_es = 'Rotaciones rusas con barra. En banco declinado similar a las elevaciones de tronco, el cuerpo cae levemente hacia atrás y se rotan los hombros de lado a lado sujetando la barra, trabajando los oblicuos.' WHERE slug = 'barbell-twists-russian-twist-with-bar';

UPDATE exercise_library SET description_es = 'Flexión lateral (side bend) con mancuerna. Se sujeta una mancuerna ligera o media (nunca pesada) en agarre neutro a un lado del cuerpo, flexionando lateralmente el tronco para trabajar el oblicuo.' WHERE slug = 'barbell-side-bend';

UPDATE exercise_library SET description_es = 'Crunch oblicuo tumbado de lado. La posición de partida es similar al crunch lateral pero sin sujetar ni cruzar las piernas. Se colocan una sobre otra y se eleva el torso lateralmente contrayendo el oblicuo.' WHERE slug = 'side-lying-oblique-crunch';

UPDATE exercise_library SET description_es = 'Extensión de espalda en banco inclinado con lastre. Igual que la extensión básica pero sostenés un lastre en el pecho con los brazos cruzados sobre él, aumentando la resistencia para fortalecer los erectores espinales.' WHERE slug = 'back-extension-incline-bench';

UPDATE exercise_library SET description_es = 'Elevación de tronco colgado con la cabeza hacia abajo. Con los tobillos anclados en una barra y el cuerpo invertido, elevás el tronco y flexionás la cintura, trabajando los abdominales con mayor amplitud de movimiento.' WHERE slug = 'hanging-leg-raise-bar';

UPDATE exercise_library SET description_es = 'Crunch abdominal en máquina con el tronco inmovilizado por correas o por la sujeción de las manos. Se elevá la pelvis o se flexiona el tronco según el diseño de la máquina. Permite sobrecarga progresiva.' WHERE slug = 'ab-crunch-machine-2';

UPDATE exercise_library SET description_es = 'Crunch de rodillas en polea (también llamado "de rezo"). De rodillas frente a la polea alta con el accesorio de extensiones de tríceps, jalás la cuerda hacia abajo crunchando el torso para contraer los abdominales.' WHERE slug = 'cable-crunch-kneeling';

UPDATE exercise_library SET description_es = 'Rotación de torso en máquina. Sentado con el lastre seleccionado y el cuerpo bloqueado de cintura hacia abajo, girás el torso en uno u otro sentido para trabajar los oblicuos en el plano transversal.' WHERE slug = 'rotary-torso-machine-2';

UPDATE exercise_library SET description_es = 'Extensión de espalda en máquina sentado. Sentado con la espalda apoyada (zona superior) sobre el soporte acolchado, realizás una extensión hasta la horizontal fortaleciendo los erectores espinales y el glúteo mayor.' WHERE slug = 'seated-back-extension-machine';

UPDATE exercise_library SET description_es = 'Rueda abdominal en polea de pie o sentado. Sentado en el suelo con las manos en el agarre de la polea baja, extendés los brazos hacia adelante rodando sobre el suelo hasta la extensión máxima y volvés contrayendo el core.' WHERE slug = 'standing-cable-ab-rollout';

-- =============================================================================
-- BLOQUE 3: description_en para ejercicios 111-234
-- (la migración ya hizo backfill de description → description_en para 1-110;
-- estos ejercicios tenían description en español, así que necesitan inglés explícito)
-- =============================================================================

UPDATE exercise_library SET description_en = 'Flat bench press with a narrow grip (hands about 20 cm apart). Shifts emphasis from the pectorals to the triceps. Not recommended if you have wrist issues.' WHERE slug = 'bench-press-barbell';

UPDATE exercise_library SET description_en = 'Incline bench press with dumbbells. Lie on the incline bench and press as you would with a barbell, with the added advantage of bringing the dumbbells together at the top for greater sternal pec contraction.' WHERE slug = 'incline-bench-press';

UPDATE exercise_library SET description_en = 'Decline bench press with dumbbells. Lie back while gripping the dumbbells with flexed arms. Allows greater range of motion than barbell. Use moderate loads and request a spotter for heavy sets.' WHERE slug = 'decline-bench-press';

UPDATE exercise_library SET description_en = 'Similar to the basic bench press but with dumbbells. You can rotate the thumbs outward at the top for greater sternal pec contraction. The rotation generally occurs at the forearm.' WHERE slug = 'dumbbell-press';

UPDATE exercise_library SET description_en = 'Dumbbell fly on an incline bench at 30-45°. Lying on the bench, open arms with elbows slightly bent and bring them back in a wide arc. Upper pectoral fibers are most targeted.' WHERE slug = 'dumbbell-fly';

UPDATE exercise_library SET description_en = 'Push-ups with feet on the floor. Same movement as the advanced variation adapted for practitioners with lower strength levels.' WHERE slug = 'push-ups';

UPDATE exercise_library SET description_en = 'Dips (parallel bar or bench). Same movement and fundamentals as the basic exercise. The main difference is the load used based on level and goals.' WHERE slug = 'dips';

UPDATE exercise_library SET description_en = 'Dumbbell pullover holding a short barbell in pronated grip (palms toward feet). Same movement as the dumbbell pullover. The barbell grip may feel more comfortable and stable for some.' WHERE slug = 'dumbbell-pullover-2';

UPDATE exercise_library SET description_en = 'Lying on a flat bench, hold dumbbells vertically with palms facing each other. With elbows slightly bent, describe a wide arc until you feel the pectoral stretch, then return to start.' WHERE slug = 'incline-dumbbell-fly';

UPDATE exercise_library SET description_en = 'Standing barbell pullover with a plate on one end. Perform a pullover motion standing up to work the pectorals and lats with a different mechanics than the bench version.' WHERE slug = 'close-grip-barbell-bench-press';

UPDATE exercise_library SET description_en = 'Floor pullover with dumbbells, starting from a position similar to bench dips with differently oriented dumbbells. Combines pullover movement with floor support for greater stability.' WHERE slug = 'floor-dumbbell-pullover';

UPDATE exercise_library SET description_en = 'Machine chest press. Same movement as the basic press but the machine angle or design shifts the work toward the upper (clavicular) or lower (sternal) portion of the pectoral. Safe and controlled.' WHERE slug = 'machine-chest-press';

UPDATE exercise_library SET description_en = 'Smith machine bench press. Identical to the basic exercise but the machine guides the bar path, allowing focus on muscle contraction with added safety.' WHERE slug = 'smith-machine-bench-press-2';

UPDATE exercise_library SET description_en = 'Cable crossover performed in the same stance as standard chest flys. The constant cable tension makes this an effective exercise for both the inner and outer portions of the pectoral.' WHERE slug = 'cable-crossover';

UPDATE exercise_library SET description_en = 'Low cable chest fly, essentially the same as the basic fly but on an incline bench at 30-45°. The low cable directs tension toward the upper portion of the pectoral.' WHERE slug = 'low-cable-chest-fly';

UPDATE exercise_library SET description_en = 'Pec-deck machine. Same as the basic fly exercise since elbow extension does not affect the pectoral. The machine guides the arc of the movement with constant resistance.' WHERE slug = 'pec-deck-machine';

UPDATE exercise_library SET description_en = 'Assisted cable dips. Lying on a bench with head at the edge, hold the cable bar or rope from the low pulley. Perform a pullover motion assisted by the cable for greater resistance control.' WHERE slug = 'assisted-dips-cable';

UPDATE exercise_library SET description_en = 'Pull-ups and chin-ups. Pull your bodyweight from a hanging position up until your chin clears the bar. Works lats and biceps. Grip variations change the emphasis.' WHERE slug = 'pull-ups-chin-ups';

UPDATE exercise_library SET description_en = 'Barbell bent-over row. Hinged at ~45°, row the bar toward your lower abdomen squeezing the shoulder blades. Similar to dumbbell rows but allows heavier loads.' WHERE slug = 'barbell-bent-over-row';

UPDATE exercise_library SET description_en = 'T-bar row. Nearly identical to the landmine row but with a wider grip that shifts some work to the mid and upper back. Excellent exercise for back thickness.' WHERE slug = 't-bar-row';

UPDATE exercise_library SET description_en = 'Single-arm dumbbell row variation. The elbow flares slightly wider than in the basic version, shifting the emphasis slightly toward the upper back.' WHERE slug = 'dumbbell-single-arm-row-2';

UPDATE exercise_library SET description_en = 'Alternating dumbbell pullover with two lighter dumbbells. Allows greater range of motion and unilateral training of the lat and pectoral.' WHERE slug = 'dumbbell-pullover-3';

UPDATE exercise_library SET description_en = 'Inverted T-bar row standing sideways to a fixed vertical bar with feet close to it. Perform a rowing motion using your bodyweight. Excellent back exercise without equipment.' WHERE slug = 'inverted-t-bar-row';

UPDATE exercise_library SET description_en = 'Machine lat pulldown. If the machine has independent lever arms, it can be performed single-arm. The guided machine provides stability and allows focus on lat contraction.' WHERE slug = 'máquina-de-dorsal-jalón-en-máquina';

UPDATE exercise_library SET description_en = 'Narrow-grip lat pulldown with palms facing each other or toward you. The body is more upright and the head leads slightly, achieving a greater range of motion and lower lat activation.' WHERE slug = 'lat-pulldown';

UPDATE exercise_library SET description_en = 'Gironda-style cable row. Pull from the high pulley with less weight but greater range and control. It is halfway between a pulldown and a traditional row in terms of muscle stimulus.' WHERE slug = 'remo-en-polea-gironda';

UPDATE exercise_library SET description_en = 'Machine row with wide pronated grip and elbows flared. Identical to the basic exercise with the advantage of machine guidance and stability.' WHERE slug = 'machine-row';

UPDATE exercise_library SET description_en = 'Standing low cable row. If the pulley is high, the body must remain more upright. Provides a stimulus halfway between a pulldown and an inclined row.' WHERE slug = 'standing-low-cable-row';

UPDATE exercise_library SET description_en = 'Straight-arm cable pulldown with neutral or slightly pronated grip using a rope attachment. The rope allows a slightly greater range at the bottom of the movement.' WHERE slug = 'cable-straight-arm-pulldown-2';

UPDATE exercise_library SET description_en = 'Assisted pull-up machine with neutral grip handles (neither pronated nor supinated). Neutral grip reduces wrist tension and slightly varies the stimulus on lats and biceps.' WHERE slug = 'assisted-pull-up-machine-2';

UPDATE exercise_library SET description_en = 'Single-arm cable pulldown seated on the floor or kneeling. This position generally achieves a greater range of motion than the standard machine pulldown, maximizing lat stretch.' WHERE slug = 'single-arm-cable-pulldown';

UPDATE exercise_library SET description_en = 'Neutral-grip lat pulldown standing between two cable stations with semi-flexed legs. Combines lat work with greater anterior deltoid and pectoral involvement.' WHERE slug = 'neutral-grip-lat-pulldown';

UPDATE exercise_library SET description_en = 'Smith machine bent-over row. Executed like the free-weight version: standing with straight torso inclined and semi-flexed knees. The guided bar adds stability to the movement.' WHERE slug = 'smith-machine-row';

UPDATE exercise_library SET description_en = 'Behind-the-neck military press. More vertical bench and slight head flexion to lower the bar behind the neck. Requires good shoulder mobility; not recommended with cervical issues.' WHERE slug = 'military-press-barbell';

UPDATE exercise_library SET description_en = 'Standing dumbbell shoulder press. Allows a slight leg drive on heavier reps. Requires greater core stabilization than the seated version.' WHERE slug = 'dumbbell-press-2';

UPDATE exercise_library SET description_en = 'Arnold press on a 45-60° incline bench. Nearly identical to the basic exercise but the incline bench increases stability and reduces lumbar load.' WHERE slug = 'dumbbell-arnold-press-2';

UPDATE exercise_library SET description_en = 'Dumbbell lateral raise. Hands are raised with thumbs pointing slightly downward (internal rotation), which some authors suggest better isolates the medial deltoid.' WHERE slug = 'dumbbell-lateral-raise-2';

UPDATE exercise_library SET description_en = 'Single-arm lateral raise on a 45-60° incline bench. Allows greater range of motion and better medial deltoid isolation by eliminating contralateral compensation.' WHERE slug = 'elevaciones-laterales-a-una-mano';

UPDATE exercise_library SET description_en = 'Dumbbell front raise. Creates greater lumbar and paravertebral tension than the barbell version. Performed alternately or simultaneously to shoulder height.' WHERE slug = 'dumbbell-front-raise-2';

UPDATE exercise_library SET description_en = 'Rear delt fly seated at bench edge or in prone position. Excellent variation for isolating the posterior deltoid with back supported, eliminating lumbar compensation.' WHERE slug = 'bent-over-rear-delt-fly';

UPDATE exercise_library SET description_en = 'Side-lying rear delt raise. The elbow moves closer to the body than in the inclined version. Allows greater isolation of the posterior deltoid with more control and less lumbar load.' WHERE slug = 'side-lying-rear-delt-raise';

UPDATE exercise_library SET description_en = 'Barbell upright row. Same movement as the basic exercise up to the neck, from which point the extension can be varied to work the trapezius or medial deltoid.' WHERE slug = 'barbell-upright-row';

UPDATE exercise_library SET description_en = 'Shoulder shrug for trapezius. Standing or seated, elevate shoulders toward ears with the load at the sides. Isolation movement for the upper trapezius.' WHERE slug = 'shoulder-shrug';

UPDATE exercise_library SET description_en = 'Unilateral dumbbell shoulder press in side-lying position on a bench or mat. Hammer grip (semi-pronation). Works the deltoid unilaterally with greater stabilization demand.' WHERE slug = 'unilateral-dumbbell-shoulder-press';

UPDATE exercise_library SET description_en = 'Dumbbell shrug on an incline bench at 45-60°. Seated with dumbbells in neutral grip at sides. The incline bench modifies the working angle of the upper trapezius.' WHERE slug = 'dumbbell-shrug-2';

UPDATE exercise_library SET description_en = 'External shoulder rotation with dumbbell. Position similar to the dumbbell row, supported on a horizontal bench. Works the external rotators of the rotator cuff (infraspinatus and teres minor).' WHERE slug = 'dumbbell-external-rotation';

UPDATE exercise_library SET description_en = 'Shoulder rotation in prone position on a flat bench, chest at the edge. Works the external rotators of the shoulder in a stable position that minimizes compensation.' WHERE slug = 'floor-shoulder-rotation';

UPDATE exercise_library SET description_en = 'Lateral raise with resistance band in supine position on a flat bench, shoulders at the edge. The band changes the resistance vector, working the medial deltoid in a different plane.' WHERE slug = 'resistance-band-lateral-raise';

UPDATE exercise_library SET description_en = 'Machine shoulder press, same position as the basic exercise or with a more inclined bench. The guided movement provides safety and allows focus on muscle contraction.' WHERE slug = 'machine-shoulder-press';

UPDATE exercise_library SET description_en = 'Smith machine behind-the-neck military press. Near-exact replica of the military press with the only variation being the posterior bar path. Requires good cervical and shoulder mobility.' WHERE slug = 'smith-machine-shoulder-press-2';

UPDATE exercise_library SET description_en = 'Single-arm machine lateral raise. Same movement as the bilateral version but the entire set is performed with one arm. Allows greater focus and correction of imbalances between sides.' WHERE slug = 'machine-lateral-raise';

UPDATE exercise_library SET description_en = 'Cross-cable lateral raise (cable passes behind the body). The main difference from the standard version is the resistance vector, which works the medial deltoid from a different angle.' WHERE slug = 'cable-lateral-raise-single';

UPDATE exercise_library SET description_en = 'Cable front raise with rope or bar using both hands. The cable provides constant tension throughout the movement, unlike the dumbbell version where tension varies.' WHERE slug = 'cable-front-raise-2';

UPDATE exercise_library SET description_en = 'Single-arm cable rear delt fly. Position similar to the dumbbell equivalent. Works the posterior deltoid and rhomboids with the constant tension of the cable.' WHERE slug = 'cable-rear-delt-fly-single';

UPDATE exercise_library SET description_en = 'Rear delt fly on pec-deck machine (used in reverse). The body faces the pad and opens arms rearward, working the posterior deltoid with the guided arc of the machine.' WHERE slug = 'rear-delt-machine-fly';

UPDATE exercise_library SET description_en = 'Cable upright row in lying position. Same movement as standing but in the row pulley lying down. The body angle provides a different stimulus to the trapezius and medial deltoid.' WHERE slug = 'cable-upright-row-2';

UPDATE exercise_library SET description_en = 'Smith machine shoulder shrug. Position and movement similar to the upright row but with emphasis on trapezius elevation. The guided bar facilitates progressive overload.' WHERE slug = 'shoulder-shrug-2';

UPDATE exercise_library SET description_en = 'Cable internal shoulder rotation in side-lying position on a bench. Hammer grip (semi-pronation). Works the internal rotators of the shoulder (subscapularis), important for rotator cuff balance.' WHERE slug = 'cable-internal-rotation';

UPDATE exercise_library SET description_en = 'Barbell bicep curl. The grip is anatomically more neutral with an EZ bar. The 21-rep set (seven partial lower, seven partial upper, seven full reps) is a popular variation.' WHERE slug = 'barbell-bicep-curl';

UPDATE exercise_library SET description_en = 'Curl with progressive supination using dumbbells. Excellent exercise similar to the hammer curl but with forearm rotation from neutral to supinated during the movement to maximize bicep contraction.' WHERE slug = 'dumbbell-supination-curl';

UPDATE exercise_library SET description_en = 'Single-arm Scott bench curl with a dumbbell, alternating arms. The free hand supports on the bench. Bilateral support reduces the ability to generate momentum and maximizes isolation.' WHERE slug = 'preacher-curl-scott-bench';

UPDATE exercise_library SET description_en = 'Standing concentration curl with hip flexed ~90° and one hand supported. Same as seated version but standing with hips nearly parallel to the floor for maximum bicep peak isolation.' WHERE slug = 'concentration-curl';

UPDATE exercise_library SET description_en = 'Curl with light dumbbells in supine position. Lower the dumbbells until the stretch is comfortable and curl upward. Emphasizes the bicep stretch during the eccentric phase.' WHERE slug = 'ez-bar-curl';

UPDATE exercise_library SET description_en = 'Standing hammer curl in neutral grip. Same as standard hammer curl but standing upright. Works the brachialis and brachioradialis with emphasis on arm thickness.' WHERE slug = 'incline-dumbbell-curl';

UPDATE exercise_library SET description_en = 'Machine bicep curl with neutral grip (if the design allows). Neutral grip shifts some work to the brachialis and brachioradialis, complementing the bicep stimulus.' WHERE slug = 'bicep-curl-machine';

UPDATE exercise_library SET description_en = 'Cable bicep curl with rope attachment, back to the cable with a single handle. Hands in neutral (hammer) position. The constant cable tension improves stimulus throughout the range of motion.' WHERE slug = 'cable-bicep-curl';

UPDATE exercise_library SET description_en = 'High cable bicep curl with one or two hands from an elevated position. Unconventional variation that maximizes bicep stretch by starting with arms horizontal.' WHERE slug = 'high-cable-curl-single-arm';

UPDATE exercise_library SET description_en = 'French press (skull crusher) with barbell. The EZ bar grip provides a more comfortable and neutral wrist position. Work the triceps with elbows pointing toward the ceiling.' WHERE slug = 'french-press-skull-crusher-bar';

UPDATE exercise_library SET description_en = 'French press with a single dumbbell. Hold the dumbbell in pronation and stabilize the arm by gripping the bicep with the free hand. Lower the dumbbell behind the head and extend the elbow.' WHERE slug = 'french-press-skull-crusher-dumbbell';

UPDATE exercise_library SET description_en = 'Bench dips. Place hands in pronation on the bench edge with legs extended. Work the triceps (and some lower pectorals) with your own bodyweight.' WHERE slug = 'dips-2';

UPDATE exercise_library SET description_en = 'Stacked-hand push-ups (one hand on top of the other). Greater tricep demand than parallel-hand push-ups, increasing the difficulty of the exercise.' WHERE slug = 'push-ups-2';

UPDATE exercise_library SET description_en = 'Tricep kickback with pronated grip and elbows above the torso. Similar to the standard version but the arm angle shifts the muscular emphasis.' WHERE slug = 'tricep-kickback';

UPDATE exercise_library SET description_en = 'Close-grip bench press. Same position as standard bench press but elbows flare slightly away from the torso on the way down, placing the work primarily on the triceps.' WHERE slug = 'close-grip-bench-press';

UPDATE exercise_library SET description_en = 'Overhead dumbbell tricep extension with short barbell in pronated grip at shoulder-width. Some studies suggest greater long head tricep activation in overhead extension.' WHERE slug = 'overhead-tricep-extension-dumbbell';

UPDATE exercise_library SET description_en = 'Cable tricep pushdown with bar, single-arm or standard grip. Identical movement to the basic exercise but with accessory variation to adapt grip comfort.' WHERE slug = 'cable-tricep-pushdown-bar';

UPDATE exercise_library SET description_en = 'Cable tricep pushdown with rope, back to the high pulley. Similar stance to the standard pushdown but facing away, changing the tension angle to work the long head of the tricep.' WHERE slug = 'cable-tricep-pushdown-rope-2';

UPDATE exercise_library SET description_en = 'Tricep extension on Scott bicep bench. Arms rest on the pad with elbows at the edge, performing the extension from full flexion to full elbow extension.' WHERE slug = 'tricep-extension-machine-2';

UPDATE exercise_library SET description_en = 'Tricep press on horizontal press machine. Seated in the chest-tricep press machine configured for triceps, press with elbows close to the body.' WHERE slug = 'tricep-press-machine';

UPDATE exercise_library SET description_en = 'Overhead cable tricep extension standing, back to the high pulley. Grip the attachment in pronation or supination behind the neck and extend elbows upward. Works especially the long head.' WHERE slug = 'overhead-cable-tricep-extension';

UPDATE exercise_library SET description_en = 'Barbell wrist curl. Seated with forearms horizontal resting on thighs, perform palmar flexion of the wrist. Works the forearm flexors.' WHERE slug = 'wrist-curl-barbell';

UPDATE exercise_library SET description_en = 'Wrist extension (dorsal flexion) with dumbbells. Same as barbell wrist curl but both hands are independent holding dumbbells in pronation.' WHERE slug = 'reverse-wrist-curl';

UPDATE exercise_library SET description_en = 'Pronated curl or neutral grip curl. Working the hand in neutral or pronated position trains the brachialis and brachioradialis. Halfway between a bicep curl and a forearm exercise.' WHERE slug = 'reverse-curl-pronated';

UPDATE exercise_library SET description_en = 'Wrist roller. Same position as the wrist curl but perform dorsal flexion extensions to raise the weight by winding the rope. Works the forearm extensors.' WHERE slug = 'rope-wrist-roll';

UPDATE exercise_library SET description_en = 'Radial wrist flexion. Lying on your side with the arm bent 90° and forearm horizontal, perform a lateral wrist flexion toward the radius. Works the radial muscles of the forearm.' WHERE slug = 'wrist-radial-flexion';

UPDATE exercise_library SET description_en = 'Barbell squat. Feet and stance width vary as you descend; toes point outward according to individual anatomy. Arms can cross or grip the bar in standard position.' WHERE slug = 'barbell-squat';

UPDATE exercise_library SET description_en = 'Step-up variation. Same as the basic step-up but once on top, you keep the same leg up for the entire set before switching, rather than alternating with each rep.' WHERE slug = 'step-up';

UPDATE exercise_library SET description_en = 'Lunges (reverse variation). Similar to the step-up but the working leg stays in place while the other moves backward. Shifting weight forward increases quadricep demand.' WHERE slug = 'lunges';

UPDATE exercise_library SET description_en = 'Dumbbell deadlift (one or two dumbbells). Movement similar to the barbell version, with the advantage that dumbbells are held in neutral grip (palms facing each other) which may be more comfortable.' WHERE slug = 'deadlift';

UPDATE exercise_library SET description_en = 'Standing calf raise. Classic bodybuilding exercise: standing on the edge of a step or platform, rise and lower on toes. Intermediate intensity between the two-legged and single-leg versions.' WHERE slug = 'standing-calf-raise';

UPDATE exercise_library SET description_en = 'Seated calf raise with dumbbells. Same as with a barbell but holding dumbbells and resting the flat side of a plate on the thighs. Works the soleus similarly to the seated calf raise machine.' WHERE slug = 'seated-calf-raise-bar';

UPDATE exercise_library SET description_en = 'Prone glute kickback on a bench, hugging the bench with legs hanging off and bent. Raise one extended leg contracting the glute at the top. Glute isolation exercise.' WHERE slug = 'glute-kickback';

UPDATE exercise_library SET description_en = 'Hip abduction standing or side-lying. Bring legs into abduction being careful not to tilt the torso. Works the gluteus medius and hip abductors.' WHERE slug = 'side-leg-raise';

UPDATE exercise_library SET description_en = 'Standing hip adduction (or side-lying). The opposite leg (upper) plants its foot to stabilize. Adduct the lower leg crossing it in front of the other leg.' WHERE slug = 'standing-hip-adduction';

UPDATE exercise_library SET description_en = 'Cable glute extension standing. Seated with knees bent and heels on a low step, holding a plate or similar load. Hip extension targeting the gluteus maximus.' WHERE slug = 'standing-cable-glute-extension';

UPDATE exercise_library SET description_en = 'Smith machine squat with feet more forward. Same as on a leg press machine but placing the bar as in a conventional squat. The Smith guides the movement reducing balance demands.' WHERE slug = 'smith-machine-squat-2';

UPDATE exercise_library SET description_en = 'Leg press with feet placed higher on the platform to increase hamstring and glute activation. Variation from the standard foot placement on the press.' WHERE slug = 'leg-press-machine';

UPDATE exercise_library SET description_en = 'Machine leg extension. A slight foot rotation can be performed when the knee is bent, though this rotation occurs mainly at the hip and does not significantly alter quadricep stimulus.' WHERE slug = 'leg-extension-machine-2';

UPDATE exercise_library SET description_en = 'Lying leg curl machine variation. Toes can point inward or the lateral thigh can be supported. Toes-out position works the short head of the biceps femoris more.' WHERE slug = 'lying-leg-curl-machine-2';

UPDATE exercise_library SET description_en = 'Standing calf raise machine with leg rotation. Medial rotation (toes in) emphasizes the outer fibers of the soleus; lateral rotation (toes out) emphasizes the inner fibers of the gastrocnemius.' WHERE slug = 'standing-calf-raise-machine-2';

UPDATE exercise_library SET description_en = 'Calf press on horizontal plate leg press machine. Same calf raise movement but positioned on the horizontal press, providing greater comfort for the load and range of motion.' WHERE slug = 'calf-press-on-leg-press';

UPDATE exercise_library SET description_en = 'Seated calf raise on machine with alternative design: the toes rest on the platform and the resistance falls on the thighs via a different mechanism than the standard seated calf raise machine.' WHERE slug = 'seated-calf-raise-machine-2';

UPDATE exercise_library SET description_en = 'Hip adduction on machine or standing at low cable pulley. Standing sideways to the low pulley, hold the apparatus and adduct the leg crossing it in front. Works the inner thigh adductors.' WHERE slug = 'hip-adductor-machine-2';

UPDATE exercise_library SET description_en = 'Hip abduction standing at low cable pulley. Standing sideways to the low pulley, hold the apparatus and abduct the leg outward. Works the gluteus medius and hip abductors.' WHERE slug = 'hip-abductor-machine-2';

UPDATE exercise_library SET description_en = 'Cable glute kickback standing. With body slightly forward and hands on the machine, extend the ankle-strapped leg rearward contracting the glute.' WHERE slug = 'cable-glute-kickback-2';

UPDATE exercise_library SET description_en = 'Cable hip flexion. Similar position to the glute kickback but with the cable pulling from the front. Flex the hip raising the knee, working the psoas and hip flexors.' WHERE slug = 'cable-hip-flexion';

UPDATE exercise_library SET description_en = 'Smith machine Romanian deadlift. Standing with bar across the traps and deltoids, hinge at the hips lowering the bar down the legs. Similar to Smith machine squat but with hamstring emphasis.' WHERE slug = 'smith-machine-romanian-deadlift';

UPDATE exercise_library SET description_en = 'Cable hack squat. Prone on a bench or on the floor if the pulley is at that height, perform a hip and knee extension similar to the hack squat but with cable resistance vector.' WHERE slug = 'cable-hack-squat';

UPDATE exercise_library SET description_en = 'Standing cable hamstring curl. Same as the standard version but the cable tension comes from the opposite side of the body (in abduction), varying the hamstring working angle.' WHERE slug = 'standing-cable-hamstring-curl';

UPDATE exercise_library SET description_en = 'Seated lateral cable hip extension. Seated sideways to the pulley with the rope attached to the far foot, perform a lateral hip rotation. Works the gluteus maximus and external hip rotators.' WHERE slug = 'cable-hip-extension';

UPDATE exercise_library SET description_en = 'Floor abdominal crunch. Similar to the basic crunch but crossing one leg over the other (as a reference point) and extending the opposite arm for greater oblique involvement.' WHERE slug = 'crunch-floor';

UPDATE exercise_library SET description_en = 'Decline sit-up. On a decline bench, raise the torso contracting the abdominals. In this variation, hold a weight plate on the chest with arms crossed to increase resistance.' WHERE slug = 'decline-sit-up';

UPDATE exercise_library SET description_en = 'Lying leg raise. Same position as the crunch but holding a support above the head. Raise legs extended or bent to vertical, working the lower rectus abdominis.' WHERE slug = 'lying-leg-raise';

UPDATE exercise_library SET description_en = 'Hanging leg raise. Hanging from a bar with pronated grip, raise knees or straight legs. More demanding than the supported bench version due to the scapular stabilization requirement.' WHERE slug = 'hanging-leg-raise';

UPDATE exercise_library SET description_en = 'Floor ab variations. Same as the basic crunch but hands remain crossed on the chest (easier) or extended in front of the body (harder), depending on the practitioner level.' WHERE slug = 'floor-ab-variations';

UPDATE exercise_library SET description_en = 'Russian twist with barbell on decline bench. The body falls slightly back and shoulders rotate side to side holding the bar, working the obliques.' WHERE slug = 'barbell-twists-russian-twist-with-bar';

UPDATE exercise_library SET description_en = 'Side bend with dumbbell. Hold a light to medium dumbbell (never heavy) in neutral grip at one side, performing a lateral trunk flexion to work the oblique.' WHERE slug = 'barbell-side-bend';

UPDATE exercise_library SET description_en = 'Side-lying oblique crunch. Starting position similar to the lateral crunch but without holding or crossing the legs. Place one leg on top of the other and raise the torso laterally contracting the oblique.' WHERE slug = 'side-lying-oblique-crunch';

UPDATE exercise_library SET description_en = 'Back extension on incline bench with added load. Identical to the basic extension but hold a weight plate on the chest with arms crossed, increasing resistance to strengthen the spinal erectors.' WHERE slug = 'back-extension-incline-bench';

UPDATE exercise_library SET description_en = 'Hanging trunk raise inverted. With ankles anchored on a bar and body inverted, raise the torso and flex at the waist, working the abdominals with greater range of motion.' WHERE slug = 'hanging-leg-raise-bar';

UPDATE exercise_library SET description_en = 'Machine abdominal crunch with trunk immobilized by straps or hand grip. Raise the pelvis or flex the trunk depending on machine design. Allows progressive overload.' WHERE slug = 'ab-crunch-machine-2';

UPDATE exercise_library SET description_en = 'Kneeling cable crunch (also called prayer crunch). Kneeling in front of the high pulley with the tricep extension rope, pull the rope downward crunching the torso to contract the abdominals.' WHERE slug = 'cable-crunch-kneeling';

UPDATE exercise_library SET description_en = 'Rotary torso machine. Seated with load selected and body blocked from the waist down, rotate the torso in one direction or the other to work the obliques in the transverse plane.' WHERE slug = 'rotary-torso-machine-2';

UPDATE exercise_library SET description_en = 'Seated back extension machine. Seated with upper back against the padded support, perform an extension to horizontal strengthening the spinal erectors and gluteus maximus.' WHERE slug = 'seated-back-extension-machine';

UPDATE exercise_library SET description_en = 'Cable ab rollout seated or standing. Seated on the floor with hands on the low cable attachment, extend arms forward rolling out to maximum extension, then return contracting the core.' WHERE slug = 'standing-cable-ab-rollout';
