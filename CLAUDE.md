# Yaqin.app — Premier LLM Islamique

## Vision
Assistant islamique augmenté par RAG qui **ne répond que sur preuves**. Chaque réponse est ancrée dans le Coran ou les Hadiths authentiques. Zéro hallucination tolérée.

## Stack technique
- **Frontend** : Next.js 14+ (App Router)
- **Base de données** : PostgreSQL + pgvector (Neon)
- **Embeddings** : Gemini text-embedding-004 (768 dimensions)
- **LLM** : Gemini 1.5 Pro / Claude (via Vercel AI SDK)
- **Streaming** : Vercel AI SDK (`useChat`)
- **Déploiement** : Vercel
- **Base ouverte** : Fork de [Criterion](https://github.com/BalajSaleem/criterion) (MIT)

## Architecture RAG
```
User Query
    → Analyse d'intention
    → Embedding de la query (Gemini)
    → Recherche vectorielle pgvector (<150ms)
        ├── Table: quran_verses (6 236 versets, arabe + traductions)
        └── Table: hadiths (21 641 narrations, 6 collections majeures)
    → Enrichissement contextuel (versets ±2 adjacents)
    → Génération avec contexte (Gemini/Claude)
    → Filtre de transparence (grade + sanad)
    → Réponse streamée avec citations hyperliées
```

## Collections de hadiths supportées
1. Sahih al-Bukhari
2. Sahih Muslim
3. Sunan Abu Dawud
4. Jami at-Tirmidhi
5. Riyad as-Salihin (Nawawi)
6. (extensible)

## Grades de hadiths
- **Sahih** (سحيح) — Authentique → Affiché par défaut
- **Hasan** (حسن) — Bon → Affiché par défaut
- **Da'if** (ضعيف) — Faible → Masqué par défaut, affichable avec avertissement clair
- **Mawdu** (موضوع) — Forgé → Jamais affiché

## Règles absolues de développement

### Git — Commits et Push
- **JAMAIS** ajouter `Co-Authored-By: Claude` ou toute signature Claude dans les commits
- **JAMAIS** push automatiquement — toujours demander confirmation explicite avant tout `git push`
- Communiquer toujours en **français** avec l'utilisateur

### Vigilance & Rigueur intellectuelle
- Ne JAMAIS affirmer quelque chose sans en être certain — vérifier avant d'asserter
- Avant de dire "Yaqin fait mieux que Criterion", vérifier sur une capture d'écran réelle
- Toujours observer attentivement les screenshots fournis par l'utilisateur avant de répondre
- En cas de doute : dire "je ne suis pas sûr" plutôt que d'inventer

### Dette technique
- Chaque modification doit être réversible et documentée
- Ne jamais contourner un problème sans noter la dette créée
- Avant toute nouvelle feature : vérifier qu'il n'y a pas de TODO/dette en attente
- Garder la liste des tâches à jour (todo list) — ne pas laisser des tâches orphelines
- Si une solution est temporaire (workaround) : la commenter avec `// TODO:` dans le code
- Revue de dette technique à chaque session avant de commencer de nouvelles features

### Intégrité des données
- Ne JAMAIS inventer ou modifier un hadith, un verset, ou une chaîne de transmission
- Tout hadith affiché DOIT inclure : collection, numéro, grade, et sanad (si disponible)
- Les citations Coran DOIVENT pointer vers quran.com (format : `https://quran.com/{sourate}/{verset}`)
- Les citations Hadith DOIVENT pointer vers sunnah.com (format : `https://sunnah.com/{collection}:{numero}`)
- Si aucune source fiable n'est trouvée → répondre honnêtement "Je n'ai pas trouvé de source fiable"

### Système de prompt
- Toujours inclure la directive : répondre uniquement à partir du contexte fourni
- Interdire explicitement au modèle de générer des hadiths de mémoire
- Ton : chaleureux, humble, savant — comme un Da'i bienveillant
- Commencer les réponses par Bismillah si approprié

### Langues
- Interface : Français + Anglais (v1)
- Traductions Coran disponibles : fr.hamidullah, en.sahih (Sahih International)
- Traductions Hadith : anglais (base Criterion), français à enrichir

## Structure du projet
```
/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── chat/               # Interface principale
│   ├── quran/              # Recherche Coran (/quran?q=...)
│   └── hadith/             # Recherche Hadith (/hadith?q=...)
├── components/             # UI components
├── lib/
│   ├── db/                 # Connexion PostgreSQL + pgvector
│   ├── embeddings/         # Client Gemini embeddings
│   ├── rag/                # Pipeline RAG (search + generation)
│   └── prompts/            # System prompts
├── scripts/
│   ├── ingest-quran.ts     # Ingestion Coran
│   └── ingest-hadith.ts    # Ingestion Hadiths
└── data/                   # Sources JSON brutes
```

## Variables d'environnement requises
```
DATABASE_URL=              # Neon PostgreSQL connection string
GEMINI_API_KEY=            # Google AI Studio
ANTHROPIC_API_KEY=         # Optionnel, si on utilise Claude
```

## Commandes clés
```bash
npm run dev                 # Dev local
npm run ingest:quran        # Ingestion Coran (6 236 versets)
npm run ingest:hadith       # Ingestion Hadiths (21 641 narrations)
npm run db:migrate          # Appliquer migrations pgvector
```

## Philosophie du projet
Ce projet est une **Sadaqah Jariyah** (aumône continue). Il est :
- **Gratuit** pour toujours, pour la face d'Allah
- **Sans publicité**, sans collecte de données
- **Open source** (MIT) pour que la communauté contribue
- Financé par des dons optionnels de la communauté

## Ce qui différencie Yaqin de Criterion
1. Chaîne de transmission (sanad) complète affichée
2. Support du français en v1
3. Filtre explicite Da'if avec double avis des savants si divergence
4. Interface Da'i : ton islamique, Bismillah, etc.
5. URLs partageables par recherche (`/quran?q=patience`)
6. Streaming temps réel
