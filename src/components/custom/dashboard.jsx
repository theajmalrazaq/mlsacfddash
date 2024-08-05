import Navbarmenu from "./Navbar";
import Oldevents from "./oldevents";

export default function Dashboard() {
  return (
    <>
      <Navbarmenu activetab={"home"} />
      <Oldevents />
    </>
  );
}
