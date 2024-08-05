import Membersdata from "@/components/custom/membersdata";
import { Supabase } from "@/components/custom/Supabase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "@/components/custom/loading";

export function Members() {
  const navigatehome = useNavigate();
  const [isLogin, setIsLogin] = useState(null);

  useEffect(() => {
    async function isLoginCheck() {
      try {
        const {
          data: { user },
        } = await Supabase.auth.getUser();
        setIsLogin(user != null);
      } catch (error) {
        console.log(error);
      }
    }

    isLoginCheck();
  }, []);

  useEffect(() => {
    if (isLogin === false) {
      navigatehome("/");
    }
  }, [isLogin, navigatehome]);

  return (
    <div>
      {isLogin === null ? <Loading /> : isLogin ? <Membersdata /> : <Loading />}
    </div>
  );
}
