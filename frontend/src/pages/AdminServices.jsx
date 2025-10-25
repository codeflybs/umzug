import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { serviceService } from '../services/serviceService';
import { categoryService } from '../services/categoryService';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';
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

const AdminServices = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    categoryId: 'umzug',
    name: { de: '', en: '', fr: '', it: '' },
    description: { de: '', en: '', fr: '', it: '' },
    price: 0,
    priceType: 'fixed',
    hourlyRate: 0,
    active: true,
    order: 0
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
      return;
    }
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        serviceService.getAll(null, false),
        categoryService.getAll(true)
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Daten konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      serviceId: '',
      categoryId: categories[0]?.categoryId || 'umzug',
      name: { de: '', en: '', fr: '', it: '' },
      description: { de: '', en: '', fr: '', it: '' },
      price: 0,
      priceType: 'fixed',
      hourlyRate: 0,
      active: true,
      order: 0
    });
    setShowDialog(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceId: service.serviceId,
      categoryId: service.categoryId,
      name: service.name,
      description: service.description,
      price: service.price,
      priceType: service.priceType,
      hourlyRate: service.hourlyRate || 0,
      active: service.active,
      order: service.order
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingService) {
        await serviceService.update(editingService._id, formData);
        toast({
          title: 'Erfolg!',
          description: 'Service wurde aktualisiert',
        });
      } else {
        await serviceService.create(formData);
        toast({
          title: 'Erfolg!',
          description: 'Service wurde erstellt',
        });
      }
      setShowDialog(false);
      loadData();
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
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Service löschen möchten?')) return;

    try {
      setLoading(true);
      await serviceService.delete(id);
      toast({
        title: 'Erfolg!',
        description: 'Service wurde gelöscht',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Service konnte nicht gelöscht werden',
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
          <h1 className="text-3xl font-bold text-gray-900">Zusatzleistungen</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre zusätzlichen Services</p>
        </div>
        <Button onClick={handleCreate} className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          Neuer Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service._id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">{service.name.de}</h3>
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <Badge variant="outline">{service.priceType}</Badge>
                      <Badge>{categories.find(c => c.categoryId === service.categoryId)?.name.de || service.categoryId}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{service.description.de}</p>
                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="font-semibold text-gray-900">Service-ID</p>
                        <p className="text-gray-600">{service.serviceId}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Preis</p>
                        <p className="text-gray-600">CHF {service.price.toFixed(2)}</p>
                      </div>
                      {service.priceType === 'hourly' && (
                        <div>
                          <p className="font-semibold text-gray-900">Stundensatz</p>
                          <p className="text-gray-600">CHF {service.hourlyRate?.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4" />
                    Bearbeiten
                  </Button>
                  <Button
                    onClick={() => handleDelete(service._id)}
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
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Service bearbeiten' : 'Neuen Service erstellen'}
            </DialogTitle>
            <DialogDescription>
              Füllen Sie die Informationen für den Service aus
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Service-ID *</Label>
                <Input
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  placeholder="cleaning"
                  disabled={!!editingService}
                />
              </div>
              <div>
                <Label>Kategorie *</Label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name.de}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Name (Deutsch) *</Label>
                <Input
                  value={formData.name.de}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, de: e.target.value } })}
                  placeholder="Reinigung"
                />
              </div>
              <div>
                <Label>Name (English)</Label>
                <Input
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  placeholder="Cleaning"
                />
              </div>
            </div>

            <div>
              <Label>Beschreibung (Deutsch)</Label>
              <Textarea
                value={formData.description.de}
                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, de: e.target.value } })}
                placeholder="Professionelle Endreinigung"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label>Preistyp</Label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                >
                  <option value="fixed">Fixpreis</option>
                  <option value="hourly">Stündlich</option>
                </select>
              </div>
              <div>
                <Label>Preis (CHF)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {formData.priceType === 'hourly' && (
                <div>
                  <Label>Stundensatz (CHF)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Reihenfolge</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Aktiv</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingService ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
