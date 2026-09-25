import ProcessSteps from "../../components/site/ProcessSteps.jsx";
import { Link } from "react-router-dom";

export default function RepairProcess() {
  return (
    <div className="container-page py-14">
      <h1 className="font-display font-bold text-3xl">Our Repair Process</h1>
      <p className="text-ink/60 mt-2 max-w-xl">
        Six simple steps from drop-off to pick-up, with clear communication the whole way through.
      </p>
      <div className="mt-10">
        <ProcessSteps />
      </div>
      <div className="text-center mt-12">
        <Link to="/book-a-repair" className="btn-primary">Book a Repair</Link>
      </div>
    </div>
  );
}
