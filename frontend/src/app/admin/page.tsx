import ArticleForm from "../../components/form/ArticleForm";
import RequireAdmin from "../../components/utils/RequireAdmin";

const Page = () => {
    return (
        <RequireAdmin>
            <div className="">
                <ArticleForm />
            </div>
        </RequireAdmin>
    );
}

export default Page;