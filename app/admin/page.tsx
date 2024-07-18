import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import { isAdminUser } from "@/lib/admin";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {
  if (!isAdminUser()) redirect("/_not-found");

  return <App />;
};

export default AdminPage;
