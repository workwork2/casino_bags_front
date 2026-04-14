import NewsIdPage from "@/_pages/news/newsId";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <NewsIdPage id={parseInt(id)} />;
};

export default Page;
