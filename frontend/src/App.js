import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "./services/api";
import { Button } from "./components/ui/button";
import { FileText, Plus, Package, LayoutDashboard } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import OfferPage from "./pages/OfferPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";
import AdminOfferDetail from "./pages/AdminOfferDetail";
import AdminSettings from "./pages/AdminSettings";
import AdminCategories from "./pages/AdminCategories";
import AdminServices from "./pages/AdminServices";
import AdminCustomers from "./pages/AdminCustomers";
import { useTranslation } from 'react-i18next';
import './i18n/i18n'; // Initialize i18n

const API = `${BACKEND_URL}/api`;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mt-12 mb-20 text-center">
          <div className="mb-8 inline-flex flex-wrap items-center justify-center gap-4">
            <div className="bg-yellow-500 p-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform sm:p-6">
              <Package className="w-16 h-16 text-black sm:w-20 sm:h-20" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            {t('home.title')}
          </h1>
          <p className="mb-4 text-xl font-light text-gray-300 sm:text-2xl lg:text-3xl">{t('home.subtitle')}</p>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg lg:text-xl">
            {t('home.description')}
          </p>
        </div>

        {/* Features */}
        <div className="mx-auto mb-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500 shadow-lg sm:h-16 sm:w-16">
              <FileText className="h-7 w-7 text-black sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">Professionelles Layout</h3>
            <p className="leading-relaxed text-gray-400">
              Exakt formatierte Offerten nach Schweizer Standard mit allen erforderlichen Angaben, AGB und Unterschriftsbereich
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500 shadow-lg sm:h-16 sm:w-16">
              <Plus className="h-7 w-7 text-black sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">Einfache Erstellung</h3>
            <p className="leading-relaxed text-gray-400">
              Intuitive Formulare für schnelle Offertenerstellung mit automatischer Preisberechnung und Speicherung
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500 shadow-lg sm:h-16 sm:w-16">
              <LayoutDashboard className="h-7 w-7 text-black sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">Admin Panel</h3>
            <p className="leading-relaxed text-gray-400">
              Vollständiges Verwaltungspanel mit Dashboard, Statistiken, Suche und Bearbeitungsfunktionen
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => navigate('/offerte')} 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-7 text-xl rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/50"
            >
              <Plus className="w-6 h-6 mr-2" />
              {t('home.createOffer')}
            </Button>
            <Button 
              onClick={() => navigate('/admin')} 
              size="lg" 
              variant="outline"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-10 py-7 text-xl rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <LayoutDashboard className="w-6 h-6 mr-2" />
              {t('home.adminPanel')}
            </Button>
          </div>
          <p className="text-sm text-gray-500">{t('home.demoLogin')}</p>
        </div>

        {/* Footer */}
        <div className="mt-24 border-t border-gray-800 pt-8 text-center text-sm text-gray-500 sm:mt-32">
          <p className="mb-2 text-base font-semibold sm:text-lg">Gelbe-Umzüge Offerten Generator</p>
          <p className="text-xs sm:text-sm">Tel: 031 557 24 31 / 079 247 00 05 • info@gelbe-umzuege.ch</p>
          <p className="mt-4 text-xs text-gray-600 sm:text-sm">© 2024 Gelbe-Umzüge. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/offerte" element={<><Header /><OfferPage /></>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="offers/:id" element={<AdminOfferDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="services" element={<AdminServices />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </div>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
