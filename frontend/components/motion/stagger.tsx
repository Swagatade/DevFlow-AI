"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { staggerContainer } from "@/lib/motion";

export function Stagger({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.18, margin: "0px 0px -12% 0px" }}
      variants={staggerContainer}
      className={cn(className)}
      {...props}
    />
  );
}
