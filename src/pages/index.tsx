import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div>
      {session && (
        <>
          Signed in as {session?.user?.name} <br/>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      {!session && (
        <>
          Not signed in <br/>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </div>
  )
}
