'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

const SIGN_IN_WITH_GOOGLE = gql`
  mutation SignInWithGoogle($googleToken: String!) {
    signInWithGoogle(googleToken: $googleToken) {
      id
      name
      email
    }
  }
`;

const useSignInMutation = () => {
  const [signInWithGoogle, { loading }] = useMutation(SIGN_IN_WITH_GOOGLE);
  const mutate = async (googleToken: string) => {
    try {
      await signInWithGoogle({ variables: { googleToken } });
    } catch (error) {
      console.error("Error signing in with BFF:", error);
    }
  };
  return { mutate, isLoading: loading };
};

export default function AuthButton() {
  const { data: session, status } = useSession();
  const { mutate: signInWithBff, isLoading } = useSignInMutation();
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    console.log('AuthButton useEffect - status:', status, 'session:', session, 'hasSynced:', hasSynced);
    if (status === 'authenticated' && session?.id_token && !hasSynced) {
      console.log('Calling BFF with token:', session.id_token);
      signInWithBff(session.id_token);
      setHasSynced(true); // Prevent re-triggering on re-renders
    } else if (status === 'unauthenticated') {
      setHasSynced(false); // Reset on sign out
    }
  }, [status, session, signInWithBff, hasSynced]);

  if (status === 'loading' || isLoading) {
    return <p> Loading...</p>
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={()=> signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  )
}
