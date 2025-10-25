import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { FileText, Plus, Users } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { serviceService } from '../services/serviceService';
import { customerService } from '../services/customerService';

const OfferForm = ({ onSubmit, initialData }) => {
  const [categories, setCategories] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('umzug');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  const [formData, setFormData] = useState(initialData || {
    offerNumber: '',
    offerDate: new Date().toLocaleDateString('de-CH'),
    customerNumber: '',
    contactPerson: '',
    currentLocation: {
      hasElevator: false,
      customer: {
        title: '',
        firstName: '',
        lastName: '',
        street: '',
        zipCode: '',
        city: '',
        phone: '',
        email: ''
      }
    },
    newLocation: {
      hasElevator: false,
      street: '',
      zipCode: '',
      city: ''
    },
    movingDetails: {
      movingDate: '',
      startTime: '',
      cleaningDate: '',
      cleaningStartTime: '',
      object: ''
    },
    services: {
      movingTrucks: 1,
      movingWorkers: 2,
      movingBoxes: '',
      assembly: '',
      movingPrice: '0.00'
    },
    category: 'umzug',
    additionalServices: []
  });

  useEffect(() => {
    loadCategories();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadServices(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
      if (data.length > 0 && !initialData) {
        setSelectedCategory(data[0].categoryId);
        setFormData(prev => ({ ...prev, category: data[0].categoryId }));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll(true);
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      // If not authenticated, just continue with empty customer list
      setCustomers([]);
    }
  };

  const loadServices = async (categoryId) => {
    try {
      const data = await serviceService.getAll(categoryId, true);
      setAvailableServices(data);
      
      // Initialize additionalServices array
      const services = data.map(service => ({
        serviceId: service.serviceId,
        name: service.name.de,
        selected: false,
        price: service.price
      }));
      setFormData(prev => ({ ...prev, additionalServices: services }));
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId);
    if (customerId) {
      const customer = customers.find(c => c._id === customerId);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerNumber: customer.customerNumber,
          currentLocation: {
            ...prev.currentLocation,
            customer: {
              title: customer.salutation,
              firstName: customer.firstName,
              lastName: customer.lastName,
              street: customer.address.street,
              zipCode: customer.address.zipCode,
              city: customer.address.city,
              phone: customer.phone,
              email: customer.email
            }
          }
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total
    const movingPrice = parseFloat(formData.services.movingPrice.replace("'", '')) || 0;
    
    // Calculate additional services total
    const additionalServicesTotal = formData.additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0);
    
    const total = movingPrice + additionalServicesTotal;
    
    onSubmit({ ...formData, total: total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'") });
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Offerten-Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <Label className="font-semibold text-blue-900">Kunde auswählen (Optional)</Label>
            </div>
            <select
              className="w-full border rounded p-2"
              value={selectedCustomerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
            >
              <option value="">-- Neuer Kunde (manuell eingeben) --</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  #{customer.customerNumber} - {customer.salutation} {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
            {selectedCustomerId && (
              <p className="text-sm text-blue-700 mt-2">
                ✓ Kundendaten wurden automatisch ausgefüllt
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="offerNumber">Offert Nr.</Label>
              <Input
                id="offerNumber"
                value={formData.offerNumber}
                onChange={(e) => updateField('offerNumber', e.target.value)}
                placeholder="10088"
              />
            </div>
            <div>
              <Label htmlFor="offerDate">Offertdatum</Label>
              <Input
                id="offerDate"
                value={formData.offerDate}
                onChange={(e) => updateField('offerDate', e.target.value)}
                placeholder="19.11.2024"
              />
            </div>
            <div>
              <Label htmlFor="customerNumber">Kundennummer</Label>
              <Input
                id="customerNumber"
                value={formData.customerNumber}
                onChange={(e) => updateField('customerNumber', e.target.value)}
                placeholder="4227"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Ansprechpartner</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => updateField('contactPerson', e.target.value)}
                placeholder="Herr Minerva Marco"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Service-Kategorie</Label>
            <select
              id="category"
              className="w-full border rounded p-2"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name.de}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktueller Standort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="currentElevator"
              checked={formData.currentLocation.hasElevator}
              onCheckedChange={(checked) => updateField('currentLocation.hasElevator', checked)}
            />
            <Label htmlFor="currentElevator">Lift vorhanden</Label>
          </div>
          {selectedCustomerId && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              ✓ Kundendaten aus Datenbank geladen. Zum Ändern, wählen Sie "Neuer Kunde" aus.
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Anrede</Label>
              <Input
                value={formData.currentLocation.customer.title}
                onChange={(e) => updateField('currentLocation.customer.title', e.target.value)}
                placeholder="Frau"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Vorname</Label>
              <Input
                value={formData.currentLocation.customer.firstName}
                onChange={(e) => updateField('currentLocation.customer.firstName', e.target.value)}
                placeholder="Corinna"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Nachname</Label>
              <Input
                value={formData.currentLocation.customer.lastName}
                onChange={(e) => updateField('currentLocation.customer.lastName', e.target.value)}
                placeholder="Stiegeler"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Strasse</Label>
              <Input
                value={formData.currentLocation.customer.street}
                onChange={(e) => updateField('currentLocation.customer.street', e.target.value)}
                placeholder="Birsfelderstrasse 15"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>PLZ</Label>
              <Input
                value={formData.currentLocation.customer.zipCode}
                onChange={(e) => updateField('currentLocation.customer.zipCode', e.target.value)}
                placeholder="CH-4132"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Ort</Label>
              <Input
                value={formData.currentLocation.customer.city}
                onChange={(e) => updateField('currentLocation.customer.city', e.target.value)}
                placeholder="Muttenz"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input
                value={formData.currentLocation.customer.phone}
                onChange={(e) => updateField('currentLocation.customer.phone', e.target.value)}
                placeholder="078 228 71 80"
                disabled={!!selectedCustomerId}
              />
            </div>
            <div>
              <Label>E-Mail</Label>
              <Input
                type="email"
                value={formData.currentLocation.customer.email}
                onChange={(e) => updateField('currentLocation.customer.email', e.target.value)}
                placeholder="kunde@email.ch"
                disabled={!!selectedCustomerId}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Neuer Standort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="newElevator"
              checked={formData.newLocation.hasElevator}
              onCheckedChange={(checked) => updateField('newLocation.hasElevator', checked)}
            />
            <Label htmlFor="newElevator">Lift vorhanden</Label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Strasse</Label>
              <Input
                value={formData.newLocation.street}
                onChange={(e) => updateField('newLocation.street', e.target.value)}
                placeholder="Mühlackerstrasse 82"
              />
            </div>
            <div>
              <Label>PLZ</Label>
              <Input
                value={formData.newLocation.zipCode}
                onChange={(e) => updateField('newLocation.zipCode', e.target.value)}
                placeholder="CH-4132"
              />
            </div>
            <div>
              <Label>Ort</Label>
              <Input
                value={formData.newLocation.city}
                onChange={(e) => updateField('newLocation.city', e.target.value)}
                placeholder="Muttenz"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Umzugsdetails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Umzugstermin</Label>
              <Input
                value={formData.movingDetails.movingDate}
                onChange={(e) => updateField('movingDetails.movingDate', e.target.value)}
                placeholder="25.01.2025"
              />
            </div>
            <div>
              <Label>Arbeitsbeginn</Label>
              <Input
                value={formData.movingDetails.startTime}
                onChange={(e) => updateField('movingDetails.startTime', e.target.value)}
                placeholder="08.00 Uhr"
              />
            </div>
            <div>
              <Label>Reinigungstermin (optional)</Label>
              <Input
                value={formData.movingDetails.cleaningDate}
                onChange={(e) => updateField('movingDetails.cleaningDate', e.target.value)}
                placeholder="offen"
              />
            </div>
            <div>
              <Label>Reinigung Arbeitsbeginn (optional)</Label>
              <Input
                value={formData.movingDetails.cleaningStartTime}
                onChange={(e) => updateField('movingDetails.cleaningStartTime', e.target.value)}
                placeholder="offen"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Objekt</Label>
              <Input
                value={formData.movingDetails.object}
                onChange={(e) => updateField('movingDetails.object', e.target.value)}
                placeholder="2.5 Zimmer-Haus mit 4+ Etagen, 56m² (Etage 0)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Umzugsleistungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Umzugswagen (Anzahl)</Label>
              <Input
                type="number"
                value={formData.services.movingTrucks}
                onChange={(e) => updateField('services.movingTrucks', parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label>Umzugsmitarbeiter (Anzahl)</Label>
              <Input
                type="number"
                value={formData.services.movingWorkers}
                onChange={(e) => updateField('services.movingWorkers', parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Umzugskisten</Label>
              <Input
                value={formData.services.movingBoxes}
                onChange={(e) => updateField('services.movingBoxes', e.target.value)}
                placeholder="20 Umzugskisten Kostenlos zur Verfügung"
              />
            </div>
            <div className="md:col-span-2">
              <Label>De/Montage</Label>
              <Input
                value={formData.services.assembly}
                onChange={(e) => updateField('services.assembly', e.target.value)}
                placeholder="Inkl. De/Montage"
              />
            </div>
            <div>
              <Label>Pauschalpreis Umzug (CHF)</Label>
              <Input
                value={formData.services.movingPrice}
                onChange={(e) => updateField('services.movingPrice', e.target.value)}
                placeholder="1'500.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zusatzleistungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableServices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Keine zusätzlichen Services für diese Kategorie verfügbar
            </p>
          ) : (
            <div className="space-y-4">
              {formData.additionalServices.map((service, index) => (
                <div key={service.serviceId} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-3 border rounded hover:bg-gray-50 transition-all">
                  <div className="flex items-center space-x-3 flex-1">
                    <Switch
                      id={service.serviceId}
                      checked={service.selected}
                      onCheckedChange={(checked) => {
                        const newServices = [...formData.additionalServices];
                        newServices[index].selected = checked;
                        setFormData({ ...formData, additionalServices: newServices });
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={service.serviceId} className="font-semibold cursor-pointer text-base">
                        {service.name}
                      </Label>
                      {!service.selected && (
                        <p className="text-sm text-gray-400 mt-1">
                          Klicken Sie zum Aktivieren
                        </p>
                      )}
                    </div>
                  </div>
                  {service.selected && (
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-medium">Preis:</p>
                      </div>
                      <div className="w-full md:w-32">
                        <Input
                          type="number"
                          step="0.01"
                          value={service.price}
                          onChange={(e) => {
                            const newServices = [...formData.additionalServices];
                            newServices[index].price = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, additionalServices: newServices });
                          }}
                          placeholder="0.00"
                          className="text-right font-semibold"
                        />
                      </div>
                      <span className="text-gray-600 font-medium">CHF</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        <Plus className="w-5 h-5 mr-2" />
        Offerte Erstellen
      </Button>
    </form>
  );
};

export default OfferForm;
