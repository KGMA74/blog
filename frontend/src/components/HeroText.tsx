"use client";
import { motion } from "framer-motion";

const HeroText = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Départ avec opacité 0 et décalage vers le bas
      animate={{ opacity: 1, y: 0 }} // Animation vers une opacité 1 et position normale
      transition={{ duration: 1, ease: "easeOut" }} // Transition fluide
      className="text-center text-2xl md:text-3xl font-semibold text-gray-800 mt-10"
    >
      Acquerez de nouvelles connaissances et laissez-vous inspirer par des articles sur la tech rediges par des experts et des professionnels de la programmation, du design, du devops, et bien d'autres domaines connexes
    </motion.div>
  );
};

export default HeroText;