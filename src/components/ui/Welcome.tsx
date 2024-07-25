import Image from 'next/image'
import CreateChallengeBtn from './CreatechallengeBtn'


export default function Welcome() {
  return (
    <div className="flex flex-col items-center text-green-500 py-16">
      <Image src="/images/welcome.gif" alt='welcome' className='rounded-xl mb-2 w-auto h-auto' width={450} height={250} priority />
      <p>Create your first challenge to get started!</p>
      <CreateChallengeBtn text="First Challenge" className="mt-6" />
    </div>
  )
}