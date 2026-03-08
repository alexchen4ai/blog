'use client'

import { FileText } from "lucide-react";
import Link from "next/link";
import { articleList, type IArticleInfo } from "../(articles)/list";

// Group articles by tag, only include Article group
function groupByTag(articles: IArticleInfo[]): Map<string, IArticleInfo[]> {
  const map = new Map<string, IArticleInfo[]>();
  for (const a of articles) {
    if (a.group !== "Blog") continue;
    const list = map.get(a.tag) ?? [];
    list.push(a);
    map.set(a.tag, list);
  }
  return map;
}

interface ArticleSideMenuProps {
  /** Current active article id */
  activeId?: string;
}

export function ArticleSideMenu({ activeId }: ArticleSideMenuProps) {
  const grouped = groupByTag(articleList);

  return (
    <aside
      className="hidden xl:block w-[220px] flex-shrink-0 sticky top-[100px]"
      aria-label="Article navigation"
    >
      <nav className="flex flex-col gap-[20px]">
        {Array.from(grouped.entries()).map(([tag, articles]) => (
          <div key={tag} className="flex flex-col gap-[8px]">
            <div className="text-[#333] text-[14px] font-[600]">{tag}</div>
            <div className="flex flex-col gap-[4px]">
              {articles.map((article) => {
                const isActive = article.id === activeId;
                return (
                  <Link
                    key={article.id}
                    href={`/details?id=${article.id}`}
                    className={`
                      group/item flex items-center gap-[8px] text-[14px] font-[400] py-[4px] px-0
                      transition-colors duration-200 rounded-[4px] -mx-[4px] px-[4px]
                      ${isActive
                        ? "text-[#DB805F]"
                        : "text-[#676767] hover:text-[#333]"
                      }
                    `}
                  >
                    <FileText
                      size={16}
                      className={`flex-shrink-0 ${isActive ? "text-[#DB805F]" : "text-[#999] group-hover/item:text-[#333]"}`}
                    />
                    <span
                      className="line-clamp-2 break-words"
                      style={{ wordBreak: "break-word" }}
                    >
                      {article.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
