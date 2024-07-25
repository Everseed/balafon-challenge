
import DashboardCard from '@/components/ui/DashboardCard';
import { updateChallenges } from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';

export default async function page()
{
  // Get user session token
  /*  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    redirect('/');  */

  // Update all missed checkins as broken
  /* await updateChallenges(session.user); */

  return (
    <DashboardCard />
  )
}