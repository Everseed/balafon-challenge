"use client"

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { useState } from 'react'
import VerticalEllipsis from './icons/VerticalEllipsis';
import ChallengeDeleteDialog from './ChallengeDeleteDialog';

export default function ContextMenuButton({ id, remove }: { id: string, remove: (id: string) => Promise<boolean> }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="h-full rounded p-1 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200" aria-haspopup="dialog" aria-expanded="true" aria-controls="radix-:rcv:" data-state="open">
          <span className="sr-only">Options</span>
          <VerticalEllipsis className='fill-gray-500' />
        </div>
      </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" className="w-60 p-4 animate-fade-in rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
        onSelect={() => {}}>
        Show Details
      </DropdownMenu.Item>
      <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
        onSelect={() => {}}>
        Edit
      </DropdownMenu.Item>
      <ChallengeDeleteDialog id={id} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} remove={remove} trigger={(
        <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
          onSelect={(e) => { e.preventDefault(); setDeleteDialogOpen(true) }}>
          Delete
        </DropdownMenu.Item>
      )} />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  )
}