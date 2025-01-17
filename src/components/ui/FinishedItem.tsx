"use client";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Challenge } from "@prisma/client";
import { lazy, Suspense } from "react"
import { getRepeatPatternObject } from "@/lib/date";
import { ProgressBar } from "./progress-bar";
import { VerticalEllipsis } from "./icons";
const ContextMenuButton = lazy(() => import('./ContextMenuButton'))

export default function FinishedItem({
  challenge,
  action,
  remove
}: {
    challenge: Challenge,
  action: (id: string) => Promise<boolean>,
  remove: (id: string) => Promise<boolean>
}) {
	const [activate, setActivate] = useState(false)
  const { id, name, emoji, repeatPattern, goal, updatedAt } = challenge

  let patternObject = getRepeatPatternObject(repeatPattern)

	const handleClick = async (id: string) => {
		let res = await action(id)
		if (res)
      setActivate(true)
	}

  return (
		<li className="flex gap-4 items-center border-gray-50 rounded-lg border-2 bg-white my-4 p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4" role="listitem">
			<div className='aspect-square'>
				<ProgressBar size={90} progress={100} label={`${goal} days`} />
			</div>
			<div className="grow flex gap-4 sm:items-center flex-col sm:flex-row">
        <div className="flex flex-col grow">
          <span className="text-slate-400 text-xs">{patternObject.readablePattern}</span>
          <div className={`text-lg py-2`}>{emoji} {name}</div>
          <div className='flex gap-8'>
            <time className="flex gap-1 text-slate-400 text-xs">
              <FontAwesomeIcon icon={faCalendarDays} className='w-3' />
              Finished at {updatedAt.toLocaleDateString()}</time>
          </div>
        </div>
        <div className="self-end sm:self-center flex gap-2 items-center">
          <button
            onClick={e => handleClick(id)}
            className='border text-orange-500 border-orange-500 rounded px-2 py-1 hover:bg-orange-500 hover:bg-opacity-20 focus-within:bg-orange-500 focus-within:bg-opacity-20 active:scale-95 transition-all duration-75 whitespace-nowrap'>
            Start Over
          </button>
          <Suspense fallback={<VerticalEllipsis className='p-1 fill-gray-500' />}>
            <ContextMenuButton id={id} remove={remove} />
          </Suspense>
        </div>
      </div>
		</li>
  )
}