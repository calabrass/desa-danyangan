import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const NBSP = String.fromCharCode(160);

interface RandomLetterSwapProps {
  label: string;
  staggerDuration?: number;
  transition?: Transition;
  className?: string;
  onClick?: () => void;
}

/* Hover: tiap huruf berputar 360° berurutan dari kiri ke kanan (stagger),
   lepas hover: kembali diam. Tanpa karakter acak, tanpa timer, tanpa
   remount — render hanya saat hover masuk/keluar sehingga animasi tidak
   bisa restart sendiri. */
export function RandomLetterSwap({
  label,
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring" },
  className,
  onClick,
}: RandomLetterSwapProps) {
  const [hovered, setHovered] = useState(false);
  const chars = label.split("");
  const last = chars.length - 1;

  return (
    <motion.span
      className={cn("inline-flex", className)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={false}
          animate={hovered ? { rotateY: [0, 360] } : { rotateY: 0 }}
          transition={{
            ...transition,
            delay: (hovered ? i : last - i) * staggerDuration,
          }}
        >
          {ch === " " ? NBSP : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
