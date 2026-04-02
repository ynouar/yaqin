/**
 * Topic Pages Configuration
 * 
 * Each topic has:
 * - slug: URL-friendly identifier
 * - title: Display name
 * - titleAr: Arabic name (optional)
 * - query: Search query for RAG (optimized for semantic search)
 * - description: Brief explanation (1-2 sentences)
 * - keywords: SEO keywords
 * - icon: Emoji for visual appeal (optional)
 * - priority: For sitemap (0.1-1.0)
 */

export interface Topic {
  slug: string;
  title: string;
  titleFr?: string;
  titleAr?: string;
  query: string;
  description: string;
  descriptionFr?: string;
  keywords: string[];
  icon?: string;
  priority: number;
  category?: string;
  categoryFr?: string;
  relatedTopics?: string[];
}

export const TOPICS: Record<string, Topic> = {
  // Tier 1: Core Practices (5 Pillars + Faith)
  prayer: {
    slug: "prayer",
    title: "Prayer (Salah)",
    titleFr: "La Prière (Salah)",
    titleAr: "الصلاة",
    query: "prayer salah namaz sujood ruku prostration worship",
    description: "The second pillar of Islam and the connection between a believer and Allah. Discover verses and hadiths about establishing prayer, its importance, and its spiritual benefits.",
    descriptionFr: "Le deuxième pilier de l'Islam et le lien entre le croyant et Allah. Découvrez les versets et hadiths sur l'importance de la prière et ses bienfaits spirituels.",
    keywords: ["prayer in Islam", "Salah", "namaz", "Islamic prayer", "how to pray", "prayer importance"],
    icon: "🤲",
    priority: 0.9,
    category: "Core Practices",
    categoryFr: "Pratiques Fondamentales",
    relatedTopics: ["patience", "gratitude", "trust-in-allah"],
  },

  fasting: {
    slug: "fasting",
    title: "Fasting (Ramadan)",
    titleFr: "Le Jeûne (Ramadan)",
    titleAr: "الصيام",
    query: "fasting ramadan sawm iftar suhoor abstinence self-control",
    description: "The spiritual practice of fasting during Ramadan, the holy month. Learn about the wisdom of fasting, its rules, and its transformative power in developing self-discipline and empathy.",
    descriptionFr: "La pratique spirituelle du jeûne durant le Ramadan, le mois sacré. Apprenez la sagesse du jeûne, ses règles et son pouvoir transformateur sur la discipline et l'empathie.",
    keywords: ["Ramadan fasting", "sawm", "Islamic fasting", "Ramadan", "fasting rules"],
    icon: "🌙",
    priority: 0.9,
    category: "Core Practices",
    categoryFr: "Pratiques Fondamentales",
    relatedTopics: ["patience", "gratitude", "forgiveness"],
  },

  charity: {
    slug: "charity",
    title: "Charity (Zakat)",
    titleFr: "L'Aumône (Zakat)",
    titleAr: "الزكاة والصدقة",
    query: "charity zakat sadaqah giving poor needy generosity alms",
    description: "The obligation to give to those in need. Explore teachings about mandatory charity (Zakat), voluntary giving (Sadaqah), and the spiritual purification that comes from generosity.",
    descriptionFr: "L'obligation de donner aux nécessiteux. Explorez les enseignements sur la Zakat obligatoire, la Sadaqah volontaire et la purification spirituelle par la générosité.",
    keywords: ["Zakat", "charity in Islam", "sadaqah", "Islamic giving", "helping poor"],
    icon: "💚",
    priority: 0.85,
    category: "Core Practices",
    categoryFr: "Pratiques Fondamentales",
    relatedTopics: ["gratitude", "justice", "family"],
  },

  hajj: {
    slug: "hajj",
    title: "Pilgrimage (Hajj)",
    titleFr: "Le Pèlerinage (Hajj)",
    titleAr: "الحج",
    query: "hajj pilgrimage mecca kaaba umrah sacred journey",
    description: "The sacred pilgrimage to Mecca, the fifth pillar of Islam. Understand the rites, significance, and spiritual dimensions of this once-in-a-lifetime obligation.",
    descriptionFr: "Le pèlerinage sacré à La Mecque, cinquième pilier de l'Islam. Comprenez les rites, la signification et les dimensions spirituelles de cette obligation unique dans une vie.",
    keywords: ["Hajj", "pilgrimage to Mecca", "Umrah", "Kaaba", "Islamic pilgrimage"],
    icon: "🕋",
    priority: 0.85,
    category: "Core Practices",
    categoryFr: "Pratiques Fondamentales",
    relatedTopics: ["prayer", "faith", "prophets"],
  },

  faith: {
    slug: "faith",
    title: "Faith (Tawhid)",
    titleFr: "La Foi (Tawhid)",
    titleAr: "التوحيد",
    query: "tawhid oneness allah monotheism belief faith creed",
    description: "The fundamental belief in the Oneness of Allah. Explore the core of Islamic faith, the concept of Tawhid, and what it means to truly believe.",
    descriptionFr: "La croyance fondamentale en l'Unicité d'Allah. Explorez le cœur de la foi islamique, le concept de Tawhid et ce que signifie croire véritablement.",
    keywords: ["Tawhid", "Islamic faith", "oneness of Allah", "monotheism", "belief in Allah"],
    icon: "☝️",
    priority: 0.85,
    category: "Core Practices",
    categoryFr: "Pratiques Fondamentales",
    relatedTopics: ["prophets", "trust-in-allah", "day-of-judgment"],
  },

  // Tier 2: Moral & Spiritual Virtues
  patience: {
    slug: "patience",
    title: "Patience (Sabr)",
    titleFr: "La Patience (Sabr)",
    titleAr: "الصبر",
    query: "patience sabr endurance steadfastness perseverance trials hardship",
    description: "The virtue of remaining steadfast through life's trials. Discover how patience is rewarded, its different forms, and why it's considered half of faith.",
    descriptionFr: "La vertu de rester ferme à travers les épreuves de la vie. Découvrez comment la patience est récompensée et pourquoi elle est considérée comme la moitié de la foi.",
    keywords: ["patience in Islam", "Sabr", "endurance", "dealing with hardship", "perseverance"],
    icon: "🌱",
    priority: 0.85,
    category: "Spiritual Virtues",
    categoryFr: "Vertus Spirituelles",
    relatedTopics: ["trust-in-allah", "gratitude", "prayer"],
  },

  gratitude: {
    slug: "gratitude",
    title: "Gratitude (Shukr)",
    titleFr: "La Gratitude (Shukr)",
    titleAr: "الشكر",
    query: "gratitude shukr thankfulness alhamdulillah appreciation blessings",
    description: "The practice of being thankful to Allah for all blessings. Learn why gratitude is the key to contentment and how it transforms our relationship with the Creator.",
    descriptionFr: "La pratique d'être reconnaissant envers Allah pour toutes Ses grâces. Apprenez pourquoi la gratitude est la clé de la sérénité et comment elle transforme notre relation avec le Créateur.",
    keywords: ["gratitude in Islam", "Shukr", "being thankful", "Alhamdulillah", "thankfulness"],
    icon: "🙏",
    priority: 0.8,
    category: "Spiritual Virtues",
    categoryFr: "Vertus Spirituelles",
    relatedTopics: ["patience", "prayer", "trust-in-allah"],
  },

  forgiveness: {
    slug: "forgiveness",
    title: "Forgiveness & Mercy",
    titleFr: "Le Pardon & la Miséricorde",
    titleAr: "المغفرة والرحمة",
    query: "forgiveness mercy repentance tawbah pardon compassion",
    description: "Allah's infinite mercy and the path to forgiveness. Understand the beauty of divine forgiveness, the power of repentance, and how to forgive others.",
    descriptionFr: "La miséricorde infinie d'Allah et le chemin vers le pardon. Comprenez la beauté du pardon divin, la puissance du repentir et comment pardonner aux autres.",
    keywords: ["forgiveness in Islam", "Allah's mercy", "repentance", "Tawbah", "seeking forgiveness"],
    icon: "💫",
    priority: 0.9,
    category: "Spiritual Virtues",
    categoryFr: "Vertus Spirituelles",
    relatedTopics: ["patience", "humility", "prayer"],
  },

  "trust-in-allah": {
    slug: "trust-in-allah",
    title: "Trust in Allah (Tawakkul)",
    titleFr: "La Confiance en Allah (Tawakkul)",
    titleAr: "التوكل",
    query: "trust allah tawakkul reliance faith dependence certainty",
    description: "Complete reliance on Allah while taking action. Learn about the balance between effort and trust, and how Tawakkul brings peace to the heart.",
    descriptionFr: "La confiance totale en Allah tout en agissant. Apprenez l'équilibre entre l'effort et la remise à Allah, et comment le Tawakkul apporte la paix au cœur.",
    keywords: ["Tawakkul", "trust in Allah", "reliance on God", "faith in Allah", "Islamic trust"],
    icon: "🤝",
    priority: 0.8,
    category: "Spiritual Virtues",
    categoryFr: "Vertus Spirituelles",
    relatedTopics: ["faith", "patience", "prayer"],
  },

  humility: {
    slug: "humility",
    title: "Humility (Tawadu)",
    titleFr: "L'Humilité (Tawadu)",
    titleAr: "التواضع",
    query: "humility tawadu modesty pride arrogance meekness",
    description: "The virtue of lowering oneself before Allah and others. Discover teachings about humility, the danger of pride, and the beauty of modesty.",
    descriptionFr: "La vertu de s'abaisser devant Allah et devant les autres. Découvrez les enseignements sur l'humilité, le danger de l'orgueil et la beauté de la modestie.",
    keywords: ["humility in Islam", "Tawadu", "modesty", "avoiding pride", "Islamic character"],
    icon: "🕊️",
    priority: 0.75,
    category: "Spiritual Virtues",
    categoryFr: "Vertus Spirituelles",
    relatedTopics: ["gratitude", "patience", "knowledge"],
  },

  // Tier 3: Life & Relationships
  family: {
    slug: "family",
    title: "Family & Parents",
    titleFr: "Famille & Parents",
    titleAr: "الأسرة والوالدين",
    query: "family parents children rights responsibilities kindness respect",
    description: "The sacred bonds of family in Islam. Learn about the rights of parents, the duties toward children, and the importance of maintaining family ties.",
    descriptionFr: "Les liens sacrés de la famille en Islam. Apprenez les droits des parents, les devoirs envers les enfants et l'importance de maintenir les liens familiaux.",
    keywords: ["family in Islam", "parents rights", "children in Islam", "family bonds", "respecting parents"],
    icon: "👨‍👩‍👧‍👦",
    priority: 0.85,
    category: "Life & Relationships",
    categoryFr: "Vie & Relations",
    relatedTopics: ["marriage", "justice", "knowledge"],
  },

  marriage: {
    slug: "marriage",
    title: "Marriage & Spouse",
    titleFr: "Mariage & Époux",
    titleAr: "النكاح والزوجية",
    query: "marriage nikah spouse rights responsibilities love mercy companionship",
    description: "The sacred union between husband and wife. Explore teachings about choosing a spouse, marital rights, love, mercy, and building a strong Islamic family.",
    descriptionFr: "L'union sacrée entre l'homme et la femme. Explorez les enseignements sur le choix d'un époux, les droits conjugaux, l'amour, la miséricorde et la famille islamique.",
    keywords: ["marriage in Islam", "nikah", "spouse rights", "Islamic marriage", "husband wife"],
    icon: "💍",
    priority: 0.85,
    category: "Life & Relationships",
    categoryFr: "Vie & Relations",
    relatedTopics: ["family", "women-in-islam", "justice"],
  },

  "women-in-islam": {
    slug: "women-in-islam",
    title: "Women in Islam",
    titleFr: "La Femme en Islam",
    titleAr: "المرأة في الإسلام",
    query: "women rights islam equality dignity honor modesty protection",
    description: "The honored status and rights of women in Islam. Understand what the Quran and Hadith actually say about women's rights, education, work, and dignity.",
    descriptionFr: "Le statut honoré et les droits de la femme en Islam. Comprenez ce que le Coran et les Hadiths disent réellement sur les droits, l'éducation et la dignité de la femme.",
    keywords: ["women in Islam", "women's rights Islam", "Islamic feminism", "hijab", "women equality"],
    icon: "👩",
    priority: 0.9,
    category: "Life & Relationships",
    categoryFr: "Vie & Relations",
    relatedTopics: ["marriage", "family", "justice"],
  },

  justice: {
    slug: "justice",
    title: "Justice & Fairness",
    titleFr: "La Justice & l'Équité",
    titleAr: "العدل",
    query: "justice fairness equality rights oppression stand truth",
    description: "The Islamic command to uphold justice for all. Learn about the importance of fairness, standing against oppression, and the accountability before Allah.",
    descriptionFr: "Le commandement islamique d'établir la justice pour tous. Apprenez l'importance de l'équité, la lutte contre l'oppression et la responsabilité devant Allah.",
    keywords: ["justice in Islam", "fairness", "equality Islam", "standing against oppression", "Islamic justice"],
    icon: "⚖️",
    priority: 0.85,
    category: "Life & Relationships",
    categoryFr: "Vie & Relations",
    relatedTopics: ["women-in-islam", "charity", "knowledge"],
  },

  knowledge: {
    slug: "knowledge",
    title: "Knowledge & Learning",
    titleFr: "La Connaissance & l'Apprentissage",
    titleAr: "العلم",
    query: "knowledge learning wisdom education seek study understanding",
    description: "The obligation to seek knowledge. Discover why learning is an act of worship, the value of wisdom, and the pursuit of beneficial knowledge.",
    descriptionFr: "L'obligation de chercher la connaissance. Découvrez pourquoi apprendre est un acte d'adoration et la valeur de la sagesse en Islam.",
    keywords: ["knowledge in Islam", "seeking knowledge", "Islamic education", "learning Islam", "wisdom"],
    icon: "📚",
    priority: 0.8,
    category: "Life & Relationships",
    categoryFr: "Vie & Relations",
    relatedTopics: ["humility", "prophets", "prayer"],
  },

  // Tier 4: Afterlife & Belief
  paradise: {
    slug: "paradise",
    title: "Paradise (Jannah)",
    titleFr: "Le Paradis (Jannah)",
    titleAr: "الجنة",
    query: "paradise jannah heaven afterlife eternal reward bliss",
    description: "The ultimate reward for believers. Explore descriptions of Paradise, its levels, pleasures, and the eternal joy promised to the righteous.",
    descriptionFr: "La récompense ultime des croyants. Explorez les descriptions du Paradis, ses degrés, ses délices et la joie éternelle promise aux justes.",
    keywords: ["Jannah", "Paradise Islam", "Islamic heaven", "afterlife reward", "eternal paradise"],
    icon: "🌸",
    priority: 0.85,
    category: "Afterlife & Belief",
    categoryFr: "Au-delà & Croyance",
    relatedTopics: ["hell", "day-of-judgment", "death"],
  },

  hell: {
    slug: "hell",
    title: "Hell (Jahannam)",
    titleFr: "L'Enfer (Jahannam)",
    titleAr: "جهنم",
    query: "hell jahannam punishment fire warning consequences sin",
    description: "The place of punishment for the wicked. Understand the reality of Hell, its levels, and the warning against actions that lead to it.",
    descriptionFr: "Le lieu de châtiment pour les injustes. Comprenez la réalité de l'Enfer, ses niveaux et l'avertissement contre les actes qui y mènent.",
    keywords: ["Jahannam", "Hell Islam", "punishment", "hellfire", "Islamic hell"],
    icon: "🔥",
    priority: 0.75,
    category: "Afterlife & Belief",
    categoryFr: "Au-delà & Croyance",
    relatedTopics: ["paradise", "day-of-judgment", "forgiveness"],
  },

  "day-of-judgment": {
    slug: "day-of-judgment",
    title: "Day of Judgment",
    titleFr: "Le Jour du Jugement",
    titleAr: "يوم القيامة",
    query: "judgment day qiyamah resurrection accountability reckoning",
    description: "The Day when all will be resurrected and judged. Learn about the signs, the reckoning, and the ultimate accountability before Allah.",
    descriptionFr: "Le Jour où tous seront ressuscités et jugés. Apprenez les signes, le compte rendu et la responsabilité ultime devant Allah.",
    keywords: ["Day of Judgment", "Qiyamah", "resurrection", "accountability", "Last Day"],
    icon: "⏰",
    priority: 0.85,
    category: "Afterlife & Belief",
    categoryFr: "Au-delà & Croyance",
    relatedTopics: ["paradise", "hell", "death"],
  },

  death: {
    slug: "death",
    title: "Death & the Hereafter",
    titleFr: "La Mort & l'Au-delà",
    titleAr: "الموت والآخرة",
    query: "death dying soul barzakh grave life after mortality",
    description: "The inevitable reality and what comes after. Understand Islamic teachings about death, the soul's journey, the grave, and preparing for the Hereafter.",
    descriptionFr: "La réalité inévitable et ce qui vient après. Comprenez les enseignements islamiques sur la mort, le voyage de l'âme, la tombe et la préparation pour l'Au-delà.",
    keywords: ["death in Islam", "life after death", "soul", "grave", "Islamic afterlife"],
    icon: "🌅",
    priority: 0.8,
    category: "Afterlife & Belief",
    categoryFr: "Au-delà & Croyance",
    relatedTopics: ["day-of-judgment", "paradise", "hell"],
  },

  prophets: {
    slug: "prophets",
    title: "Prophets & Messengers",
    titleFr: "Les Prophètes & Messagers",
    titleAr: "الأنبياء والرسل",
    query: "prophets messengers muhammad moses jesus abraham noah",
    description: "The noble messengers sent by Allah throughout history. Learn about the prophets, their missions, their struggles, and the continuity of divine guidance.",
    descriptionFr: "Les nobles messagers envoyés par Allah à travers l'histoire. Apprenez les prophètes, leurs missions, leurs épreuves et la continuité de la guidance divine.",
    keywords: ["Prophets Islam", "Muhammad", "Moses", "Jesus Islam", "messengers", "Islamic prophets"],
    icon: "✨",
    priority: 0.9,
    category: "Afterlife & Belief",
    categoryFr: "Au-delà & Croyance",
    relatedTopics: ["faith", "knowledge", "patience"],
  },
};

/**
 * Get all topic slugs for static generation
 */
export function getAllTopicSlugs(): string[] {
  return Object.keys(TOPICS);
}

/**
 * Get topic by slug
 */
export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS[slug];
}

/**
 * Get related topics
 */
export function getRelatedTopics(slug: string): Topic[] {
  const topic = TOPICS[slug];
  if (!topic?.relatedTopics) return [];
  
  return topic.relatedTopics
    .map((relatedSlug) => TOPICS[relatedSlug])
    .filter(Boolean);
}

/**
 * Get all topics sorted by priority
 */
export function getAllTopicsSorted(): Topic[] {
  return Object.values(TOPICS).sort((a, b) => b.priority - a.priority);
}
