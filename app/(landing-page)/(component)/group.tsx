'use client'

import { Button, Col, Row, Typography } from "antd";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "../../(component)/motion";

interface HomeGroupProps {
    icon: React.ReactNode;
    title: string;
    moreText: string;
    moreLink: string;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const HomeGroup = (props: React.PropsWithChildren<HomeGroupProps>) => {
    const router = useRouter();
    return (
        <FadeIn direction="up" distance={30} duration={0.6}>
            <div className="flex flex-col gap-[24px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[6px]">
                        <motion.div
                            whileHover={{ rotate: 20, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {props.icon}
                        </motion.div>
                        <Typography className="!text-[18px] font-[400]">
                            {props.title}
                        </Typography>
                    </div>
                    <div>
                        <motion.div whileHover={{ x: 4 }} transition={{ ease }}>
                            <Button onClick={() => router.push(props.moreLink)}>
                                {props.moreText}
                                <div className="bg-[#F8E7DC] w-[20px] h-[20px] flex items-center justify-center cursor-pointer">
                                    <ArrowRight size={16} />
                                </div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <div>{props.children}</div>
            </div>
        </FadeIn>
    )
}


export const ProjectItem = () => {
    const router = useRouter();
    return (
        <StaggerContainer staggerDelay={0.1}>
            <Row gutter={[12, 24]}>
                {[...Array(3)].map((_, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                            <StaggerItem>
                                <ScaleOnHover scale={1.03}>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => router.push('/details')}
                                    >
                                        <div className="flex-1 flex flex-col gap-[16px]">
                                            {/* Image with zoom on hover */}
                                            <div className="overflow-hidden rounded-[4px]">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.4, ease }}
                                                >
                                                    <Image src={assetPath("/home/image_project.png")} width={600} height={400} alt="project" />
                                                </motion.div>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography className="!text-[16px] font-[700]">
                                                    Nexa SDK
                                                </Typography>
                                                <Typography className="!text-[14px] font-[400]">
                                                    Duis eu velit tempus erat egestas.
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </ScaleOnHover>
                            </StaggerItem>
                    </Col>
                ))}
            </Row>
        </StaggerContainer>
    )
}

export const ProjectList = () => {
    const items = [
        "NexaQuant: Hardware-aware Model Compression with 100%+ Accuracy Recovery",
        "EmbedNeural: On-Device Multimodal Search, Designed for Apple & Qualcomm NPU",
        "Introducing Hyperlink 1.0: Your On-Device AI Super Assistant",
        "NexaQuant: Hardware-aware Model Compression with 100%+ Accuracy Recovery",
    ];

    return (
        <StaggerContainer className="flex flex-col gap-[8px]" staggerDelay={0.08}>
            {items.map((title, idx) => (
                <StaggerItem key={idx}>
                    <motion.div
                        className="flex items-center gap-[16px] cursor-pointer group"
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.25, ease }}
                    >
                        <div className="w-[80px] md:w-[100px] flex-shrink-0">
                            <Typography className="!text-[14px] md:!text-[16px] font-[400] text-[#676767]">
                                Nov · 2025
                            </Typography>
                        </div>
                        <Typography className="line-clamp-1 underline text-[#222222] text-[15px] md:text-[18px] font-[500] group-hover:text-[#D25F3D] transition-colors duration-300">
                            {title}
                        </Typography>
                    </motion.div>
                </StaggerItem>
            ))}
        </StaggerContainer>
    )
}

export default HomeGroup;
