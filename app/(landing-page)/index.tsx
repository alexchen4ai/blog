"use client";

import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { Divider, Typography } from "antd";
import dynamic from "next/dynamic";
import { FadeIn } from "../(component)/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import "./index.css";
import ProjectSection from "./(project)";

// Dynamic import to avoid SSR issues with Three.js/WebGL
const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});
const Beams = dynamic(() => import("@/components/Beams"), { ssr: false });

const LandingPage = () => {
  const [particleOpacity, setParticleOpacity] = useState(1);

  // Refs for scroll tracking
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero parallax
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero parallax transforms — more dramatic for visible effect
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -200]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.8], [1, 0.85]);
  const heroBlurVal = useTransform(heroProgress, [0, 0.6], [0, 20]);
  const heroFilterBlur = useTransform(heroBlurVal, (v) => `blur(${v}px)`);
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 100]); // image goes DOWN (parallax depth)
  const heroImageScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroImageOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <div
        ref={heroRef}
        className="relative w-full h-[100vh] flex items-center overflow-clip mt-[-80px] pt-[80px]"
        onMouseEnter={() => setParticleOpacity(1)}
        onMouseLeave={() => setParticleOpacity(0)}
      >
        {/* Antigravity particles */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-[1.5s] ease-out"
          style={{ width: "100%", height: "100%", opacity: particleOpacity }}
        >
          <div style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
            <Antigravity
              count={390}
              magnetRadius={4}
              ringRadius={4}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={1}
              lerpSpeed={0.1}
              color="#707070"
              autoAnimate={false}
              particleVariance={1}
              rotationSpeed={0}
              depthFactor={1}
              pulseSpeed={3}
              particleShape="box"
              fieldStrength={4}
            />
          </div>
        </div>

        {/* Background video */}
        <video
          className="absolute inset-0 z-0 pointer-events-none w-full h-full object-cover"
          src={assetPath("/home/hreo_back.mp4")}
          autoPlay
          loop
          muted
          playsInline
        />

        <div
          className="h-[100%] w-[100vw]"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 20, 20, 0.00) 37.69%, #141414 100%), var(--gray-13, #141414)",
          }}
        >
          <div className="flex flex-col  justify-center max-w-[1440px] mx-auto absolute inset-0 z-[2] pointer-events-none px-[16px] md:px-[84px] pt-[120px] pb-[80px]">
            <div className="flex gap-[24px]">
              {/* Left text — entrance animation + scroll parallax */}
              <motion.div
                className="flex-4 flex-shrink-0 flex items-center"
                style={{
                  y: heroTextY,
                  opacity: heroTextOpacity,
                  scale: heroScale,
                  filter: heroFilterBlur,
                }}
              >
                <div className="flex flex-col gap-[10px]">
                  {/* Staggered title lines */}
                  <div style={{ lineHeight: "1.1" }}>
                    {["ALEX CHEN"].map((line, i) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, y: 40, rotateX: -15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + i * 0.15,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <Typography
                          className="!text-[80px] font-[700]"
                          style={{
                            // color: "rgba(255, 255, 255, 0.6)",
                            color: "#000000",
                            lineHeight: "1.1",
                          }}
                        >
                          {line}
                        </Typography>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.8,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Typography className="!text-[22px] font-[600]">
                      RESEARCHER. FOUNDER. BUILDER.
                    </Typography>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right avatar — gentle fade-in + subtle slide up */}
              <motion.div
                className="flex-2 flex-shrink-0 pointer-events-auto"
                style={{
                  y: heroImageY,
                  opacity: heroImageOpacity,
                  scale: heroImageScale,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <div className="person_avatar overflow-hidden p-2">
                  <Image
                    src="/home/person_avatar.png"
                    alt=""
                    width={500}
                    height={500}
                    className="w-full rounded-xl"
                  />
                </div>
                {/* <TiltedCard
                  imageSrc="/home/person_avatar.png"
                  altText="person_avatar"
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={false}
                /> */}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-[40px] left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-[8px]"
          style={{ opacity: heroTextOpacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-transparent to-white/40" />
          <span className="text-[12px] text-white/40 tracking-[2px] uppercase">
            Scroll
          </span>
        </motion.div>
      </div>

      {/* ── Section 2: Entrance animation ── */}
      <div className="relative h-[100vh] overflow-hidden" style={{ backgroundImage: `url('${assetPath("/home/section_2_back.png")}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Beams background — vertical */}
        {/* <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={2.5}
            beamHeight={18}
            beamNumber={10}
            lightColor="#b8b8b8"
            speed={2}
            noiseIntensity={2.25}
            scale={0.2}
            rotation={0}
          />
        </div> */}

        <div className="container relative z-10 h-full flex flex-col items-center justify-center">
          {/* Headline */}
          {/* <motion.div
            className="text-center mb-[60px]"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Typography className="!text-[#fcfcfc] !text-[22px] font-[600]">
              Greetings! I’m an AI researcher and startup founder in Silicon
              Valley. Previously, I pursued a PhD at Stanford University,
              delving into numerical simulation and artificial intelligence
              research. Now, I am building an AI agent company called Nexa AI.
            </Typography>
          </motion.div> */}

          <motion.div
            className="text-left max-w-[500px] mx-auto flex flex-col gap-[40px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Typography className=" !text-[22px] font-[600]">
              Greetings! I’m an AI researcher and startup founder in Silicon
              Valley. Previously, I pursued a PhD at Stanford University,
              delving into numerical simulation and artificial intelligence
              research. Now, I am building Nexa AI, focusing on the on-device AI.
            </Typography>
            <Typography className="!text-[22px] font-[600]">
              In this space, I aim to share my journey in academia and industry,
              providing insights into cutting-edge research and practical
              applications of AI and machine learning.
            </Typography>
            <Typography className="!text-[22px] font-[600]">
              If you want to contact me, feel free to send a mail at this
              address.
            </Typography>
            <motion.div
              className="flex items-center gap-[12px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Image
                className="cursor-pointer"
                src="/home/icon_twitter.svg"
                width={20}
                height={20}
                alt="twitter"
              />
              <Image
                className="cursor-pointer"
                src="/home/icon_linkedin.svg"
                width={20}
                height={20}
                alt="linkedin"
              />
              <Image
                className="cursor-pointer"
                src="/home/icon_github.svg"
                width={20}
                height={20}
                alt="github"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Credits section ── */}
      {/* <div >
        <motion.div
          className="container-small pt-[40px] md:pt-[80px] pb-[64px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Divider className="!my-[40px] !mb-[40px] md:!mb-[80px]" />
          <FadeIn direction="up" distance={20}>
            <div className="flex items-center gap-[8px]">
              <Image
                src={assetPath("/home/icon.svg")}
                width={30}
                height={30}
                alt="avatar_bg"
              />
              <Typography className="!text-[18px] font-[400]">
                Credits
              </Typography>
            </div>
          </FadeIn>
          <FadeIn direction="up" distance={16} delay={0.1}>
            <ul className="pl-[12px] mt-[24px] list-none pl-5 [&>li]:relative [&>li]:pl-4 [&>li]:before:content-[''] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.65em] [&>li]:before:w-1.5 [&>li]:before:h-1.5 [&>li]:before:rounded-full [&>li]:before:bg-[#999999]">
              <li>
                <Typography className="!text-[14px] md:!text-[18px] font-[500] pl-[12px]">
                  Emojis used in figures are designed by{" "}
                  <span className="underline cursor-pointer decoration-[#D25F3D] hover:text-[#D25F3D] transition-colors duration-300">
                    OpenMoji
                  </span>
                  , the open-source emoji and icon project. License:{" "}
                  <span className="underline cursor-pointer decoration-[#D25F3D] hover:text-[#D25F3D] transition-colors duration-300">
                    CC BY-SA 4.0
                  </span>
                  .
                </Typography>
              </li>
              <li className="mt-[12px]">
                <Typography className="!text-[14px] md:!text-[18px] font-[500] pl-[12px]">
                  Vector icons are provided by Streamline
                  (https://streamlinehq.com). License:{" "}
                  <span className="underline cursor-pointer decoration-[#D25F3D] hover:text-[#D25F3D] transition-colors duration-300">
                    CC BY-SA 4.0
                  </span>
                  .
                </Typography>
              </li>
            </ul>
          </FadeIn>
        </motion.div>
      </div> */}
      <div className="container-small pt-[40px] md:pt-[80px] pb-[0]">
        <Divider />
      </div>
      <ProjectSection />
    </div>
  );
};

export default LandingPage;
