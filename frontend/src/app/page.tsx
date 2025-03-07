"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroText from "../components/HeroText";
import { motion } from "framer-motion";
import Image from "next/image";
import api from "../utils/api";
import DOMPurify from "dompurify";

import SearchBar from "../components/SearchBar";
import formatDate from "../utils/formatDate";

import type { postType, Article, Tag } from "../utils/type";
import TagComponant from "../components/Tag";
import TagFilter from "../components/TagFilter";

const Home = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTags, setSetlectedTags] = useState<Tag[]>([]);
  const [tagUpdated, setTagUpdated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    const tagsFilter =
      selectedTags.length > 0
        ? "&tags=" + selectedTags.map((tag) => tag.name).join("&tags=")
        : "";

    setLoading(true);
    // alert(tagsFilter)
    const endpoint = searchQuery.trim()
      ? `search/?q=${searchQuery}` + tagsFilter
      : tagsFilter
      ? "search/?q=" + tagsFilter
      : "articles";

    await api
      .get(endpoint)
      .json<Article[]>()
      .then((resp) => {
        setArticles(resp);
        setLoading(false);      })
      .catch((err) => console.log("======================", err));
  };

  const updateSelectedTags = (tags: Tag[]) => {
    if (tagUpdated) {
      setTagUpdated(false);
      return tags;
    }
    return null;
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchArticles();
    }, 500); // Attendre 500ms après la dernière frappe
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    fetchArticles();
  }, [selectedTags]);

  return (
    <div className="flex gap-2">
      {/* Main content area */}
      <main className="flex-grow border-r min-h-[50vh] max-h-[90vh] overflow-auto">
        <div className="px-5 md:px-10 lg:px-[100px]">
          <div className="flex justify-between items-center my-4">
            <h1 className="text-3xl font-semibold">Blog</h1>
            <div className="flex-grow flex justify-center">
              <div className="w-full max-w-lg">
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>
          </div>

          <HeroText />

          {/* Affichage des tags sélectionnés */}
          <div className="flex gap-2 flex-wrap my-2 min-h-[40px] cursor-pointer">
            {selectedTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-200 text-black rounded-full"
                onClick={() => {
                  setSetlectedTags(
                    selectedTags.filter((t) => t.name !== tag.name)
                  );
                  setTagUpdated(true);
                }}
              >
                {tag.name}
                <span className="ml-2 text-red-500 text-xl">x</span>
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <Link href={`articles/${article.id}`} key={index}>
                  {/* <motion.div
                  initial={{ opacity: 0, y: 20 }} // Apparition avec un léger décalage vers le bas
                  animate={{ opacity: 1, y: 0 }} // Animation vers la position normale
                  transition={{ duration: 0.5, ease: "easeOut" }} // Transition fluide
                  whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }} // Effet hover
                  className="border rounded-lg flex flex-col md:flex-row-reverse p-5 gap-4 shadow-md h-auto cursor-pointer"
                > */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                    }}
                    className="border rounded-lg p-5 flex flex-col md:flex-row-reverse gap-4 shadow-md cursor-pointer"
                  >
                    <div className="flex-1 flex justify-center items-center rounded-lg border p-1">
                      <div className="relative w-[200px] h-[200px]">
                        <Image
                          src={
                            article.image ||
                            "/default-image.png"
                          }
                          alt="illustration"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                          priority
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:w-2/3 p-4 rounded-lg gap-3">
                      <div className="flex justify-between w-full items-center p-2 border-b">
                        <h1 className="text-2xl md:text-3xl font-bold">
                          {article.title}
                        </h1>
                        <span className="text-gray-500 text-xs md:text-sm">
                          {formatDate(article.created_at)}
                        </span>
                      </div>

                      {/* Contenu */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            article.content.length > 255
                              ? article.content.slice(0, 255) + "..."
                              : article.content
                          ),
                        }}
                        className="p-3 text-sm md:text-base leading-relaxed"
                      />

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 m-2">
                        {article.tags.map((tag, index) => (
                          <TagComponant
                            name={tag.name}
                            description={tag.description}
                            key={index}
                          />
                        ))}
                      </div>
                      {/* </div> */}
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className=" flex items-center justify-center">
                Aucun article
              </div>
            )}
          </div>
        </div>
      </main>

      {/* <aside className="w-full md:w-1/3 p-4 h-fit md:sticky top-4 border-l bg-white shadow-sm"> */}
      <aside className="w-[50%] md:block p-4 h-screen sticky top-0 mr-2">
        <h1 className="text-center">Recherchez par themes</h1>
        <TagFilter
          onSelect={setSetlectedTags}
          updateFrom={updateSelectedTags(selectedTags)}
        />
      </aside>
    </div>
  );
};

export default Home;
