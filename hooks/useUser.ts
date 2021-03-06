// *userData, userStatus hook
import { User } from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";


const useUser = () => {
   const [isUser, setIsUser] = useState<boolean | null>(null);

   const [data, setData] = useState<User | null>(null);
   const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');


   useEffect(() => auth.onAuthStateChanged(user => {
      user ? setIsUser(true) : setIsUser(false);
      setData(user);
   }));

   useEffect(() => {
      if (isUser === null) {
         setStatus('loading');
      } else if (isUser === false) {
         setStatus('unauthenticated');
      } else if (isUser === true) {
         setStatus('authenticated');
      }
   }, [isUser]);

   return { data, status };
};

export default useUser;
