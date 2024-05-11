import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';

/**
 * Layoutでデータ取得したり、userIDが正しいかどうかの設定も入れる
 * @param param0
 * @returns
 */
export default async function DashBoadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  console.log('USER_ID:', userId);
  console.log('PARAMS:', params.storeId);
  if (!userId) {
    redirect('/sign-in');
  }
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });
  if (!store) {
    redirect('/');
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
