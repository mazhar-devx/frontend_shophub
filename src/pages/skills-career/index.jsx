import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import LoginPrompt from "./LoginPrompt";

export default function SkillsCareerHome() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Dashboard /> : <LoginPrompt />;
}
