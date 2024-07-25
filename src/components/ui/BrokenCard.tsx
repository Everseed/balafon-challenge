"use client";

import { useEffect, useState } from "react";
import { Challenge } from "@prisma/client";
import { activateChallenge, deleteChallenge, fetchAllData } from "@/lib/actions";
import { filterBroken, filterToday } from "@/lib/filters";
import { TodaySkeleton } from "../skeletons";
import Welcome from "./Welcome";
import BrokenItem from "./BrokenItem";


export default function BrokenCard() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [today, setToday] = useState<Challenge[]>([]);
  const [broken, setBroken] = useState<Challenge[]>([]);
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
    setBroken( filterBroken(challenges) );
  }, [challenges]);

  const activateAction = async (id: string): Promise<boolean> => {
    if (challenges === null) return false;

		try {
			let res = await activateChallenge(id)
			if (res) {
        // Update habits state
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
        // Update habits state
        let updatedChallenges = challenges.filter(challenge => challenge.id !== id)
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
          {challenges.length !== 0 && broken.length === 0 && (
            <div className="flex flex-col items-center text-green-500 py-10">
              <p>Yay, You don&apos;t have any broken habits 👍</p>
            </div>
          )}
          {broken.length > 0 && (
            <>
              <h2>Broken</h2>
              <ul role="list">
                {broken.map((challenge) => (
                  <BrokenItem key={challenge.id} challenge={challenge} action={activateAction} remove={deleteAction} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}