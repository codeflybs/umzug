import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Users, TrendingUp, Calendar, Eye, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { offerService } from '../services/offerService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalOffers: 0,
    monthlyOffers: 0,
    totalRevenue: 0,
    pendingOffers: 0
  });
  const [recentOffers, setRecentOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const offers = await offerService.getAll();
      
      // Calculate stats
      const total = offers.length;
      const currentMonth = new Date().getMonth();
      const monthlyCount = offers.filter(offer => {
        const offerDate = new Date(offer.createdAt);
        return offerDate.getMonth() === currentMonth;
      }).length;
      
      const revenue = offers.reduce((sum, offer) => {
        return sum + (offer.pricing?.total || 0);
      }, 0);

      setStats({
        totalOffers: total,
        monthlyOffers: monthlyCount,
        totalRevenue: revenue,
        pendingOffers: offers.filter(o => o.status === 'draft' || o.status === 'sent').length
      });

      // Get recent 5 offers
      const recent = offers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOffers(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Willkommen, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Hier ist eine Übersicht über Ihre Umzugs-Offerten</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamte Offerten
            </CardTitle>
            <FileText className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOffers}</div>
            <p className="text-xs text-gray-500 mt-2">Alle erstellten Offerten</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Diesen Monat
            </CardTitle>
            <Calendar className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.monthlyOffers}</div>
            <p className="text-xs text-gray-500 mt-2">Offerten in diesem Monat</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamtumsatz
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">CHF {stats.totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-2">Geschätzter Gesamtumsatz</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aktive Offerten
            </CardTitle>
            <Users className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingOffers}</div>
            <p className="text-xs text-gray-500 mt-2">Offerten in Bearbeitung</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Offers */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Neueste Offerten</CardTitle>
            <Button
              onClick={() => navigate('/admin/offers')}
              variant="outline"
              className="gap-2 w-full md:w-auto"
            >
              <Eye className="w-4 h-4" />
              Alle anzeigen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOffers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Noch keine Offerten erstellt</p>
              <Button
                onClick={() => navigate('/offerte')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Erste Offerte erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="flex flex-col gap-4 border rounded-lg p-4 transition-colors hover:bg-gray-50 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
                  onClick={() => navigate(`/admin/offers/${offer._id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded">
                        <FileText className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {offer.customer.firstName} {offer.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Offert Nr. {offer.offerNumber} • {new Date(offer.createdAt).toLocaleDateString('de-CH')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold">CHF {offer.pricing?.total?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-500">{offer.serviceDetails?.movingDate || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/offerte')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black h-20 text-lg gap-3 w-full"
            >
              <Plus className="w-6 h-6" />
              Neue Offerte
            </Button>
            <Button
              onClick={() => navigate('/admin/offers')}
              variant="outline"
              className="h-20 text-lg gap-3 w-full"
            >
              <FileText className="w-6 h-6" />
              Alle Offerten
            </Button>
            <Button
              onClick={() => navigate('/admin/settings')}
              variant="outline"
              className="h-20 text-lg gap-3 w-full"
            >
              <Users className="w-6 h-6" />
              Einstellungen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
