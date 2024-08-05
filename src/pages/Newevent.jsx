import { Neweventim } from "@/components/custom/neweventim";

import { Supabase } from "@/components/custom/Supabase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "@/components/custom/loading";

export function Newevent() {
  let navigatehome = useNavigate();
  const [islogin, setIsLogin] = useState(null);

  useEffect(() => {
    async function islogincheck() {
      try {
        const {
          data: { user },
        } = await Supabase.auth.getUser();
        setIsLogin(user != null);
      } catch (error) {
        console.log(error);
      }
    }

    islogincheck();
  }, []);

  return (
    <div>
      {islogin === null ? (
        <Loading />
      ) : islogin ? (
        <Neweventim />
      ) : (
        navigatehome("/")
      )}
    </div>
  );
}
