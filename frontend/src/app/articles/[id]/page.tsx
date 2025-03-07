"use client";
import { useEffect, useState } from "react";
import { User, useRetrieveUserQuery } from "../../../redux/features/authApiSlice";
import { useParams } from "next/navigation";
import formatDate from "../../../utils/formatDate";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Article } from "../../../utils/type";
import Image from "next/image";
import api from "../../../utils/api";
import DOMPurify from "dompurify";
import {
  Share2,
  Clipboard,
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
} from "lucide-react";
import { FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { json } from "stream/consumers";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: me } = useRetrieveUserQuery();
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [votes, setVotes] = useState<{ upvote: number; downvote: number }>({
    upvote: 0,
    downvote: 0,
  });
  const [voteStatus, setVoteStatus] = useState<string | null>(null);

  const fetchArticle = async () => {
    await api
      .get(`articles/${id}/`)
      .json<Article>()
      .then(async (resp: Article) => {
        setArticle(resp);

        await api
          .get(`users/${resp.author}`)
          .json<User>()
          .then((author) => setAuthor(author))
          .catch((_) => _);

        await api
          .get(`article/${id}/votes/`)
          .json<{ upvote: number; downvote: number }>()
          .then((votes) => setVotes(votes))
          .catch((_) => _);
      })
      .catch((err: any) => console.log(err));
  };

  const deleteArticle = async () => {
    await api
      .delete(`articles/${id}/`)
      .then((_) => toast.success("article supprime avec success ..."))
      .catch((err) => toast.error(err));

    router.push("/");
  };

  const vote = async (status: string) => {
    await api.post(`vote/${id}/`, {
        json: {
          vote_type: status
        }
    })
              .json<{ upvote: number; downvote: number }>()
              .then(votes => setVotes(votes))
              .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchArticle();
  }, [id, voteStatus]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
      <aside className="flex flex-col space-y-5 pl-[200px] items-center p-[50px]">
        {/* Affichage du nombre de vues */}
        <div className="flex items-center text-gray-700">
          <FaEye className="text-blue-500 mx-2" size={25} />
          <span>{article.views}</span>
        </div>

        {/* Affichage des votes */}
        <div className="flex items-center text-gray-700">
          <FaThumbsUp
            className={`${voteStatus!=='upvote'? 'text-gray-500':'text-green-500'} mx-2`}
            onClick={(_) => vote("upvote")}
            size={25}
          />
          <span>{votes.upvote}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FaThumbsDown
            className={`${voteStatus!=='upvote'? 'text-gray-500':'text-red-500'} mx-2`}
            onClick={(_) => vote("downvote")}
            size={25}
          />
          <span>{votes.downvote}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-5 p-6 border-r min-h-[70vh] ">
        <div>
          {/* Tags and Date */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <div
                  key={index}
                  className=" text-gray-700 px-3 py-1 rounded-full text-sm border"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              {formatDate(article.created_at)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          {/* Image */}
          <div className="flex-1 flex justify-center items-center rounded-lg border p-3">
            <div className="relative w-[200px] h-[200px]">
              <Image
                src={
                  article.image ||
                  "default-image.png"
                }
                alt="illustration"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content),
              }}
              className="p-3 text-sm md:text-base leading-relaxed"
            />
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="md:col-span-2 p-6">
        {/* Author Info */}
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative rounded-full min-w-[50px] h-[50px] border-blue-500 border">
              <Image
                src={
                  author?.profile?.avatar ||
                  "default-avatar.png"
                }
                alt={author?.fullname || "Author"}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div>
              <h2 className="font-semibold">{author?.fullname}</h2>
              <p className="text-sm text-gray-600">{author?.profile?.bio}</p>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex space-x-3 w-full gap-4 my-2 border-b p-5">
          {/* WhatsApp */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded text-white bg-blue-400"
          >
            <Linkedin className="w-5 h-5" />
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <Facebook className="w-5 h-5" />
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}&text=${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded bg-blue-400 text-white hover:bg-blue-500"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Edit/Delete Buttons */}
        {me?.is_superuser && me.id === author?.id && (
          <div className="flex flex-col space-y-2 mt-2">
            <button
              className="border border-gray-500 text-black px-4 py-2 rounded-lg"
              onClick={() => router.push(`/articles/${id}/edit`)}
            >
              Modifier l'article
            </button>
            <button
              className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
              onClick={() => setShowConfirmationPopUp(true)}
            >
              Supprimer l'article
            </button>

            {/* Popup de confirmation de suppression */}
            {showConfirmationPopUp && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Voulez-vous vraiment supprimer cet article ?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                      onClick={() => setShowConfirmationPopUp(false)}
                    >
                      Non
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      onClick={() => deleteArticle()}
                    >
                      Oui
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

export default Page;
