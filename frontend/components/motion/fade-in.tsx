"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";

export function FadeIn({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.18, margin: "0px 0px -12% 0px" }}
      variants={fadeUp}
      className={cn(className)}
      {...props}
    />
  );
}
