"use client";

import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { Input, Typography } from "antd";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, IconBounce, AnimatedDivider } from "./motion";
import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as const;

export const LayoutFooter = () => {
  return (
    <div className="container-small">
      <AnimatedDivider className="!mt-[40px] !mb-[40px] md:!mb-[80px] h-[1px] bg-[#E6E4D9]" />
      <FadeIn direction="up" distance={24} duration={0.6}>
        {/* breaks out of container-small to achieve full viewport width */}
        <div
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            backgroundImage: `url('${assetPath("/home/section_3_back.png")}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col gap-[16px] pb-[160px] max-w-[750px] mx-auto px-[16px] ">
            <div className="h-[93px]" />
            <Typography className="!text-[16px] md:!text-[18px] font-[400]">
              Receive my updates
            </Typography>
            <Typography className="!text-[14px] md:!text-[16px]">
              Follow me via email,{" "}
              <span className="underline cursor-pointer hover:text-[#D25F3D] transition-colors duration-300">
                Twitter
              </span>
              ,{" "}
              <span className="underline cursor-pointer hover:text-[#D25F3D] transition-colors duration-300">
                LinkedIn
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-[#D25F3D] transition-colors duration-300">
                Github
              </span>
            </Typography>
            <div>
              <div className="w-full md:w-[300px]">
                <motion.div whileHover={{ scale: 1.01 }} transition={{ ease }}>
                  <Input
                    placeholder="Enter your email..."
                    className="h-[44px] rounded-[4px]"
                    suffix={<ArrowUpRight size={16} />}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn direction="up" distance={16} delay={0.15}>
        <div className="flex flex-col gap-[16px] py-[24px] md:py-[36px]]">
          <div className="flex flex-col gap-[12px] md:flex-row items-start md:items-center justify-between">
            <Typography className="font-[600]">ALEX CHEN</Typography>
            <div className="flex items-center gap-[16px]">
              <IconBounce>
                <Image
                  className="cursor-pointer"
                  src={assetPath("/home/icon_twitter.svg")}
                  width={20}
                  height={20}
                  alt="twitter"
                />
              </IconBounce>
              <IconBounce>
                <Image
                  className="cursor-pointer"
                  src={assetPath("/home/icon_linkedin.svg")}
                  width={20}
                  height={20}
                  alt="linkedin"
                />
              </IconBounce>
              <IconBounce>
                <Image
                  className="cursor-pointer"
                  src={assetPath("/home/icon_github.svg")}
                  width={20}
                  height={20}
                  alt="github"
                />
              </IconBounce>
              <Typography>© 2026</Typography>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default LayoutFooter;
