import PublicLayout from "../PublicLayout";
import SmartFarming from "./smartFarming";

const BlogPage = () => (
  <PublicLayout title="Blog">
    <div className="py-8">
      <SmartFarming />
    </div>
  </PublicLayout>
);

export default BlogPage;
