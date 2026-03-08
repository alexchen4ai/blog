'use client'

import { Typography } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageContainerProps extends React.PropsWithChildren {
    title?: string;
    titleExtra?: React.ReactNode;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const PageContainer = (props: PageContainerProps) => {
    return (
        <div className="container-small">
            <div className="flex flex-col gap-[16px] ">
                {
                    props.title && (
                        <>
                            <div className="flex items-center justify-between">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, ease }}
                                >
                                    <Typography className="!text-[24px] font-[600]">
                                        {props.title}
                                    </Typography>
                                </motion.div>
                                {props.titleExtra && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1, ease }}
                                    >
                                        {props.titleExtra}
                                    </motion.div>
                                )}
                            </div>
                            {/* Animated decorative divider */}
                            <motion.div
                                className="flex items-center gap-[6px]"
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, ease }}
                            >
                                <div className="bg-[#EEEEEE] flex-1 h-[1px]"></div>
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.5, ease }}
                                >
                                    <Image src="/project/polygon.svg" width={7} height={6} alt="polygon" />
                                </motion.div>
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6, ease }}
                                >
                                    <Image src="/project/polygon.svg" width={7} height={6} alt="polygon" />
                                </motion.div>
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.7, ease }}
                                >
                                    <Image src="/project/polygon.svg" width={7} height={6} alt="polygon" />
                                </motion.div>
                                <div className="bg-[#EEEEEE] flex-1 h-[1px]"></div>
                            </motion.div>
                        </>
                    )
                }
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
            >
                {props.children}
            </motion.div>
        </div>
    )
}

export default PageContainer;
