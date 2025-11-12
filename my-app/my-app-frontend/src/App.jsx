import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./componentrs/NavBar";
import Footer from "./componentrs/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 dark:bg-slate-900 dark:text-white">
      <NavBar />
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
