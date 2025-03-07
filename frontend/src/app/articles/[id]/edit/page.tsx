'use client';
import ArticleForm from "../../../../components/form/ArticleForm";
import type { Article } from "../../../../utils/type";
import { article, p } from "framer-motion/dist/types/client";
import { useParams } from "next/navigation";
import api from "../../../../utils/api";
import { useEffect, useState } from "react";

const Page = () => {
    const {id} = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    
    const fetchArticle = async () => {
        await api
        .get(`articles/${id}/`)
        .json<Article>()
        .then(async (resp: Article) => {setArticle(resp)})
        .catch((err: any) => console.log("error while fetching article", err));
    };
    
    useEffect(() => {
        fetchArticle();
    }, [id])

    return (
        <div className="">
            {article ? (
                <ArticleForm fill={article}/>
            ) : (
                <p className="">loading ...</p>
            )}
        </div>
    );
}


export default Page;