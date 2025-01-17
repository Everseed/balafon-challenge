import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarXmark, faChessQueen, faIdBadge, faRectangleList } from '@fortawesome/free-regular-svg-icons'

export default function Sidebar() {
  //! TODO: Whenever progressbar z-index fixed make sidebar sticky in all screens not just lg:
  return (
    <div className="scrollbar-hide lg:sticky top-16 lg:top-20 col-span-2 mt-4 max-h-[calc(100vh-150px)] self-start overflow-auto rounded-lg border border-gray-100 bg-white shadow-md lg:shadow lg:block">
      <div className="grid w-full rounded-md bg-white p-1 lg:p-6 lg:py-8 lg:divide-y lg:divide-gray-300">
        <ul className='flex flex-row lg:flex-col gap-1 justify-center flex-wrap'>
          <li>
            <Link className='flex gap-2 items-center rounded px-4 py-2 hover:bg-gray-200 focus-within:bg-gray-200 transition-all duration-75' href="/dashboard">
              <FontAwesomeIcon icon={faRectangleList} className='w-4' /> Dashboard
            </Link>
          </li>
          <li>
            <Link className='flex gap-2 items-center rounded px-4 py-2 hover:bg-gray-200 focus-within:bg-gray-200 transition-all duration-75' href="/dashboard/broken">
              <FontAwesomeIcon icon={faCalendarXmark} className='w-4' />
              Broken Habits
            </Link>
          </li>
          <li>
            <Link className='flex gap-2 items-center rounded px-4 py-2 hover:bg-gray-200 focus-within:bg-gray-200 transition-all duration-75' href="/dashboard/finished">
              <FontAwesomeIcon icon={faChessQueen} className='w-4' />
              Reached Goal
            </Link>
          </li>
          <li className='hidden lg:block'>
            <hr className='my-2 border-gray-300' />
          </li>
          <li>
            <Link className='flex gap-2 items-center rounded px-4 py-2 hover:bg-gray-200 focus-within:bg-gray-200 transition-all duration-75' href="/dashboard/profile">
              <FontAwesomeIcon icon={faIdBadge} className='w-4' />
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}