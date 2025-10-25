import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../services/categoryService';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
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

const AdminCategories = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: { de: '', en: '', fr: '', it: '' },
    description: { de: '', en: '', fr: '', it: '' },
    icon: 'package',
    active: true,
    pricingModel: 'custom',
    basePrice: 0,
    hourlyRate: 0
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
      return;
    }
    if (user && user.role === 'admin') {
      loadCategories();
    }
  }, [user, authLoading, navigate]);

  const loadCategories = async () => {
    try {
      setPageLoading(true);
      const data = await categoryService.getAll(false);
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kategorien konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      categoryId: '',
      name: { de: '', en: '', fr: '', it: '' },
      description: { de: '', en: '', fr: '', it: '' },
      icon: 'package',
      active: true,
      pricingModel: 'custom',
      basePrice: 0,
      hourlyRate: 0
    });
    setShowDialog(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryId: category.categoryId,
      name: category.name,
      description: category.description,
      icon: category.icon,
      active: category.active,
      pricingModel: category.pricingModel,
      basePrice: category.basePrice,
      hourlyRate: category.hourlyRate
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setPageLoading(true);
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        toast({
          title: 'Erfolg!',
          description: 'Kategorie wurde aktualisiert',
        });
      } else {
        await categoryService.create(formData);
        toast({
          title: 'Erfolg!',
          description: 'Kategorie wurde erstellt',
        });
      }
      setShowDialog(false);
      loadCategories();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error.response?.data?.detail || 'Operation fehlgeschlagen',
        variant: 'destructive',
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diese Kategorie löschen möchten?')) return;

    try {
      setPageLoading(true);
      await categoryService.delete(id);
      toast({
        title: 'Erfolg!',
        description: 'Kategorie wurde gelöscht',
      });
      loadCategories();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kategorie konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    } finally {
      setPageLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service-Kategorien</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre Service-Kategorien</p>
        </div>
        <Button onClick={handleCreate} className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          Neue Kategorie
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category._id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Package className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">{category.name.de}</h3>
                      <Badge variant={category.active ? "default" : "secondary"}>
                        {category.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <Badge variant="outline">{category.pricingModel}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{category.description.de}</p>
                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="font-semibold text-gray-900">Kategorie-ID</p>
                        <p className="text-gray-600">{category.categoryId}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Stundensatz</p>
                        <p className="text-gray-600">CHF {category.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Basispreis</p>
                        <p className="text-gray-600">CHF {category.basePrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEdit(category)}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4" />
                    Bearbeiten
                  </Button>
                  <Button
                    onClick={() => handleDelete(category._id)}
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
              {editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie erstellen'}
            </DialogTitle>
            <DialogDescription>
              Füllen Sie die Informationen für die Kategorie aus
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Kategorie-ID *</Label>
              <Input
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                placeholder="umzug"
                disabled={!!editingCategory}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Name (Deutsch) *</Label>
                <Input
                  value={formData.name.de}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, de: e.target.value } })}
                  placeholder="Umzug"
                />
              </div>
              <div>
                <Label>Name (English)</Label>
                <Input
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  placeholder="Moving"
                />
              </div>
            </div>

            <div>
              <Label>Beschreibung (Deutsch)</Label>
              <Textarea
                value={formData.description.de}
                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, de: e.target.value } })}
                placeholder="Professioneller Umzugsservice"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label>Preismodell</Label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                >
                  <option value="custom">Custom</option>
                  <option value="hourly">Stündlich</option>
                  <option value="fixed">Fix</option>
                </select>
              </div>
              <div>
                <Label>Stundensatz (CHF)</Label>
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Basispreis (CHF)</Label>
                <Input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label>Aktiv</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={pageLoading}>
              {editingCategory ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
