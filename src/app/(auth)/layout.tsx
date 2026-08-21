import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopitect | Signup',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex w-full h-screen">
        <div className="w-1/2 h-full bg-black flex justify-center items-center">
          <h1 className="text-5xl text-white">Title</h1>
        </div>
        <div className="w-1/2 h-full bg-gray-100/50 flex justify-center items-center">
          <div className="w-1/2">{children}</div>
        </div>
      </div>
    </div>
  )
}
