import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    zipCode: '',
    city: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store customer data in localStorage for now
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const newCustomer = {
        id: `customer_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      localStorage.setItem('customers', JSON.stringify(customers));
      localStorage.setItem('current_customer', JSON.stringify(newCustomer));

      toast({
        title: 'Erfolg!',
        description: 'Ihr Konto wurde erfolgreich erstellt',
      });

      // Redirect to offer creation page
      setTimeout(() => {
        navigate('/offerte');
      }, 1500);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Registrierung fehlgeschlagen',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <UserPlus className="w-8 h-8 text-black" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Kundenkonto erstellen</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Erstellen Sie ein Konto, um Offerten anzufordern
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      placeholder="Thomas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      placeholder="Mueller"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="thomas@email.ch"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="078 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="street">Strasse *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                    placeholder="Hauptstrasse 42"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">PLZ *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                      placeholder="4132"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ort *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      placeholder="Muttenz"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Passwort *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Mindestens 6 Zeichen"
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? 'Wird erstellt...' : 'Konto erstellen'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Bereits ein Konto?{' '}
                  <Button
                    variant="link"
                    className="text-yellow-600 hover:text-yellow-700 p-0"
                    onClick={() => navigate('/customer/login')}
                  >
                    Jetzt anmelden
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;