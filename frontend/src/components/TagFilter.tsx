import { useState, useEffect } from "react";
import type { Tag } from "../utils/type";
import { FaSearch } from "react-icons/fa";
import {motion} from "framer-motion";


import api from "../utils/api";

interface Props {
    onSelect: (selectedTags: Tag[]) => void;
    updateFrom: Tag[] | null;
}

const TagFilter: React.FC<Props> = ({ onSelect, updateFrom }) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});

    const isSelected = (tag: Tag) => {
        return selectedTags.some(t => t.name === tag.name)
    }

    useEffect(() => {
        fetchTags();
        if(updateFrom) {
            setSelectedTags(updateFrom);
            console.log("====================]]]", updateFrom)
        }
    }, [updateFrom]);

    useEffect(() => {
        if (tags.length > 0) {
            tags.forEach(tag => {
                relatedArticles(tag.name).then(count => {
                    setArticleCounts(prev => ({ ...prev, [tag.name]: count }));
                });
            });
        }
    }, [tags]);

    const handleClick = (tag: Tag) => {
        let updatedTags;
        if (isSelected(tag)) {
            updatedTags = selectedTags.filter(t => t.name !== tag.name);
        } else {
            updatedTags = [...selectedTags, tag];
        }
        setSelectedTags(updatedTags);
        onSelect(updatedTags);
    };

    const fetchTags = async () => {
        try {
            const resp = await api.get('tags').json<Tag[]>();
            setTags(resp);
        } catch (err) {
            console.log(err);
        }
    };

    const relatedArticles = async (name: string) => {
        try {
            const count = await api.get(`tags/${name}/articles/`).json<number>();
            return count;
        } catch (err) {
            console.log(err);
           
            return 0;
        }
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }} // Apparition avec un léger décalage vers le bas
        animate={{ opacity: 1, y: 0 }} // Animation vers la position normale
        transition={{ duration: 0.5, ease: "easeOut" }} // Transition fluide
        // whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
        className="border rounded min-h-[500px] p-2 m-10 md:mr-10 lg:mxr-[100px]">
            {tags.length > 0 &&
                tags.map((tag, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(tag)}
                        className={`flex justify-between items-center border-b cursor-pointer hover:bg-gray-100 p-2 ${isSelected(tag) && 'bg-gray-100'}`}
                    >
                        <div>
                            <h1>{tag.name}</h1>
                            <span>{articleCounts[tag.name] ?? 0} articles</span>
                            </div>
                        <FaSearch className="text-gray-300 text-2xl" />
                    </div>
                ))}
        </motion.div>
    );
};

export default TagFilter;