import Loading from "@/components/custom/loading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Errorpage() {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/mlsaacfddash");
  }, [navigate]);

  return (
    <div>
      <Loading />
    </div>
  );
}
