import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  hoverScale?: number;
}

export default function HoverImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  hoverScale = 1.05,
}: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);

  return (
    <>
      {/* Original Image with Hover Effect */}
      <div
        className={`relative w-full h-full ${containerClassName}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowFullSize(true)}
      >
        <img
          src={src}
          alt={alt}
          className={`${className} cursor-pointer transition-transform duration-300`}
          style={{
            transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
          }}
        />

        {/* Hover Indicator - Always centered in visible container */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer rounded-lg pointer-events-none"
            >
              <div className="bg-white/90 dark:bg-black/90 px-4 py-2 rounded-lg shadow-lg pointer-events-none">
                <p className="text-sm font-semibold text-foreground">
                  Click to view full size
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full Size Modal */}
      <AnimatePresence>
        {showFullSize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 overflow-hidden"
            onClick={() => setShowFullSize(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setShowFullSize(false)}
              aria-label="Close full size image"
            >
              <X className="text-white" size={24} />
            </button>

            {/* Full Size Image Container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pb-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                  style={{ maxHeight: "calc(100vh - 8rem)" }}
                />
              </motion.div>
            </div>

            {/* Image Caption */}
            {alt && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-6 py-3 rounded-lg max-w-2xl z-10"
              >
                <p className="text-white text-center text-sm">{alt}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

