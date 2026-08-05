import { useEffect, type ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import AppDownloadFab from "@/components/AppDownloadFab";

/** Shared chrome for public marketing pages (About, Services, Blog, Contact). */
const PublicLayout = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  useEffect(() => {
    document.title = `${title} | AGRISENSE`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
      <AppDownloadFab />
    </div>
  );
};

export default PublicLayout;
