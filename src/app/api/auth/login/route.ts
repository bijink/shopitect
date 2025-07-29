import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/config/firebase.config';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    const signInRes = await signInWithEmailAndPassword(auth, email, password);
    // console.log(signInRes.user);
    const user = {
      uid: signInRes.user.uid,
      email: signInRes.user.email,
      displayName: signInRes.user.displayName,
      photoURL: signInRes.user.photoURL,
    };
    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
