import { getcomingDate, getRepeatPatternObject } from "@/lib/date"
import { Challenge } from "@prisma/client"
import { ProgressBar } from "./progress-bar"
import { lazy, Suspense } from "react"
import { faCalendarCheck, faCalendarDays } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import VerticalEllipsis from "./icons/VerticalEllipsis"

const ContextMenuButton = lazy(() => import('./ContextMenuButton'))
const Editable = lazy(() => import('./Editable'))

export default function TomorrowItem({
    challenge,
    remove,
    save
  }: {
    challenge: Challenge,
    remove: (id: string) => Promise<boolean>,
    save: (id: string, name: string) => Promise<boolean>
  }) {
    const { id, name, emoji, repeatPattern, goal, streak, lastStreak, startDate, createdAt } = challenge
  
    let patternObject = getRepeatPatternObject(repeatPattern)
  
      const handleSave = async (name: string) => {
          let res = await save(id, name)
          return res
      }
  
    return (
      <li className="flex gap-4 items-center border-gray-50 rounded-lg border-2 bg-white my-4 p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4" role="listitem">
        <div className="aspect-square">
          <ProgressBar size={90} progress={(100/goal)*streak} label={`${streak}/${goal} days`} />
        </div>
              <div className="grow flex gap-4 sm:items-center flex-col sm:flex-row">
          <div className="flex flex-col grow">
            <span className="text-slate-400 text-xs">
              {patternObject.readablePattern}
            </span>
            <div className="text-lg py-2">
              {emoji}
                          <Suspense fallback={<>{name}</>}>
                <Editable onSave={handleSave}>{name}</Editable>
              </Suspense>
            </div>
            <div className="flex gap-8">
              <span className="flex gap-1 text-slate-400 text-xs">
                <FontAwesomeIcon icon={faCalendarCheck} className="w-3" />
                {streak ? `${streak}d streak / ` : ``}
                {lastStreak ? `${lastStreak}d best streak` : `Not started`}
              </span>
              <time className="hidden sm:flex gap-1 text-slate-400 text-xs">
                <FontAwesomeIcon icon={faCalendarDays} className="w-3" />
                {createdAt.toLocaleDateString()}
              </time>
            </div>
          </div>
          <div className="self-end sm:self-center flex gap-2 items-center">
            {startDate && <div className="whitespace-nowrap border border-slate-400 rounded px-2 py-1">In {getcomingDate(startDate)}</div>}
            <Suspense fallback={<VerticalEllipsis className="p-1 fill-gray-500" />}>
              <ContextMenuButton id={id} remove={remove} />
            </Suspense>
          </div>
        </div>
      </li>
    )
  }