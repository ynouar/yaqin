import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'About Yaqin - Quran & Hadith Powered AI Assistant',
  description: 'Learn about Yaqin, an open-source AI assistant that helps people understand Islam through authentic sources. Built with RAG technology using 6,236 Quran verses and 21,641 Hadiths from 6 major collections.',
  path: '/about',
  keywords: [
    'Islamic AI assistant',
    'Quran chatbot',
    'Hadith search',
    'Islamic education',
    'open source Islam',
    'authentic Islamic sources',
  ],
});

export default async function AboutPage() {
  const locale = await getLocale();
  const isFr = locale === 'fr';

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>{isFr ? 'À propos de Yaqin' : 'About Yaqin'}</h1>

      <p className="lead">
        {isFr
          ? "Yaqin est un assistant islamique propulsé par l'IA qui aide les gens à comprendre l'Islam à travers des sources authentiques : le Coran et les Hadiths."
          : "Yaqin is an AI-powered Islamic knowledge assistant that helps people understand Islam through authentic sources: the Quran and Hadith."}
      </p>

      <h2>{isFr ? 'Notre Mission' : 'Our Mission'}</h2>
      <p>
        {isFr
          ? "Nous croyons que comprendre l'Islam devrait être accessible à tous — que vous soyez un chercheur curieux, un nouveau musulman ou quelqu'un qui approfondit sa connaissance. Yaqin comble le fossé entre la science islamique et la technologie moderne, facilitant l'exploration du Coran et des Hadiths par la conversation naturelle."
          : "We believe that understanding Islam should be accessible to everyone—whether you're a curious seeker, a new Muslim, or someone deepening their knowledge. Yaqin bridges the gap between Islamic scholarship and modern technology, making it easy to explore the Quran and Hadith through natural conversation."}
      </p>

      <h2>{isFr ? 'Ce qui nous différencie' : 'What Makes Us Different'}</h2>

      <h3>📖 {isFr ? 'Sources Authentiques' : 'Authentic Sources'}</h3>
      <p>{isFr ? 'Chaque réponse est ancrée dans des textes islamiques vérifiés :' : 'Every answer is grounded in verified Islamic texts:'}</p>
      <ul>
        <li><strong>6 236 {isFr ? 'versets coraniques' : 'Quran verses'}</strong> - {isFr ? 'Texte arabe complet avec traductions françaises (Hamidullah) et anglaises' : 'Complete Arabic text with English translations'}</li>
        <li><strong>21 641 Hadiths</strong> - {isFr ? 'Issus de 6 grandes collections authentiques (Sahih Bukhari, Sahih Muslim, Jami at-Tirmidhi, Sunan Abi Dawud, 40 Hadiths Nawawi, Riyad as-Salihin)' : 'From 6 major authentic collections (Sahih Bukhari, Sahih Muslim, Jami` at-Tirmidhi, Sunan Abi Dawud, 40 Hadith Nawawi, Riyad as-Salihin)'}</li>
        <li>{isFr ? 'Toutes les références incluent des citations avec des liens directs vers Quran.com et Sunnah.com' : 'All references include citations with direct links to Quran.com and Sunnah.com'}</li>
      </ul>

      <h3>🔍 {isFr ? 'Recherche Sémantique (Technologie RAG)' : 'Semantic Search (RAG Technology)'}</h3>
      <p>
        {isFr
          ? <>Contrairement à la recherche par mots-clés traditionnelle, notre IA comprend le <em>sens</em> de votre question. Demandez "Que dit l'Islam sur la patience ?" et nous trouverons des versets et hadiths pertinents même s'ils ne contiennent pas le mot exact "patience".</>
          : <>Unlike traditional keyword search, our AI understands the <em>meaning</em> of your question. Ask "What does Islam say about patience?" and we'll find relevant verses and hadiths even if they don't contain the exact word "patience."</>}
      </p>
      <p>{isFr ? 'Nous utilisons une RAG avancée avec :' : 'We use advanced Retrieval Augmented Generation (RAG) with:'}</p>
      <ul>
        <li>{isFr ? 'Embeddings vectoriels pour la similarité sémantique' : 'Vector embeddings for semantic similarity'}</li>
        <li>{isFr ? 'Recherche hybride (sémantique + mots-clés)' : 'Hybrid search (semantic + keyword matching)'}</li>
        <li>{isFr ? 'Récupération contextuelle — versets adjacents pour une compréhension correcte' : 'Contextual retrieval - surrounding verses for proper understanding'}</li>
      </ul>

      <h3>🎯 {isFr ? 'Compréhension Contextuelle' : 'Contextual Understanding'}</h3>
      <p>
        {isFr
          ? "Nous ne récupérons pas des versets isolés. Pour les résultats du Coran, nous incluons les versets environnants pour éviter les interprétations hors contexte. Pour les Hadiths, nous privilégions les narrations Sahih (les plus authentiques)."
          : "We don't just retrieve isolated verses. For Quran results, we include surrounding verses to prevent out-of-context interpretations. For Hadiths, we default to Sahih (most authentic) narrations."}
      </p>

      <h3>🌐 {isFr ? 'Open Source' : 'Open Source'}</h3>
      <p>
        {isFr
          ? "Yaqin est entièrement open source. Notre code, nos sources de données et notre méthodologie sont transparents et disponibles pour révision, contribution et apprentissage."
          : "Yaqin is completely open source. Our code, data sources, and methodology are transparent and available for review, contribution, and learning."}
      </p>
      <p>
        <a
          href="https://github.com/ynouar/yaqin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          {isFr ? 'Voir sur GitHub →' : 'View on GitHub →'}
        </a>
      </p>

      <h2>{isFr ? 'Comment ça fonctionne' : 'How It Works'}</h2>
      <p>{isFr ? 'Lorsque vous posez une question :' : 'When you ask a question:'}</p>
      <ol>
        <li>{isFr ? "Notre IA analyse votre question pour en comprendre le sens" : "Our AI analyzes your question to understand its meaning"}</li>
        <li>{isFr ? "Nous cherchons parmi 6 236 versets coraniques et 21 641 hadiths issus de 6 grandes collections par similarité sémantique" : "We search through 6,236 Quran verses and 21,641 Hadiths from 6 major collections using semantic similarity"}</li>
        <li>{isFr ? "Les passages les plus pertinents sont récupérés avec leur contexte" : "The most relevant passages are retrieved with proper context"}</li>
        <li>{isFr ? "Notre IA génère une réponse ancrée dans ces sources authentiques" : "Our AI generates a response grounded in these authentic sources"}</li>
        <li>{isFr ? "Chaque affirmation est citée avec des références vérifiables" : "Every claim is cited with references you can verify"}</li>
      </ol>
      <p>
        <Link href="/how-it-works">{isFr ? 'En savoir plus sur notre technologie →' : 'Learn more about our technology →'}</Link>
      </p>

      <h2>{isFr ? 'Notre Approche' : 'Our Approach'}</h2>
      <p>
        {isFr
          ? <>Yaqin agit comme un <em>Da'i</em> (inviteur à l'Islam) bienveillant et savant :</>
          : <>Yaqin acts as a knowledgeable and compassionate <em>Da'i</em> (invitor to Islam):</>}
      </p>
      <ul>
        <li><strong>{isFr ? 'Humble' : 'Humble'}</strong> - {isFr ? "Nous reconnaissons nos limites et encourageons à consulter les savants pour les questions complexes" : "We acknowledge limitations and encourage seeking scholars for complex issues"}</li>
        <li><strong>{isFr ? 'Authentique' : 'Authentic'}</strong> - {isFr ? "Uniquement des versets coraniques vérifiés et des hadiths Sahih" : "Only verified Quran verses and Sahih hadiths"}</li>
        <li><strong>{isFr ? 'Contextuel' : 'Contextual'}</strong> - {isFr ? "Jamais de citations hors contexte" : "Never out-of-context quotes"}</li>
        <li><strong>{isFr ? 'Respectueux' : 'Respectful'}</strong> - {isFr ? "Patient et accueillant pour toutes les questions" : "Patient and welcoming to all questions"}</li>
        <li><strong>{isFr ? 'Focalisé' : 'Focused'}</strong> - {isFr ? <>Accent sur les fondamentaux (<em>aqaid</em>) et la guidance (<em>hidaya</em>)</> : <>Emphasize fundamentals (<em>aqaid</em>) and guidance (<em>hidaya</em>)</>}</li>
      </ul>

      <h2>{isFr ? 'Pour qui ?' : "Who We're For"}</h2>
      <ul>
        <li><strong>{isFr ? 'Non-musulmans curieux' : 'Curious non-Muslims'}</strong> {isFr ? "qui apprennent sur l'Islam" : "learning about Islam"}</li>
        <li><strong>{isFr ? 'Nouveaux musulmans' : 'New Muslims'}</strong> {isFr ? "cherchant des repères" : "seeking guidance"}</li>
        <li><strong>{isFr ? 'Étudiants' : 'Students'}</strong> {isFr ? "étudiant les textes islamiques" : "studying Islamic texts"}</li>
        <li><strong>{isFr ? 'Musulmans' : 'Muslims'}</strong> {isFr ? "approfondissant leur compréhension" : "deepening their understanding"}</li>
        <li><strong>{isFr ? 'Chercheurs' : 'Researchers'}</strong> {isFr ? "explorant la connaissance islamique" : "exploring Islamic knowledge"}</li>
      </ul>

      <h2>{isFr ? 'Technologie' : 'Technology'}</h2>
      <p>{isFr ? 'Construit avec des technologies IA et web modernes :' : 'Built with modern AI and web technologies:'}</p>
      <ul>
        <li><strong>Frontend:</strong> Next.js 15, React 19, TypeScript</li>
        <li><strong>IA:</strong> Gemini 2.5 Flash, Gemini Embeddings, Vercel AI SDK</li>
        <li><strong>{isFr ? 'Recherche' : 'Search'}:</strong> PostgreSQL {isFr ? 'avec' : 'with'} pgvector (HNSW index)</li>
        <li><strong>{isFr ? 'Hébergement' : 'Hosting'}:</strong> Vercel, Neon Database</li>
      </ul>
      <p>
        <Link href="/developers">{isFr ? 'Lire la documentation technique →' : 'Read our technical documentation →'}</Link>
      </p>

      <h2>{isFr ? 'Commencer' : 'Get Started'}</h2>
      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        <Link href="/" className="rounded-lg border p-4 transition-colors hover:bg-muted">
          <h3 className="mb-2 font-semibold">{isFr ? 'Démarrer le chat' : 'Start Chatting'}</h3>
          <p className="text-sm text-muted-foreground">
            {isFr ? 'Posez vos questions et obtenez des réponses ancrées dans le Coran & les Hadiths' : 'Ask questions and get answers grounded in Quran & Hadith'}
          </p>
        </Link>
        <Link href="/search" className="rounded-lg border p-4 transition-colors hover:bg-muted">
          <h3 className="mb-2 font-semibold">{isFr ? 'Rechercher par thème' : 'Search by Theme'}</h3>
          <p className="text-sm text-muted-foreground">
            {isFr ? "Trouvez des versets et hadiths sur n'importe quel sujet" : 'Find verses and hadiths about any topic'}
          </p>
        </Link>
        <Link href="/quran" className="rounded-lg border p-4 transition-colors hover:bg-muted">
          <h3 className="mb-2 font-semibold">{isFr ? 'Parcourir le Coran' : 'Browse Quran'}</h3>
          <p className="text-sm text-muted-foreground">
            {isFr ? 'Lisez les 114 sourates en arabe et en français' : 'Read all 114 Surahs with Arabic & English'}
          </p>
        </Link>
      </div>

      <h2>{isFr ? 'Des questions ?' : 'Questions?'}</h2>
      <p>
        {isFr ? (
          <>Consultez notre <Link href="/faq">Foire Aux Questions</Link> ou explorez notre <Link href="/developers">documentation technique</Link>.</>
        ) : (
          <>Check our <Link href="/faq">Frequently Asked Questions</Link> or explore our <Link href="/developers">developer documentation</Link>.</>
        )}
      </p>
    </div>
  );
}
