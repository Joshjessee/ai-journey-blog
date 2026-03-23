import { getAllPosts } from "@/lib/blog";
import { HomeContent } from "@/components/HomeContent";

export default function HomePage() {
  const posts = getAllPosts();

  return <HomeContent posts={posts} />;
}
