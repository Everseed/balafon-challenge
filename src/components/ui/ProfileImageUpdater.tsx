'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { updateProfilePicture } from "@/lib/actions";
import { ImageEdit, Spinner } from './icons';

export default function ProfileImageUpdater( { id, img }: { id: string, img: string } )
{
  const [image, setImage] = React.useState<string | null>()
  const [loading, setLoading] = React.useState(false)
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const maxSize2MB = 2097152

  useEffect(() => {
    if(!image) return

    (async () => {
      setLoading(true)
      let url = await updateProfilePicture(id, image)
      setLoading(false)
      if( !url )
        toast.error("Failed to update picture, Please try again.")
    })()

  }, [image])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if(acceptedFiles.length > 0) {
      let file = acceptedFiles[0]
      if( !file ) return

      if ( file.size > maxSize2MB ) {
        toast.error("File size too big (max 2MB)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [])

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    dragAreaRef.current?.classList.add('border-dashed')
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if( e.currentTarget === e.target )
      dragAreaRef.current?.classList.remove('border-dashed')
  }

  // Init dropzone
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    onDragEnter,
    onDragLeave,
    maxFiles: 1,
    onDrop,
    onError: (err) => toast.error(err.message)
  })

  return (
    <div {...getRootProps()} ref={dragAreaRef} className='group rounded-full w-36 h-36 relative cursor-pointer drag self-center border-4 border-black/50'>
      <Image src={image ? image : img} alt='Profile Avatar' width={160} height={160} className="rounded-full w-full h-full object-cover" />
      {!loading && <ImageEdit className='w-10 h-10 p-2 rounded-full text-white opacity-75 group-hover:opacity-100 bg-black/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />}
      {loading && <Spinner className='w-10 h-10 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />}
      <input name='image' {...getInputProps()} />
    </div>
  )
}