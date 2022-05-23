import { User } from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";


const useUser = () => {
   const [isUser, setIsUser] = useState<boolean | null>(null);
   const [status, setStatus] = useState<'user' | 'no-user' | 'loading'>('loading');
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => auth.onAuthStateChanged(user => {
      user ? setIsUser(true) : setIsUser(false);
      setUser(user);
   }));

   useEffect(() => {
      if (isUser === null) {
         setStatus('loading');
      } else if (isUser === false) {
         setStatus('no-user');
      } else if (isUser === true) {
         setStatus('user');
      }
   }, [isUser]);

   return { user, status };
};

export default useUser;
