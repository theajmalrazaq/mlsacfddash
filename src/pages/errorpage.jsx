import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Errorpage() {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
