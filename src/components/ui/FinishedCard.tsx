"use client";

import { useEffect, useState } from "react";
import { Challenge } from "@prisma/client";
import { filterToday, filterFinished } from "@/lib/filters";
import { deleteChallenge, fetchAllData, restartChallenge } from "@/lib/actions";
import { TodaySkeleton } from "../skeletons";
import Welcome from "./Welcome";
import FinishedItem from "./FinishedItem";

export default function FinishedCard() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [today, setToday] = useState<Challenge[]>([]);
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
    setFinished( filterFinished(challenges) );
  }, [challenges]);

  const restartAction = async (id: string): Promise<boolean> => {
    if (challenges === null) return false;

		try {
			let res = await restartChallenge(id)
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
          {challenges.length !== 0 && finished.length === 0 && (
            <div className="flex flex-col items-center py-10">
              <p>You haven&apos;t reached any of your goals yet, keep going.</p>
            </div>
          )}
          {finished.length > 0 && (
            <>
              <h2>Finished</h2>
              <ul role="list">
                {finished.map((challenge) => (
                  <FinishedItem key={challenge.id} challenge={challenge} action={restartAction} remove={deleteAction} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}