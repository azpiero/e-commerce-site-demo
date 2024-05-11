import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });
  if (stores) {
    redirect(`/${stores.id}`);
  }
  return <>{children}</>;
}
