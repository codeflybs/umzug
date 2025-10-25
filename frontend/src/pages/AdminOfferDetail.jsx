import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Edit, Printer, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OfferDocument from '../components/OfferDocument';
import OfferForm from '../components/OfferForm';
import { mockCompanyInfo, standardTerms } from '../data/mock';
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

const AdminOfferDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [offer, setOffer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
      return;
    }
    if (user) {
      loadOffer();
    }
  }, [user, authLoading, id, navigate]);

  const loadOffer = () => {
    const savedOffers = localStorage.getItem('offers');
    if (savedOffers) {
      const offers = JSON.parse(savedOffers);
      const foundOffer = offers.find(o => o.id === id);
      if (foundOffer) {
        setOffer(foundOffer);
      } else {
        navigate('/admin/offers');
      }
    }
  };

  const handleUpdate = (updatedOffer) => {
    const savedOffers = localStorage.getItem('offers');
    if (savedOffers) {
      const offers = JSON.parse(savedOffers);
      const index = offers.findIndex(o => o.id === id);
      if (index !== -1) {
        offers[index] = { ...updatedOffer, id, updatedAt: new Date().toISOString() };
        localStorage.setItem('offers', JSON.stringify(offers));
        setOffer(offers[index]);
        setIsEditing(false);
      }
    }
  };

  const handleDelete = () => {
    const savedOffers = localStorage.getItem('offers');
    if (savedOffers) {
      const offers = JSON.parse(savedOffers);
      const filtered = offers.filter(o => o.id !== id);
      localStorage.setItem('offers', JSON.stringify(filtered));
      navigate('/admin/offers');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (authLoading) {
    return null;
  }

  if (!user || !offer) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/offers')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Offerte #{offer.offerNumber}
            </h1>
            <p className="mt-1 text-gray-600">
              {offer.currentLocation.customer.firstName} {offer.currentLocation.customer.lastName}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {!isEditing && (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <Edit className="w-4 h-4" />
                Bearbeiten
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <Printer className="w-4 h-4" />
                Drucken
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="gap-2 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                Löschen
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Offerte Bearbeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <OfferForm onSubmit={handleUpdate} initialData={offer} />
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="mt-4"
            >
              Abbrechen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <OfferDocument 
            offer={offer}
            companyInfo={mockCompanyInfo}
            terms={standardTerms}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDelete}
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

export default AdminOfferDetail;
