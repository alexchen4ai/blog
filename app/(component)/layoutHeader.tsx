'use client'

import { Typography } from "antd";
import Image from "next/image";
import cn from "classnames";
import { usePathname, useRouter } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/article" },
  { label: "Thinking", path: "/news" },
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const LayoutHeader = () => {
  const navigation = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const isHome = pathname === "/";

  // Close mobile menu on route change
  useEffect(() => {
    setTimeout(() => {
      setMenuOpen(false);
    }, 100);
  }, [pathname]);

  // Sync scrolled state when navigating to home (e.g. from another page with preserved scroll)
  useEffect(() => {
    if (pathname === "/") {
      const threshold = typeof window !== "undefined" ? 2 * window.innerHeight : 1600;
      setScrolled(scrollY.get() > threshold);
    } else {
      setScrolled(false);
    }
  }, [pathname, scrollY]);

  // On home page only: switch to white header when scrolled to the third screen (past 2 viewport heights)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (pathname === "/") {
      const threshold = typeof window !== "undefined" ? 2 * window.innerHeight : 1600;
      setScrolled(latest > threshold);
    }
  });

  // Non-home: always white bg. Home: white bg from bottom, so use black text from start
  const shouldShowWhiteBg = !isHome || scrolled || menuOpen;
  const useLightText = false; // always dark text (bottom bg is white now)

  return (
    <>
      <motion.div
        className={cn(
          "px-[16px] md:px-[80px] mx-auto h-[60px] md:h-[80px] flex items-center fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          shouldShowWhiteBg
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* Bottom gradient fade */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[8px] translate-y-full pointer-events-none transition-opacity duration-500",
            shouldShowWhiteBg ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: shouldShowWhiteBg
              ? "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
          }}
        />
        {/* Logo */}
        <motion.div
          className="flex items-center gap-[8px] flex-1 cursor-pointer"
          onClick={() => navigation.push('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-[4px]">
            <Image src="/home/icon.svg" width={37} height={37} alt="logo" />
          </div>
          <Typography className={cn("!text-[14px] md:!text-[16px] font-[600] transition-colors duration-500", useLightText ? "!text-white" : "!text-black")}>
            ALEX CHEN&apos;S BLOG
          </Typography>
        </motion.div>

        {/* Desktop Nav items */}
        <div className="hidden md:flex items-center gap-[24px]">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <motion.div
                key={item.label}
                onClick={() => navigation.push(item.path)}
                className={cn(
                  'cursor-pointer hover:text-[#D25F3D] transition-colors duration-500 relative',
                  isActive ? 'text-[#D25F3D]' : useLightText ? 'text-white/70' : 'text-[#000000]'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#D25F3D] rounded-full"
                    layoutId="activeNavAlex"
                    style={{ translateX: "-50%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex md:hidden flex-col justify-center items-center w-[32px] h-[32px] gap-[5px] bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className={cn("block w-[18px] h-[2px] rounded-full transition-colors duration-300", useLightText && !menuOpen ? "bg-white" : "bg-black")}
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className={cn("block w-[18px] h-[2px] rounded-full transition-colors duration-300", useLightText && !menuOpen ? "bg-white" : "bg-black")}
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className={cn("block w-[18px] h-[2px] rounded-full transition-colors duration-300", useLightText && !menuOpen ? "bg-white" : "bg-black")}
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-[60px] z-40 bg-white/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="flex flex-col items-center gap-[32px] pt-[60px]">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <motion.div
                    key={item.label}
                    onClick={() => {
                      navigation.push(item.path);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'cursor-pointer text-[18px] font-[500] transition-colors duration-300',
                      isActive ? 'text-[#D25F3D]' : 'text-[#333]'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08, ease }}
                  >
                    {item.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LayoutHeader;
