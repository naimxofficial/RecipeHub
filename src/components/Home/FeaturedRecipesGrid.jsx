"use client";

import { motion } from "motion/react";
import FeaturedRecipeCard from "./FeaturedRecipeCard";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedRecipesGrid({ recipes }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {recipes.map((recipe) => (
        <motion.div key={recipe.id} variants={item}>
          <FeaturedRecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </motion.div>
  );
}