
import { SubHeader } from '@/components';
import { Sidebar } from '@/components/ui';
import { Toaster } from "sonner";

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <SubHeader />
      <div className='mx-auto lg:max-w-screen-xl px-2.5 lg:px-20'>
        <div className='grid grid-cols-1 lg:gap-5 lg:grid-cols-7'>
          <Sidebar />
          {children}
          {modal}
        </div>
        <Toaster closeButton />
      </div>
    </>
  )
}