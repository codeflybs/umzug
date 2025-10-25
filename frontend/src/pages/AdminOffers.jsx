import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { FileText, Search, Eye, Trash2, Plus, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { offerService } from '../services/offerService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const AdminOffers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      loadOffers();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = offers.filter(offer => 
        offer.offerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffers(filtered);
    } else {
      setFilteredOffers(offers);
    }
  }, [searchTerm, offers]);

  const loadOffers = async () => {
    try {
      const data = await offerService.getAll();
      setOffers(data);
      setFilteredOffers(data);
    } catch (error) {
      console.error('Failed to load offers:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await offerService.delete(id);
      loadOffers();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete offer:', error);
    }
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alle Offerten</h1>
          <p className="text-gray-600 mt-2">
            {filteredOffers.length} {filteredOffers.length === 1 ? 'Offerte' : 'Offerten'} gefunden
          </p>
        </div>
        <Button
          onClick={() => navigate('/offerte')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          Neue Offerte
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suchen nach Offert-Nr., Name, E-Mail..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Keine Offerten gefunden' : 'Noch keine Offerten erstellt'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/offerte')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Erste Offerte erstellen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOffers.map((offer) => (
            <Card key={offer._id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                    <div className="rounded-lg bg-yellow-100 p-3">
                      <FileText className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <h3 className="text-xl font-bold leading-tight">
                          {offer.customer.firstName} {offer.customer.lastName}
                        </h3>
                        <Badge variant="secondary">#{offer.offerNumber}</Badge>
                      </div>
                      <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                        <div>
                          <p className="font-semibold text-gray-900">Kontakt</p>
                          <p>{offer.customer.email}</p>
                          <p>{offer.customer.phone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Umzugstermin</p>
                          <p>{offer.serviceDetails?.movingDate || 'N/A'}</p>
                          <p>{offer.serviceDetails?.startTime || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Von</p>
                          <p>{offer.currentLocation.street}</p>
                          <p>{offer.currentLocation.city}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Nach</p>
                          <p>{offer.newLocation.street}</p>
                          <p>{offer.newLocation.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end lg:justify-start">
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">CHF {offer.pricing?.total?.toFixed(2) || '0.00'}</p>
                      <p className="text-sm text-gray-500">Erstellt: {new Date(offer.createdAt).toLocaleDateString('de-CH')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => navigate(`/admin/offers/${offer._id}`)}
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4" />
                        Anzeigen
                      </Button>
                      <Button
                        onClick={() => setDeleteId(offer._id)}
                        variant="destructive"
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Offerte löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Offerte löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOffers;
