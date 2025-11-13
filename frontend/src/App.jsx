import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./assets/toScrollTop";
import AdminAccount from "./pages/AdminPage";
import AccountPage from "./pages/AccountPage";
import FeaturedProducts from "./components/Features";
import Bestsellers from "./pages/BestsellerPage";
import Collections from "./pages/CollectionPage";
import About from "./pages/AboutPage";
import AuthPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<AdminAccount />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user-acc" element={<AccountPage />} />
        <Route path="/shop" element={<FeaturedProducts />} />
        <Route path="/bestseller" element={<Bestsellers />} />
        <Route path="/collection" element={<Collections />} />
        <Route path="/about" element={<About />} />


      </Routes>
    </Router>
  );
}
