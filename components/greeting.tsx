import { motion } from "framer-motion";
import Link from "next/link";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
      key="overview"
    >
      {/* Clean centered text for mobile and desktop */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl text-center"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to Criterion
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-base text-zinc-500 md:text-xl text-center mt-2"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Get Answers from the{" "}
        <Link
          href="/quran/search"
          className="text-zinc-700 dark:text-zinc-300 hover:underline"
        >
          Quran
        </Link>{" "}
        and{" "}
        <Link
          href="/hadith/search"
          className="text-zinc-700 dark:text-zinc-300 hover:underline"
        >
          Sunnah
        </Link>
      </motion.div>
    </div>
  );
};
