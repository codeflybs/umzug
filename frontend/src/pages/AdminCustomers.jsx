import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    salutation: 'Herr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      zipCode: '',
      city: '',
      country: 'CH'
    },
    notes: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
      return;
    }
    if (user && user.role === 'admin') {
      loadCustomers();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll(false);
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunden konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setFormData({
      salutation: 'Herr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        zipCode: '',
        city: '',
        country: 'CH'
      },
      notes: ''
    });
    setShowDialog(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      salutation: customer.salutation,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes || ''
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingCustomer) {
        await customerService.update(editingCustomer._id, formData);
        toast({
          title: 'Erfolg!',
          description: 'Kunde wurde aktualisiert',
        });
      } else {
        await customerService.create(formData);
        toast({
          title: 'Erfolg!',
          description: 'Kunde wurde erstellt',
        });
      }
      setShowDialog(false);
      loadCustomers();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error.response?.data?.detail || 'Operation fehlgeschlagen',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')) return;

    try {
      setLoading(true);
      await customerService.delete(id);
      toast({
        title: 'Erfolg!',
        description: 'Kunde wurde gelöscht',
      });
      loadCustomers();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunde konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kunden</h1>
          <p className="text-gray-600 mt-2">{filteredCustomers.length} Kunden gefunden</p>
        </div>
        <Button onClick={handleCreate} className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          Neuer Kunde
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Suchen nach Kundennummer, Name, E-Mail..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer._id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">
                        {customer.salutation} {customer.firstName} {customer.lastName}
                      </h3>
                      <Badge variant="secondary">#{customer.customerNumber}</Badge>
                      <Badge variant={customer.active ? "default" : "secondary"}>
                        {customer.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <p className="font-semibold text-gray-900">Kontakt</p>
                        <p>{customer.email}</p>
                        <p>{customer.phone}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Adresse</p>
                        <p>{customer.address.street}</p>
                        <p>{customer.address.zipCode} {customer.address.city}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Erstellt am</p>
                        <p>{new Date(customer.createdAt).toLocaleDateString('de-CH')}</p>
                      </div>
                    </div>
                    {customer.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{customer.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEdit(customer)}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4" />
                    Bearbeiten
                  </Button>
                  <Button
                    onClick={() => handleDelete(customer._id)}
                    variant="destructive"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Löschen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCustomers.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Ersten Kunden erstellen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Kunde bearbeiten' : 'Neuen Kunden erstellen'}
            </DialogTitle>
            <DialogDescription>
              Füllen Sie die Informationen für den Kunden aus. Kundennummer wird automatisch vergeben.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label>Anrede *</Label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.salutation}
                  onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                >
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                </select>
              </div>
              <div>
                <Label>Vorname *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Thomas"
                />
              </div>
              <div>
                <Label>Nachname *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Mueller"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>E-Mail *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="thomas@email.ch"
                />
              </div>
              <div>
                <Label>Telefon *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="078 123 45 67"
                />
              </div>
            </div>

            <div>
              <Label>Strasse *</Label>
              <Input
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                placeholder="Hauptstrasse 42"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label>PLZ *</Label>
                <Input
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                  placeholder="4132"
                />
              </div>
              <div>
                <Label>Ort *</Label>
                <Input
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  placeholder="Muttenz"
                />
              </div>
              <div>
                <Label>Land</Label>
                <Input
                  value={formData.address.country}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                  placeholder="CH"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label>Notizen</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Zusätzliche Informationen..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingCustomer ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
