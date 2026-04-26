import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import MobileBottomNav from "@/components/MobileBottomNav";
import PageNumeral from "@/components/PageNumeral";
import PageTransition from "@/components/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain">
      <ScrollProgress />
      <Cursor />
      <CommandPalette />
      <PageNumeral />
      <Nav />
      <PageTransition>
        <main className="pb-16 md:pb-0">{children}</main>
      </PageTransition>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
