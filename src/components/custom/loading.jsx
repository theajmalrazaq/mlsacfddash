import { Circle } from "lucide-react";
export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-opacity-50 flex justify-center items-center">
        <div className="animate-spin ">
          <Circle stroke="hsl(var(--foreground))" />
        </div>
      </div>
    </>
  );
}
