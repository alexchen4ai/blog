'use client'

import { PenLine } from "lucide-react";
import HomeGroup from "../(component)/group";
import { articleList } from "../../(articles)/list";
import { ArticleItem } from "../../(component)/articleItem";

const ProjectSection = () => {
    const recentBlogs = articleList
        .filter((a) => a.group === "Blog")
        .slice(0, 3);

    return (
        <div className="container-small py-[40px] md:py-[80px] flex flex-col gap-[24px] md:gap-[40px]">
            <HomeGroup moreText="All Posts" icon={<PenLine size={18} />} title="Recent Blog Posts" moreLink="/article">
                <div className="flex flex-col gap-[30px] md:gap-[50px] pt-[16px]">
                    {recentBlogs.map((a) => (
                        <ArticleItem key={a.id} article={a} />
                    ))}
                </div>
            </HomeGroup>
        </div>
    );
}

export default ProjectSection;
