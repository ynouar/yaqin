import { getLocale } from "next-intl/server";
import { createFAQSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/metadata";

const faqsEn = [
  {
    question: "What is Yaqin?",
    answer:
      "Yaqin is an open-source AI-powered assistant that helps you understand Islam through authentic sources. We use advanced semantic search across 6,236 Quran verses and 21,641 authentic Hadiths from 6 major collections to provide accurate, contextual answers to your questions about Islamic teachings.",
  },
  {
    question: "Is the information authentic?",
    answer:
      "Yes. All Quran verses are from verified translations, and Hadiths are primarily from Sahih (authentic) collections including Sahih Bukhari and Sahih Muslim. Every response includes proper citations with direct links to original sources at Quran.com and Sunnah.com.",
  },
  {
    question: "How does the AI work?",
    answer:
      "We use Retrieval Augmented Generation (RAG) technology. When you ask a question, our AI searches through Islamic texts using semantic understanding (not just keywords), retrieves the most relevant verses and Hadiths, and generates a response grounded in these authentic sources.",
  },
  {
    question: "Can I learn about Islam here if I'm not Muslim?",
    answer:
      "Absolutely! Yaqin is designed for everyone curious about Islam—whether you're exploring for the first time, considering converting, or seeking to deepen your understanding. We provide clear explanations with proper context and authentic sources.",
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes, Yaqin is completely free and open source. We believe Islamic knowledge should be accessible to everyone without barriers.",
  },
  {
    question: "How do I ask a question?",
    answer:
      "Simply type your question in natural language on the chat interface. Ask anything like 'What does Islam say about patience?' or 'Tell me about prayer in Islam.' The AI will search relevant sources and provide a comprehensive answer with citations.",
  },
  {
    question: "What makes Yaqin different from other Islamic websites?",
    answer:
      "Unlike traditional Islamic websites where you browse through content, Yaqin lets you ask questions naturally and get AI-powered answers grounded in authentic sources. We also provide surrounding context for verses (not just isolated quotes) and use semantic search to understand the meaning of your question.",
  },
  {
    question: "Can I search for specific verses or topics?",
    answer:
      "Yes! Use our search page to find Quran verses and Hadiths by theme or topic. You can also browse all 114 Surahs in the Quran section. The AI automatically searches these sources when you ask questions in the chat.",
  },
  {
    question: "Who created Yaqin?",
    answer:
      "Yaqin is an open-source project built by developers passionate about making Islamic knowledge accessible through modern technology. The code is available on GitHub for anyone to review, contribute to, or learn from.",
  },
  {
    question: "How accurate are the translations?",
    answer:
      "We use established English translations for the Quran and Hadiths from recognized Islamic sources. However, we always recommend consulting with knowledgeable scholars for important religious questions, as translations can never fully capture the depth of the original Arabic.",
  },
  {
    question: "Can I use this for religious rulings (fatwa)?",
    answer:
      "While Yaqin provides authentic Islamic sources, it should not be used as the sole basis for religious rulings. For specific Islamic legal questions, please consult qualified scholars. Yaqin is best used for learning, exploring, and understanding Islamic teachings.",
  },
  {
    question: "Is my conversation private?",
    answer:
      "Yes. Your chat conversations are private by default and are not indexed by search engines or shared publicly. Please avoid sharing sensitive personal information in chats.",
  },
];

const faqsFr = [
  {
    question: "Qu'est-ce que Yaqin ?",
    answer:
      "Yaqin est un assistant islamique open source propulsé par l'IA qui vous aide à comprendre l'Islam à travers des sources authentiques. Nous utilisons une recherche sémantique avancée sur 6 236 versets coraniques et 21 641 hadiths authentiques issus de 6 grandes collections pour fournir des réponses précises et contextualisées.",
  },
  {
    question: "Les informations sont-elles authentiques ?",
    answer:
      "Oui. Tous les versets du Coran proviennent de traductions vérifiées, et les hadiths sont principalement issus de collections Sahih (authentiques) comme Sahih Bukhari et Sahih Muslim. Chaque réponse inclut des citations avec des liens directs vers les sources originales sur Quran.com et Sunnah.com.",
  },
  {
    question: "Comment fonctionne l'IA ?",
    answer:
      "Nous utilisons la technologie RAG (Retrieval Augmented Generation). Lorsque vous posez une question, notre IA recherche dans les textes islamiques en utilisant la compréhension sémantique (pas seulement des mots-clés), récupère les versets et hadiths les plus pertinents, et génère une réponse ancrée dans ces sources authentiques.",
  },
  {
    question: "Puis-je apprendre l'Islam ici si je ne suis pas musulman ?",
    answer:
      "Absolument ! Yaqin est conçu pour toute personne curieuse de l'Islam — que vous l'exploriez pour la première fois, envisagiez de vous convertir, ou souhaitiez approfondir votre compréhension. Nous fournissons des explications claires avec un contexte approprié et des sources authentiques.",
  },
  {
    question: "Est-ce gratuit ?",
    answer:
      "Oui, Yaqin est entièrement gratuit et open source. Nous croyons que la connaissance islamique doit être accessible à tous, sans barrières.",
  },
  {
    question: "Comment poser une question ?",
    answer:
      "Tapez simplement votre question en langage naturel dans l'interface de chat. Demandez par exemple 'Que dit l'Islam sur la patience ?' ou 'Parle-moi de la prière en Islam.' L'IA recherchera dans les sources pertinentes et fournira une réponse complète avec citations.",
  },
  {
    question: "En quoi Yaqin est-il différent des autres sites islamiques ?",
    answer:
      "Contrairement aux sites islamiques traditionnels où vous parcourez du contenu, Yaqin vous permet de poser des questions naturellement et d'obtenir des réponses IA ancrées dans des sources authentiques. Nous fournissons également le contexte des versets (pas seulement des citations isolées) et utilisons la recherche sémantique pour comprendre le sens de votre question.",
  },
  {
    question: "Puis-je rechercher des versets ou des sujets spécifiques ?",
    answer:
      "Oui ! Utilisez notre page de recherche pour trouver des versets coraniques et des hadiths par thème ou sujet. Vous pouvez aussi parcourir les 114 sourates dans la section Coran. L'IA recherche automatiquement ces sources lorsque vous posez des questions dans le chat.",
  },
  {
    question: "Qui a créé Yaqin ?",
    answer:
      "Yaqin est un projet open source construit par des développeurs passionnés par la diffusion de la connaissance islamique à travers la technologie moderne. Le code est disponible sur GitHub pour que chacun puisse le consulter, y contribuer ou en apprendre.",
  },
  {
    question: "Quelle est la fiabilité des traductions ?",
    answer:
      "Nous utilisons des traductions reconnues pour le Coran et les hadiths. Cependant, nous recommandons toujours de consulter des savants compétents pour les questions religieuses importantes, car les traductions ne peuvent jamais capturer pleinement la profondeur de l'arabe original.",
  },
  {
    question: "Puis-je l'utiliser pour des avis religieux (fatwa) ?",
    answer:
      "Bien que Yaqin fournisse des sources islamiques authentiques, il ne doit pas être utilisé comme seul fondement pour des avis religieux. Pour des questions de droit islamique spécifiques, veuillez consulter des savants qualifiés. Yaqin est mieux utilisé pour apprendre et comprendre les enseignements islamiques.",
  },
  {
    question: "Ma conversation est-elle privée ?",
    answer:
      "Oui. Vos conversations sont privées par défaut et ne sont pas indexées par les moteurs de recherche ni partagées publiquement. Évitez de partager des informations personnelles sensibles dans le chat.",
  },
];

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions - Yaqin",
  description:
    "Common questions about Yaqin, Islam, the Quran, and how our AI-powered Islamic knowledge assistant works.",
  path: "/faq",
  keywords: [
    "Yaqin FAQ",
    "Islamic AI questions",
    "Quran search help",
    "Hadith search help",
    "learn Islam",
    "Islamic chatbot",
  ],
});

export default async function FAQPage() {
  const locale = await getLocale();
  const isFr = locale === "fr";
  const faqs = isFr ? faqsFr : faqsEn;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFAQSchema(faqsEn)),
        }}
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{isFr ? "Questions Fréquentes" : "Frequently Asked Questions"}</h1>
        <p className="lead">
          {isFr
            ? "Tout ce que vous devez savoir sur Yaqin et l'apprentissage de l'Islam grâce à notre assistant IA."
            : "Everything you need to know about Yaqin and learning Islam through our AI-powered assistant."}
        </p>

        <div className="space-y-8 mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold">
            {isFr ? "Vous avez encore des questions ?" : "Still have questions?"}
          </h2>
          <p className="mb-4">
            {isFr
              ? "Posez-les directement dans le chat — notre IA peut vous aider à répondre à des questions spécifiques sur les enseignements islamiques."
              : "Try asking in the chat interface - our AI can help answer specific questions about Islamic teachings."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {isFr ? "Commencer le chat" : "Start Chatting"}
          </a>
        </div>
      </div>
    </>
  );
}
