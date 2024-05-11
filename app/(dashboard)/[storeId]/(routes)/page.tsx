import prismadb from '@/lib/prismadb';

interface DashBoadPageProps {
  params: { storeId: string };
}

const DashBoadPage: React.FC<DashBoadPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>Active store: {store?.name}</div>;
};

export default DashBoadPage;
