/**
 * FAQ por tratamiento — preguntas y respuestas REALES extraídas del contenido
 * publicado en las páginas de tratamiento de clinicadentalbances.com (mirror,
 * 2026-06-14). No se inventa contenido; se limpian artefactos de espaciado, se
 * recorta a frases completas y se descartan los enlaces a posts del blog. Cada
 * clave es el slug de la categoría de tratamiento; el componente Faq las
 * renderiza con JSON-LD FAQPage.
 */
export interface FaqTratamiento {
  pregunta: string;
  respuesta: string;
}

export const faqsTratamientos: Record<string, FaqTratamiento[]> = {
  "blanqueamiento-dental": [
    {
      pregunta: "¿Por qué se Oscurecen los Dientes?",
      respuesta: "Con el tiempo, es natural que los dientes pierdan su blanco original. Factores como el consumo de café, té, vino tinto, el tabaco o simplemente el envejecimiento, provocan manchas que alteran la estética de la sonrisa. Por eso, antes de iniciar cualquier tratamiento, realizamos un diagnóstico individualizado para evaluar el origen de las manchas y determinar el tratamiento más eficaz para ti.",
    },
    {
      pregunta: "¿El blanqueamiento daña el esmalte?",
      respuesta: "No. Realizado por profesionales y con los productos adecuados como FGM, es un procedimiento seguro. Nuestros geles incluyen componentes que refuerzan y protegen el esmalte.",
    },
    {
      pregunta: "¿Cuánto tiempo dura el resultado?",
      respuesta: "La duración depende de tus hábitos (café, tabaco, etc. ). Con una buena higiene y revisiones, tu sonrisa puede mantenerse blanca durante años. Te daremos todas las pautas para cuidarla.",
    },
    {
      pregunta: "¿Qué dieta debo seguir después del tratamiento?",
      respuesta: "Recomendamos una «dieta blanca» durante los primeros días, evitando alimentos y bebidas con colorantes intensos (café, vino tinto, curry, frutos rojos) para consolidar el resultado.",
    },
    {
      pregunta: "¿Existen contraindicaciones?",
      respuesta: "Sí. No se recomienda en casos de caries activas, enfermedad de las encías sin tratar, hipersensibilidad severa, embarazo o en menores de edad. Por eso es imprescindible una evaluación previa.",
    },
  ],
  "cirugia-oral": [
    {
      pregunta: "¿Me tengo que quitar los cordales?",
      respuesta: "Seguro que has oído hablar de los cordales, terceros molares o muelas del juicio. Por normal general, erupcionan entre los 18 y 25 años, aunque puede que nunca lo lleguen a hacer. El que no lleguen a salir, produce diversas patologías como el apiñamiento, caries en dientes vecinos, enfermedad periodontal, pericoronaritis, flemones y abcesos que habitualmente cursan con un dolor muy agudo que irradia a oído y lateral de la cabeza, siendo muchas veces incapacitante.",
    },
    {
      pregunta: "¿Duele quitar los cordales o muelas del juicio?",
      respuesta: "En la clínica dental bances hacemos un exhaustivo estudio de la situación de cada paciente, realizando unas extracciones totalmente indoloras mediante técnicas de anestesia local muy precisas, y pautando una medicación previa y otra postoperatoria que limitarán tanto el dolor como la inflamación postquirúrgica. Debido a nuestra dilatada experiencia, realizamos las intervenciones de cirugía oral de manera rápida, indolora y efectiva, causando el menor daño posible a los tejidos.",
    },
  ],
  "endodoncias": [
    {
      pregunta: "¿Necesito una endodoncia?",
      respuesta: "Necesitamos hacernos una endodoncia, o matarnos el nervio cuando se ha producido una lesión de la pulpa o nervio del diente. Normalmente son por caries o por traumatismos, que pueden haber provocado una fractura en nuestro diente.",
    },
    {
      pregunta: "¿Se debilita un diente con una endodoncia?",
      respuesta: "No, rotundamente no. Anestesiamos con técnicas indoloras, que nos permite la endodoncia. Consiste en eliminar el tejido pulpar dañado, permitiendo posteriormente rehabilitar el diente, mediante técnicas especiales, donde usamos postes de fibra de vidrio, composites especiales para la reconstrucción de muñones, incrustaciones y coronas, que permiten conservar el diente, devolviéndole su funcionalidad tanto estética como masticatoria.",
    },
    {
      pregunta: "¿Duele una endodoncia?",
      respuesta: "Una endodoncia es totalmente indolora, formados para anestesias técnicamente imperceptibles, mediante la endodoncia mecanizada, localizadores de ápices, radiografía digital y limas muy flexibles de Níquel – Titanio. Acortamos el tiempo de trabajo en más de un 50% y aseguramos un resultado fiable, de calidad, y que nos permite mantener nuestro diente en boca y evitar su extracción.",
    },
    {
      pregunta: "¿Quién me hace la endodoncia?",
      respuesta: "Las endodoncias tienen una complejidad alta, y difiere mucho del tipo de diente que toque tratar, y de la complejidad de la anatomía particular de cada diente. Para su correcta realización hay que estar formado y preparado, con experiencia para afrontar complicaciones que de no solucionarlas conllevará el fracaso del tratamiento. Los dentistas de nuestra Clínica Dental, hemos recibido formación actualizada y continuada en endodoncia, que nos permite afrontar con solvencia casos de alta dificultad.",
    },
    {
      pregunta: "¿Se puede reendodonciar un diente?",
      respuesta: "Cuando una endodoncia previamente realizada no se ha conseguido desinfectar completamente las raíces, o no se ha conseguido un sellado correcto de estas, pueden provocar dolor, inflamación y lesiones en el hueso. Cuando esto ocurre, se necesita retratar o reendodonciar el diente.",
    },
  ],
  "implantes-dentales": [
    {
      pregunta: "¿Duele la cirugía de implantes dentales?",
      respuesta: "La cirugía de implantes dentales es totalmente indolora. Se realiza con anestesia local, y su colocación es rápida, segura y fiable. Hay que esperar por norma general unas 12 semanas, aunque puede ser menos, dependiendo del paciente y la situación, para que el hueso se forme alrededor del implante y esté preparado para poder aguantar las fuerzas de la masticación.",
    },
    {
      pregunta: "¿Qué pasa si no repongo un diente perdido?",
      respuesta: "Desde que perdemos un diente, en nuestra boca empiezan a producirse diferentes consecuencias que debemos evitar.",
    },
    {
      pregunta: "¿Qué implantes dentales colocamos?",
      respuesta: "En nuestra Clínica Dental colocamos una gama alta de implantes dentales, uno de los mejores que hay en el mercado, la marca Straumann, que nos da seguridad en el tratamiento y garantía total de sus componentes. Nuestra filosofía es realizar los mejores tratamientos. Para ello, realizamos formación continuada en cirugía de implantes dentales y usamos los mejores materiales, consiguiendo nuestros objetivos de calidad.",
    },
  ],
  "odontologia-conservadora": [
    {
      pregunta: "¿Qué empastes me va a poner?",
      respuesta: "Hoy en día la estética es fundamental para todos, por lo que usamos para los empastes composites de altísima calidad estética que son imperceptibles unas vez colocados, permitiendo una estética excelente. Usamos los mejores materiales del mercado, NO USAMOS PRODUCTOS LOW COST, y ni escatimamos recursos, brindando en cada tratamiento las mejores soluciones.",
    },
    {
      pregunta: "¿No sonríes porque tienes un diente roto, o desgastado?",
      respuesta: "Reconstrucciones estéticas de los dientes anteriores, una forma rápida, realizada en clínica con los mejores materiales restauradores, que nos dan la posibilidad de imitar el color, el tono y la translucidez del propio diente. Podemos reconstruir bordes rotos y desgastados dándonos de nuevo esa juventud que hemos perdido.",
    },
  ],
  "odontopediatria": [
    {
      pregunta: "¿Qué trata la odontopediatría?",
      respuesta: "La odontopediatría se encarga del tratamiento de las afecciones orales del niño desde la gestación. Desde los 3 años se recomiendan visitas cada 6 meses al odontopediatra para así poder vigilar la salud oral de nuestros hijos.",
    },
    {
      pregunta: "¿Hay que empastar los dientes de leche?",
      respuesta: "En nuestra Clínica, son muchos los padres que nos preguntan el porqué empastar los dientes de leche si se van a caer. La respuesta siempre es clara y firme, SÍ HAY QUE EMPASTAR LOS DIENTES DE LECHE, ya que cualquier infección en un diente de leche, puede llegar a afectar al diente definitivo, provocando manchas, malformaciones.",
    },
  ],
  "ortodoncia": [
    {
      pregunta: "¿Cuándo debo llevar a mi hijo al ortodoncista?",
      respuesta: "La edad ideal para realizar la primera consulta es a los 7 años, edad en la que ya han erupcionado las primeras muelas definitivas. Aun así, tan pronto como detectemos algún problema en la mordida o en la posición de los dientes es el momento ideal para visitar a nuestro ortodoncista. Realizar una revisión de la mordida y los dientes a los 6-7 años nos permitirá corregir problemas de una manera más sencilla que en edades avanzadas, cuando el problema ya se ha agravado.",
    },
    {
      pregunta: "¿Puedo colocarme brackets en edad adulta?",
      respuesta: "El tratamiento de ortodoncia con brackets puede realizarse a cualquier edad, siempre que hayan erupcionado todos los dientes definitivos. Conseguir una correcta alineación de los dientes, mejorar la distribución de las cargas de la masticación y favorecer la correcta articulación de los dientes superiores e inferiores es un tratamiento que se puede realizar a cualquier edad. En la edad adulta, el movimiento de los dientes cuesta más que en la infancia, pero los resultados que obtenemos son igual de efectivos.",
    },
    {
      pregunta: "¿Cuánto tiempo dura un tratamiento de ortodoncia con brackets?",
      respuesta: "La duración exacta de un tratamiento de ortodoncia es difícil de determinar. Siempre podemos realizar una aproximación, pero el paciente debe tener en cuenta que influyen una gran cantidad de factores que no dependen del profesional o de la técnica que utilicemos como son: La duración media es de 2 años y medio.",
    },
  ],
  "odontologia-digital": [
    {
      pregunta: "¿Qué es la Odontología Digital?",
      respuesta: "La odontología digital es mucho más que tecnología: es una nueva forma de entender la salud bucodental. Cada diagnóstico, decisión y tratamiento se apoya en datos objetivos, imágenes precisas y herramientas que nos permiten planificar con exactitud y anticipar los resultados. Sustituimos los métodos tradicionales —como las incómodas impresiones con pastas o los modelos de escayola— por sistemas digitales que garantizan precisión, agilidad y comodidad.",
    },
    {
      pregunta: "¿La odontología digital es más cara que la tradicional?",
      respuesta: "Aunque la inversión en tecnología es alta, los procesos digitales optimizan los tiempos y los recursos, lo que a menudo se traduce en tratamientos con una relación coste-beneficio muy favorable y sin sorpresas en el presupuesto.",
    },
    {
      pregunta: "¿Realmente no se usan las pastas de impresión?",
      respuesta: "Correcto. Con el escáner intraoral iTero Lumina, obtenemos un modelo 3D de tu boca de forma rápida, limpia y cómoda, eliminando por completo la necesidad de las pastas de impresión tradicionales.",
    },
    {
      pregunta: "¿Puedo ver cómo quedará mi sonrisa antes de iniciar el tratamiento?",
      respuesta: "¡Sí! Gracias a nuestras simulaciones 3D en vídeo, podemos mostrarte una predicción muy realista del resultado final de tu tratamiento de ortodoncia o estética dental desde la primera visita.",
    },
    {
      pregunta: "¿Los tratamientos digitales son más rápidos?",
      respuesta: "Sí, la tecnología digital agiliza muchas fases del tratamiento. Desde el diagnóstico hasta la fabricación de piezas con impresoras 3D en la clínica, reducimos los tiempos de espera y el número de visitas necesarias.",
    },
  ],
  "periodoncia": [
    {
      pregunta: "¿Qué es la gingivitis y la periodontitis?",
      respuesta: "La periodontitis o enfermedad periodontal, también conocida como piorrea, es una enfermedad infecciosa, producida por bacterias que afectan a los tejidos alrededor del diente, que son la encía, el ligamento periodontal y el hueso. La enfermedad comienza con un estado inicial de inflamación de la encía con sangrado de ésta que se llama gingivitis.",
    },
    {
      pregunta: "¿Por qué tengo periodontitis?",
      respuesta: "Las causas de la enfermedad periodontal son múltiples, y nuestro equipo está formado para su correcto diagnóstico y así poder tratar la enfermedad con eficacia.",
    },
    {
      pregunta: "¿Se cura la periodontitis?",
      respuesta: "La periodontitis en una enfermedad que se puede tratar, que podemos curarla y que debemos mantener una vigilancia para que no se vuelva a producir. Los objetivos del tratamiento es desinfectar la encía, dejándola libre de bacterias, modificar los tejidos para facilitar una limpieza correcta que nos permita mantener nuestro estado de salud, una formación en las técnicas de cepillado, y establecer unas pautas de revisión para tener controlada nuestra salud oral a lo largo del tiempo.",
    },
    {
      pregunta: "¿En qué consiste el tratamiento de la periodontitis?",
      respuesta: "El principal objetivo de la periodoncia es la eliminación del sarro y la desinfección de las bacterias que provoca la enfermedad. Para ello se realiza un diagnóstico preciso radiográfico, fotográfico y un mapeado que cuantifica la destrucción de tejido que hemos sufrido, mediante un periodontograma.",
    },
  ],
  "radiologia-dental-3d": [
    {
      pregunta: "¿Cuánta cantidad de radiación se recibe con un CBCT DENTAL?",
      respuesta: "La unidad de radiación, se mide en microsleverts, por el mero hecho de habitar en la tierra, todos los seres vivos del planeta recibimos un mínimo de radiación equivalente a 6 microsleverts (radiación cósmica o radiación de fondo). En la siguiente tabla se puede comprobar los distintos tipos de radiografías, TAC CBCT 3D y sus radiaciones. Podemos observar que el CBCT, o TAC DENTAL 3D emite la misma radiación que dos ortopantomografías (radiografía de toda la boca 2D).",
    },
  ],
};
