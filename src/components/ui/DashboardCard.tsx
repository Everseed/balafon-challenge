"use client";

import { useEffect, useState } from "react";

import { Challenge } from "@prisma/client";
/* import { NoChallenge, TodayItem, TomorrowItem, Welcome } from "@/app/ui"; */


import Link from "next/link";
import NoChallenge from "./NoChallenge";
import { checkinChallenge, deleteChallenge, fetchAllData, updateChallengeName } from "@/lib/actions";
import { TodaySkeleton } from "../skeletons";
import Welcome from "./Welcome";
import TodayItem from "./TodayItem";
import TomorrowItem from "./TomorrowItem";
import { filterBroken, filterFinished, filterToday, filterTomorrow } from "@/lib/filters";

export default function DashboardCard() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [today, setToday] = useState<Challenge[]>([]);
  const [tomorrow, setTomorrow] = useState<Challenge[]>([]);
  const [broken, setBroken] = useState<Challenge[]>([]);
  const [finished, setFinished] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let data = await fetchAllData();
      setLoading(false);
      
      if (data === null) {
        setError(true);
        return;
      }
      
      setChallenges(data);
    })();
  }, []);

  useEffect(() => {
    if (challenges === null) return;

    setToday( filterToday(challenges) );
    setTomorrow( filterTomorrow(challenges) );
    setBroken( filterBroken(challenges) );
    setFinished( filterFinished(challenges) );
  }, [challenges]);

  const checkinAction = async (id: string): Promise<boolean> => {
    if (challenges === null) return false;

		try {
			let res = await checkinChallenge(id)
			if (res) {
        // Update Challenge state
        let updatedChallenges = challenges.map(challenge => challenge.id === id ? { ...res } : challenge)
        setChallenges(updatedChallenges)
        
        return true;
      }

		} catch (error) {
			console.error(error)
		}

    return false
  }

  const deleteAction = async (id: string): Promise<boolean> => {
    if (challenges === null) return false;

    try {
      let res = await deleteChallenge(id)
      if (res) {
        // Update Challenge state
        let updatedChallenges = challenges.filter(challenge => challenge.id !== id)
        setChallenges(updatedChallenges)

        return true;
      }

    } catch (error) {
      console.error(error)
    }

    return false
  }

  const saveAction = async (id: string, name: string): Promise<boolean> => {
    if (challenges === null) return false;
    
    try {
      let res = await updateChallengeName(id, name)
      if (res) {
        // Update Challenge state
        let updatedChallenges = challenges.map(challenge => challenge.id === id ? { ...res } : challenge)
        setChallenges(updatedChallenges)

        return true;
      }
    
    } catch (error) {
      console.error(error)
    }

    return false
  }

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 mt-4">
      {loading && <TodaySkeleton count={3} />}
      {error && <div>Not logged in</div>}
      {challenges && (
        <>
          {challenges.length === 0 && <Welcome />}
          {challenges.length > 0 && (
            <>
              <h2>Today</h2>
              {today.length === 0 && <NoChallenge />}
              {today.length > 0 && (
                <ul role="list">
                  {today.map((challenge) => (
                    <TodayItem key={challenge.id} challenge={challenge} action={checkinAction} remove={deleteAction} save={saveAction} />
                  ))}
                </ul>
              )}
            </>
          )}
          {tomorrow.length > 0 && (
            <>
              <h2>Upcoming</h2>
              <ul role="list">
                {tomorrow.map((challenge) => (
                  <TomorrowItem key={challenge.id} challenge={challenge} remove={deleteAction} save={saveAction} />
                ))}
              </ul>
            </>
          )}
          {(broken.length > 0 || finished.length > 0) && (
            <div className="flex flex-col items-center text-center text-green-500 py-10">
              <p>You have{` `}
              {broken.length > 0 && (
                <><Link href='/dashboard/broken' className="underline hover:no-underline">{broken.length} broken habits!</Link><br /></>
              )}
              {(broken.length > 0 && finished.length > 0) && (`And `)}
              {finished.length > 0 && (
                <>reached <Link href='/dashboard/finished' className="underline hover:no-underline">{finished.length} of your goals</Link> 🎉🥳</>
              )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

