'use client'

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tag, Typography } from "antd";
import PageContainer from "../(component)/pageContainer";
import MarkdownRender from "../(component)/markdownRender";
import { Utterances } from "../(component)/utterances";
import { ArticleSideMenu } from "../(component)/articleSideMenu";
import { articleList } from "../(articles)/list";
import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as const;

/** Wrapper with left sidebar for article switching, hidden when width < xl (1280px) */
function DetailsLayout({
  activeId,
  children,
}: {
  activeId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-[40px] md:pt-[80px] flex gap-[40px] xl:gap-[60px] items-start">
      <ArticleSideMenu activeId={activeId} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Format createdAt "2026-02-11" -> "Feb 11 2026"
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mon = months[parseInt(month || "1", 10) - 1] || "Jan";
  return `${mon} ${day} ${year}`;
}

const DetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const article = id ? articleList.find((a) => a.id === id) : undefined;

  if (!article) {
    return (
      <DetailsLayout activeId={undefined}>
        <PageContainer>
          <motion.div
            className="flex flex-col items-center justify-center py-[120px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <Typography className="!text-[24px] font-[500] text-[#676767]">
              {id ? "Article not found" : "No article selected"}
            </Typography>
          </motion.div>
        </PageContainer>
      </DetailsLayout>
    );
  }

  return (
    <DetailsLayout activeId={article.id}>
      <PageContainer>
      <div className="flex flex-col gap-[12px] md:gap-[16px] mb-[30px] md:mb-[60px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Typography className="font-[700] !text-[#DB805F] !text-[14px] md:!text-[16px]">
            {formatDate(article.createdAt)}
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <Typography className="!text-[24px] md:!text-[32px] font-[700] !text-[#333]">
            {article.title}
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease }}
        >
          <Tag className="!py-[4px] !text-[12px]">{article.tag}</Tag>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <MarkdownRender markdown={article.content} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
      >
        <Utterances />
      </motion.div>
    </PageContainer>
    </DetailsLayout>
  );
};

// Wrap with Suspense boundary for useSearchParams
const DetailsPage = () => {
  return (
    <Suspense fallback={
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-[120px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography className="!text-[20px] text-[#999]">Loading...</Typography>
          </motion.div>
        </div>
      </PageContainer>
    }>
      <DetailsContent />
    </Suspense>
  );
};

export default DetailsPage;
