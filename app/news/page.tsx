'use client'

import { useMemo } from "react";
import { Tabs } from "antd";
import PageContainer from "../(component)/pageContainer";
import { ArticleItem } from "../(component)/articleItem";
import { articleList } from "../(articles)/list";

const NewsPage = () => {
    const articlesByGroup = useMemo(
        () => articleList.filter((a) => a.group === "Thinking"),
        []
    );

    const tags = useMemo(() => {
        const set = new Set(articlesByGroup.map((a) => a.tag));
        return Array.from(set).sort();
    }, [articlesByGroup]);

    const tabItems = useMemo(() => {
        const allTab = {
            key: "all",
            label: "All",
            children: (
                <div className="flex flex-col gap-[30px] md:gap-[60px] pt-[40px] md:pt-[80px]">
                    {articlesByGroup.map((a) => (
                        <ArticleItem key={a.id} article={a} />
                    ))}
                </div>
            ),
        };
        const tagTabs = tags.map((tag) => {
            const filtered = articlesByGroup.filter((a) => a.tag === tag);
            return {
                key: tag,
                label: tag,
                children: (
                    <div className="flex flex-col gap-[30px] md:gap-[60px] pt-[40px] md:pt-[80px]">
                        {filtered.map((a) => (
                            <ArticleItem key={a.id} article={a} />
                        ))}
                    </div>
                ),
            };
        });
        return [allTab, ...tagTabs];
    }, [articlesByGroup, tags]);

    return (
        <PageContainer title="Thinking">
            <Tabs items={tabItems} />
        </PageContainer>
    );
};

export default NewsPage;
