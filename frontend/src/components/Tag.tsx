import type { Tag } from "../utils/type";

const Tag: React.FC<Tag> = ({ name, description }) => {
    return (
      <div className="relative inline-block group">
        <span className="mx-1 bg-black text-white py-1 px-3 rounded-xl cursor-pointer">
          {name}
        </span>
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white w-64 text-center text-black p-2 rounded-lg shadow-lg z-50">
          <div className="relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div> {/* Triangle pointe */}
            <small>{description}</small>
          </div>
        </div>
      </div>
    );
  };
  
  export default Tag;