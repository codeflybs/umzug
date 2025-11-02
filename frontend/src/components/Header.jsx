import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Package, LayoutDashboard, FileText, LogOut, Home, Settings, Grid3x3, Users, Briefcase, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { BACKEND_URL } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isLoginRoute = location.pathname === '/admin/login';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const renderNavContent = (isMobile = false) => (
    <>
      <Button
        variant="ghost"
        className="text-white hover:text-yellow-500 hover:bg-gray-900"
        onClick={() => handleNavigation('/')}
      >
        <Home className="w-4 h-4 mr-2" />
        {t('nav.home')}
      </Button>
      <Button
        variant="ghost"
        className="text-white hover:text-yellow-500 hover:bg-gray-900"
        onClick={() => handleNavigation('/offerte')}
      >
        <FileText className="w-4 h-4 mr-2" />
        {t('nav.newOffer')}
      </Button>
      {user ? (
        <>
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-500 hover:bg-gray-900"
            onClick={() => handleNavigation('/admin')}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            {t('nav.dashboard')}
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-500 hover:bg-gray-900"
            onClick={() => handleNavigation('/admin/services')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Umzugsleistungen
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-500 hover:bg-gray-900"
            onClick={() => handleNavigation('/admin/categories')}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Service-Kategorien
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-500 hover:bg-gray-900"
            onClick={() => handleNavigation('/admin/customers')}
          >
            <Users className="w-4 h-4 mr-2" />
            {t('nav.customers')}
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-500 hover:bg-gray-900"
            onClick={() => handleNavigation('/admin/settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            {t('nav.settings')}
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('nav.logout')}
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          onClick={() => handleNavigation('/admin/login')}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          {t('nav.adminLogin')}
        </Button>
      )}
    </>
  );

  return (
    <header className="bg-black text-white border-b-4 border-yellow-500">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="bg-yellow-500 p-2 rounded-lg flex items-center justify-center">
              {settings?.logo ? (
                <img 
                  src={`${BACKEND_URL}${settings.logo}`} 
                  alt="Company Logo" 
                  className="w-8 h-8 object-contain" 
                />
              ) : (
                <Package className="w-8 h-8 text-black" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-yellow-500">
                {(settings?.companyName || 'GELBE-UMZÜGE').split('-')[0]}
              </span>
              <span className="text-white">
                -{(settings?.companyName || 'GELBE-UMZÜGE').split('-')[1]}
              </span>
            </h1>
          </div>

          {/* Navigation */}
          {!isLoginRoute && (
            <>
              <nav className="hidden w-full flex-1 items-center justify-end gap-4 lg:flex">
                {renderNavContent()}
              </nav>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-gray-800 p-2 text-white hover:border-yellow-500 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 lg:hidden"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? 'Menü kapat' : 'Menü aç'}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
        {!isLoginRoute && isMenuOpen && (
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-800 pt-4 lg:hidden">
            {renderNavContent(true)}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;