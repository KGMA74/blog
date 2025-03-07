// components/ArticleForm.tsx
"use client";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HiCloudUpload } from "react-icons/hi";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { Article, Tag } from "../../utils/type";
import Image from "next/image";
import Editor from "../Editor";
import TagSelector from "../TagSelector";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaHandPaper } from "react-icons/fa";
import { useRetrieveUserQuery } from "../../redux/features/authApiSlice";

const ArticleForm: React.FC<{
  fill?: Article;
}> = ({ fill }) => {
  const router = useRouter();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [title, setTitle] = useState(fill?.title || '');
  const [content, setContent] = useState(fill?.content);
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(
    fill?.tags.map((tag) => tag.name) || []
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title || "");
    formData.append("content", content || "");
    tags.forEach((tag) => formData.append("tags", tag)); // Django attend une liste
    if (image) {
      formData.append("image", image);
    }

    try {
      let resp: Article;
      if (!fill) {
        // Création d'un nouvel article
        resp = await api
          .post("articles/", {
            body: formData,
          })
          .json<Article>();
      } else {
        // Mise à jour d'un article existant
        resp = await api
          .patch(`articles/${fill?.id}/`, {
            body: formData,
          })
          .json<Article>();
      }

      toast.success(
        fill ? "Article updated successfully" : "Article created successfully"
      );
      router.push(`/articles/${resp.id}/`);
    } catch (error) {
      toast.error("Error while submitting the article");
      console.error(error);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const resp = await api.get("tags").json<Tag[]>();
      setAvailableTags(resp.map((tag) => tag.name));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  return (
    <div className="mx-auto py-6 px-[100px]">
      <h1 className="text-4xl font-bold mb-8">
        {fill ? "Editer un article" : "Ajouter un article"}
      </h1>

      <form onSubmit={handleSubmit} className="">
        {/* Champ Titre */}
        <div className="flex gap-7 pb-6 mb-6 items-center border-b justify-between">
          <label className="font-medium mb-2 md:text-2xl" htmlFor="title">
            Tire de l'article
          </label>
          <input
            type="text"
            maxLength={98}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-[80%]"
            id="title"
            required
          />
        </div>

        <div className="flex gap-7 pb-6 mb-6 items-center border-b justify-between">
          <label htmlFor="themes" className="font-medium mb-2 text-2xl">
            Themes
          </label>
          <TagSelector
            tags={availableTags}
            selectedTags={tags}
            setSelectedTags={setTags}
            className={
              "p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-[80%]"
            }
            id={"themes"}
          />
        </div>

        {/* Upload d'image */}
        <div className="flex gap-7 pb-6 mb-6 items-center border-b justify-between">
          <label className="font-medium mb-2 md:text-2xl" htmlFor="image">
            Image d'illustration
          </label>
          <div className="flex w-[80%] border p-2 rounded-md justify-center items-center">
            <div className="relative w-[140px] h-[140px]">
              <Image
                src={
                  fill?.image || "default-image.png"
                }
                alt="illustration"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                priority
              />
            </div>

            <div
              {...getRootProps()}
              className="rounded-md  cursor-pointer flex-1 flex items-center ml-5"
            >
              <input {...getInputProps()} />
              {image ? (
                <p className="text-green-600">{image.name}</p>
              ) : (
                <p className="text-gray-500">
                  <HiCloudUpload size={32} />
                  Cliquez pour choisir ou glissez et déposez
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Champ Commerce */}
        <div className="flex items-start justify-between">
          <label htmlFor="font-medium mb-2 md:text-2xl">Bio</label>
          <Editor value={content} setValue={setContent} />
        </div>

        <button
          type="submit"
          className="w-full border bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-400 flex items-center justify-center mt-12"
        >
          Publier l'article
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;
