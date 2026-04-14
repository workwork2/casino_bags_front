import TournamentIdPage from "@/_pages/tournaments/ui/TournamentId";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <>
      <TournamentIdPage id={parseInt(id)} />
    </>
  );
};

export default Page;
