import { Supabase } from "@/components/custom/Supabase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "@/components/custom/dashboard";
import Loading from "@/components/custom/loading";

export function Home() {
  const navigate = useNavigate();
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
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <div>
      {isLogin === null ? <Loading /> : isLogin ? <Dashboard /> : <Loading />}
    </div>
  );
}
