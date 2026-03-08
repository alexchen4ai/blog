'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { assetPath } from "@/lib/assetPath";
import { Tag, Typography } from "antd";
import { motion } from "framer-motion";
import type { IArticleInfo } from "../../(articles)/list";

const ease = [0.25, 0.1, 0.25, 1] as const;

// Format createdAt "2026-02-11" -> "Feb · 2026"
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mon = months[parseInt(month || "1", 10) - 1] || "Jan";
  return `${mon} · ${year}`;
}

interface ArticleItemProps {
  article: IArticleInfo;
}

export const ArticleItem = ({ article }: ArticleItemProps) => {
  const router = useRouter();
  return (
    <motion.div
      className="flex flex-col md:flex-row gap-[16px] md:gap-[50px] cursor-pointer group pb-[20px] md:pb-0 border-b border-[#F0F0F0] md:border-b-0 last:border-b-0"
      onClick={() => router.push(`/details?id=${article.id}`)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ x: 4 }}
    >
      <div className="hidden md:block w-[140px] flex-shrink-0">
        <div className="flex items-center gap-[12px]">
          <motion.div
            className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(210, 95, 61, 0.24)" }}
            whileHover={{ scale: 1.3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#DB805F" }} />
          </motion.div>
          <Typography className="text-[#676767] !text-[16px] font-[400]">
            {formatDate(article.createdAt)}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full md:w-0 min-w-0">
        <div className="flex-1 flex gap-[12px] mb-[12px] md:mb-[24px]">
          <div className="flex-1 flex flex-col gap-[6px] md:gap-[12px] w-full min-w-0">
            <Typography className="text-[#000000] !text-[15px] md:!text-[16px] font-[700] group-hover:text-[#D25F3D] transition-colors duration-300">
              {article.title}
            </Typography>
            <Typography
              className="text-[#000000] !text-[14px] md:!text-[16px] font-[400]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {article.description}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <Tag className="!py-[4px] !text-[12px] !mb-0">{article.tag}</Tag>
          <Typography className="md:hidden text-[#999] !text-[12px] font-[400]">
            {formatDate(article.createdAt)}
          </Typography>
        </div>
      </div>
      {article.cover && (
        <div className="flex-shrink-0 overflow-hidden rounded-[4px]">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease }}
          >
            <Image src={assetPath(article.cover)} width={200} height={100} alt={article.title} className="w-full md:w-[200px] h-auto" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
