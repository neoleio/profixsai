import ProcessSteps from "../../components/site/ProcessSteps.jsx";
import { Link } from "react-router-dom";
import { useContent } from "../../lib/useContent.js";
import T from "../../components/site/T.jsx";

export default function RepairProcess() {
  const { t, s } = useContent();
  return (
    <div className="container-page py-14">
      <T as="h1" id="process_title" className="block font-display font-bold text-3xl" />
      <T as="p" id="process_intro" className="block text-ink/60 mt-2 max-w-xl" />
      <div className="mt-10">
        <ProcessSteps />
      </div>
      <div className="text-center mt-12">
        <Link to="/book-a-repair" style={s("process_btn")} className="btn-primary">{t("process_btn")}</Link>
      </div>
    </div>
  );
}
