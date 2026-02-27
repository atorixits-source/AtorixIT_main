import IndustriesSection from "./IndustriesSection";
import { industriesData } from "./industriesData";

export default function IndustriesWeServePage() {
  return (
    <main>
      <IndustriesSection data={industriesData} />
    </main>
  );
}
