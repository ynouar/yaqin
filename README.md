<h1 align="center">Yaqin — Premier Assistant Islamique IA</h1>

<p align="center">
    <strong>Un Da'i (guide) augmenté par intelligence artificielle</strong> — pour guider les chercheurs de vérité avec des sources authentiques.
</p>

<p align="center">
    Ancré dans le Coran et les Hadiths authentiques. Gratuit pour toujours. Pour la face d'Allah.
</p>

<p align="center">
  <a href="#mission"><strong>Mission</strong></a> ·
  <a href="#fonctionnalités"><strong>Fonctionnalités</strong></a> ·
  <a href="#stack-technique"><strong>Stack technique</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#serveur-mcp"><strong>Serveur MCP</strong></a>
</p>
<br/>

## Mission

Yaqin existe pour rendre la connaissance islamique authentique accessible à tous — en utilisant la technologie moderne pour diffuser la guidance divine à l'humanité entière — **gratuitement, pour toujours, pour la face d'Allah seul.**

C'est une **Sadaqah Jariyah** (aumône continue) : chaque utilisateur guidé est une récompense qui se perpétue.

### Nos quatre piliers

1. **Vérité & Authenticité** — Chaque réponse est ancrée dans des sources vérifiées (Coran et Hadiths Sahih). Zéro hallucination tolérée.
2. **Fondamentaux & Clarté** — Nous nous concentrons sur les enseignements islamiques essentiels. Nous évitons les débats sectaires.
3. **Pour la face d'Allah** — Yaqin sera toujours gratuit, sans publicité, sans monétisation.
4. **Excellence technique** — Nous utilisons l'IA de pointe pour diffuser la guidance islamique efficacement.

## Ce qui différencie Yaqin

**Vision :**

- ✨ **Gratuit pour toujours** — Pas de paywall, pas de pub, pas de monétisation. Construit fi sabilillah
- 🇫🇷 **Francophone en premier** — La première plateforme d'IA islamique en français
- 📚 **Fondamentaux** — Évite les débats sectaires, se concentre sur les enseignements universellement acceptés
- 🛡️ **Confiance avant tout** — Hadiths filtrés par grade (Sahih par défaut), sources vérifiées uniquement
- 🕌 **Personnalité Da'i** — Guide bienveillant, savant, humble

**Excellence technique :**

- 🎯 **Recherche sémantique** — Requêtes en langage naturel sur 6 236 versets + 21 641 narrations
- 📖 **Récupération contextuelle** — Les meilleurs résultats incluent ±2 versets/narrations adjacents
- 🌐 **Multilingue** — Français et anglais (extensible)
- 🔗 **Citations précises** — Toutes les réponses citent les sources avec liens (Quran.com, Sunnah.com)
- ⚡ **Rapide** — Temps de réponse <150ms

## Fonctionnalités

✅ **Recherche sémantique Coran** — Posez des questions en langage naturel, obtenez les versets pertinents
✅ **Recherche sémantique Hadith** — Avec filtrage par grade et collection
✅ **Compréhension contextuelle** — Les meilleurs résultats incluent le contexte adjacent
✅ **Citations précises** — Chaque réponse cite des sources réelles avec liens hypertextes
✅ **Multilingue** — Français par défaut, anglais disponible
✅ **URLs partageables** — `/quran/search?q=patience`, `/hadith/search?q=aumone`
✅ **Streaming temps réel** — Génération progressive token par token
✅ **RAG basé sur les outils** — Le LLM décide autonomement quand récupérer du Coran/Hadith

## Stack technique

