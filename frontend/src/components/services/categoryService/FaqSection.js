"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "lucide-react";

const FaqItem = ({ faq, index, isOpen, toggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4 bg-white dark:bg-gray-800/50"
    >
      <button
        className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => toggle(index)}
      >
        <h3 className="font-medium text-lg text-gray-900 dark:text-white">
          {faq.question}
        </h3>

        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-blue-500/30 dark:border-blue-400/30">
          {isOpen ? (
            <MinusIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <PlusIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 justify-smart">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection({
  faqs = [],
  title = "Frequently Asked Questions",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {title}
        <span className="block mx-auto mt-2 h-[4px] w-2/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
        

      </motion.h2>

      <div>
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            index={index}
            isOpen={openIndex === index}
            toggle={toggleFaq}
          />
        ))}
      </div>
    </div>
  );
}