- [Next.js 16](https://nextjs.org) App Router avec React 19 & Tailwind CSS
- [Vercel AI SDK](https://ai-sdk.dev) pour l'intégration LLM et le streaming
- [Google Gemini 2.5 Flash](https://ai.google.dev) pour les réponses IA (gratuit)
- [PostgreSQL](https://neon.tech) avec [pgvector](https://github.com/pgvector/pgvector) pour la recherche vectorielle
- [Drizzle ORM](https://orm.drizzle.team) pour l'accès type-safe à la base de données
- [Google Gemini Embeddings](https://ai.google.dev) gemini-embedding-001 (768 dimensions)
- Index HNSW pour une recherche de similarité <150ms
- [Auth.js](https://authjs.dev) pour l'authentification
- Déployé sur [Vercel](https://vercel.com)

## Pipeline RAG

```
Question de l'utilisateur
    ↓
Gemini 2.5 Flash (décide quels outils utiliser)
    ↓
Sélection des outils :
  - queryQuran → 6 236 versets (top 7 pour le chat)
  - queryHadith → 21 641 hadiths de 6 collections (top 3 pour le chat)
    ↓
Recherche vectorielle (embeddings 768 dimensions)
    ↓
Enrichissement contextuel (top 3 reçoivent ±2 versets adjacents)
    ↓
Le LLM génère la réponse avec citations
    ↓
Stream temps réel vers l'utilisateur (Server-Sent Events)
```

## Données

- **6 236 versets coraniques** issus des 114 sourates
  - Texte arabe (Tanzil)
  - Traduction anglaise (Sahih International)
  - Traduction française Hamidullah (v2)
  - Embeddings 768 dimensions

- **21 641 narrations de Hadith** issues de 6 collections majeures
  - Sahih Bukhari (7 558)
  - Sahih Muslim (2 920)
  - Jami at-Tirmidhi (3 951)
  - Sunan Abi Dawud (5 274)
  - 40 Hadiths Nawawi (42)
  - Riyad as-Salihin (1 896)
  - Filtrage par grade (Sahih, Hasan, Da'if)

## Installation

### Prérequis

- Node.js 18+ et pnpm
- Base de données PostgreSQL (recommandé : [Neon](https://neon.tech) — gratuit)
- Clés API :
  - Clé Google AI Studio (Gemini — gratuit)

### Étapes

1. **Cloner le dépôt**

```bash
git clone https://github.com/ynouar/yaqin.git
cd yaqin
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` :

```bash
# Base de données
POSTGRES_URL=postgresql://...

# API Google Gemini (embeddings + LLM)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Authentification
AUTH_SECRET=  # openssl rand -base64 32

# URL du site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Activer l'extension pgvector**

```bash
npx tsx scripts/enable-pgvector.ts
```

5. **Lancer les migrations**

```bash
pnpm db:migrate
```

6. **Ingérer les données Coran** (6 236 versets + embeddings)

```bash
pnpm ingest:quran
```

7. **Ingérer les Hadiths** (21 641 narrations + embeddings)

```bash
pnpm ingest:hadith
```

8. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'application est disponible sur [localhost:3000](http://localhost:3000).

## Commandes disponibles

```bash
# Développement
pnpm dev           # Serveur de développement
pnpm build         # Build de production
pnpm start         # Serveur de production

# Base de données
pnpm db:migrate    # Appliquer les migrations
pnpm db:studio     # Interface graphique Drizzle

# Ingestion des données
pnpm ingest:quran  # Ingérer le Coran
pnpm ingest:hadith # Ingérer les Hadiths
pnpm clear:quran   # Effacer les données Coran
pnpm clear:hadith  # Effacer les données Hadith
```

## Serveur MCP

Yaqin expose ses capacités de recherche sémantique via le **Model Context Protocol (MCP)**, permettant à des assistants IA comme Claude Desktop de rechercher directement dans le Coran et les Hadiths.

```json
{
  "mcpServers": {
    "yaqin": {
      "url": "https://yaqin.app/api/mcp"
    }
  }
}
```

**Outils disponibles :**
- `search_quran` — Recherche sémantique dans 6 236 versets
- `search_hadith` — Recherche dans 21 641 hadiths authentiques
- `get_verse` — Récupérer un verset par référence (ex: "2:255")

## Structure du projet

```
yaqin/
├── app/
│   ├── (auth)/          # Authentification
│   ├── (chat)/          # Interface chat et API
│   ├── quran/           # Pages de lecture du Coran
│   ├── hadith/          # Pages Hadith
│   └── search/          # Recherche sémantique
├── lib/
│   ├── ai/
│   │   ├── embeddings.ts    # Logique RAG principale
│   │   ├── prompts.ts       # Prompt système Da'i
│   │   └── tools/           # queryQuran, queryHadith
│   └── db/
│       ├── schema.ts        # Schéma base de données
│       └── queries.ts       # Fonctions de requête
├── components/              # Composants React
├── messages/                # Traductions (fr, en, ar, ur, tr)
├── scripts/                 # Scripts d'ingestion
└── data/                    # Données sources (Coran, Hadiths)
```

## Attribution des données

- **Texte coranique** : [Tanzil.net](http://tanzil.net/) — Creative Commons Attribution 3.0
- **Traduction française** : Muhammad Hamidullah
- **Collections de Hadiths** : Sunnah.com, IslamicNetwork.com
- **Embeddings** : Google Gemini gemini-embedding-001

## Nos engagements

- ✅ **Ne jamais monétiser** la connaissance islamique
- ✅ **Toujours citer les sources** avec les références exactes
- ✅ **Ne jamais fabriquer** de versets ou de hadiths
- ✅ **Se concentrer sur les fondamentaux** — éviter les débats sectaires
- ✅ **Construire pour la communauté** — appartient à tous les musulmans

## Contribuer

Les contributions de développeurs, de savants et de membres de la communauté partageant notre mission sont les bienvenues. Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les directives.

## Licence

- **Texte coranique** : Creative Commons Attribution 3.0 ([Tanzil.net](http://tanzil.net/))
- **Données Hadith** : Sources islamiques vérifiées avec attribution appropriée
- **Code** : Voir le fichier LICENSE pour les détails

---

**« Invite au chemin de ton Seigneur par la sagesse et la belle exhortation »** — Coran 16:125

_Qu'Allah accepte ce travail et en fasse un moyen de guidance pour les chercheurs de vérité. Âmeen._
