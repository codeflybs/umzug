import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { companyService } from '../services/companyService';
import { BACKEND_URL } from '../services/api';
import { Building2, Palette, Mail, Receipt, Upload } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { settings, reload } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [companyData, setCompanyData] = useState({
    companyName: '',
    addresses: []
  });

  const [themeData, setThemeData] = useState({
    primaryColor: '#EAB308',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF'
  });

  const [taxData, setTaxData] = useState({
    enabled: true,
    rate: 7.7,
    label: 'MwSt'
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
      return;
    }

    if (user && user.role === 'admin' && settings) {
      setCompanyData({
        companyName: settings.companyName || '',
        addresses: settings.addresses || []
      });
      setThemeData(settings.theme || themeData);
      setTaxData(settings.tax || taxData);
    }
  }, [settings, user, authLoading, navigate]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      await companyService.uploadLogo(file);
      await reload();
      toast({
        title: 'Erfolg!',
        description: 'Logo wurde erfolgreich hochgeladen',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Logo konnte nicht hochgeladen werden',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      setSaving(true);
      await companyService.updateSettings(companyData);
      await reload();
      toast({
        title: 'Erfolg!',
        description: 'Firmeneinstellungen wurden aktualisiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeUpdate = async () => {
    try {
      setSaving(true);
      await companyService.updateTheme(themeData);
      await reload();
      toast({
        title: 'Erfolg!',
        description: 'Theme wurde aktualisiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Theme konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTaxUpdate = async () => {
    try {
      setSaving(true);
      await companyService.updateTax(taxData);
      await reload();
      toast({
        title: 'Erfolg!',
        description: 'MwSt-Einstellungen wurden aktualisiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'MwSt-Einstellungen konnten nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-gray-600 mt-2">Verwalten Sie Ihre Firmeneinstellungen</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            Firma
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Receipt className="w-4 h-4" />
            MwSt
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            E-Mail
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Firmenlogo</CardTitle>
              <CardDescription>Laden Sie Ihr Firmenlogo hoch (empfohlen: PNG, max 2MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.logo && (
                <div className="mb-4">
                  <img
                    src={`${BACKEND_URL}${settings.logo}`}
                    alt="Company Logo"
                    className="h-20 object-contain"
                  />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Firmenname</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Firmenname</Label>
                  <Input
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                    placeholder="Gelbe-Umzüge"
                  />
                </div>
                <Button onClick={handleCompanyUpdate} disabled={saving} className="w-full sm:w-auto">
                  Speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farbschema</CardTitle>
              <CardDescription>Passen Sie die Farben Ihrer Anwendung an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="w-full flex-1">
                    <Label>Primärfarbe (Gelb)</Label>
                    <Input
                      type="color"
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                      className="h-12 cursor-pointer"
                    />
                  </div>
                  <div 
                    className="h-12 w-full rounded border-2 sm:w-20"
                    style={{ backgroundColor: themeData.primaryColor }}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="w-full flex-1">
                    <Label>Sekundärfarbe (Schwarz)</Label>
                    <Input
                      type="color"
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                      className="h-12 cursor-pointer"
                    />
                  </div>
                  <div 
                    className="h-12 w-full rounded border-2 sm:w-20"
                    style={{ backgroundColor: themeData.secondaryColor }}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="w-full flex-1">
                    <Label>Akzentfarbe (Weiß)</Label>
                    <Input
                      type="color"
                      value={themeData.accentColor}
                      onChange={(e) => setThemeData({ ...themeData, accentColor: e.target.value })}
                      className="h-12 cursor-pointer"
                    />
                  </div>
                  <div 
                    className="h-12 w-full rounded border-2 sm:w-20"
                    style={{ backgroundColor: themeData.accentColor }}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={handleThemeUpdate} disabled={saving} className="w-full sm:w-auto">
                    Theme speichern
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setThemeData({
                      primaryColor: '#EAB308',
                      secondaryColor: '#000000',
                      accentColor: '#FFFFFF'
                    })}
                    className="w-full sm:w-auto"
                  >
                    Zurücksetzen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mehrwertsteuer (MwSt)</CardTitle>
              <CardDescription>Konfigurieren Sie die MwSt-Einstellungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <Label>MwSt aktiviert</Label>
                  <p className="text-sm text-gray-500">MwSt in Offerten einbeziehen</p>
                </div>
                <Switch
                  checked={taxData.enabled}
                  onCheckedChange={(checked) => setTaxData({ ...taxData, enabled: checked })}
                />
              </div>

              <div>
                <Label>MwSt-Satz (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={taxData.rate}
                  onChange={(e) => setTaxData({ ...taxData, rate: parseFloat(e.target.value) })}
                  placeholder="7.7"
                />
              </div>

              <div>
                <Label>MwSt-Bezeichnung</Label>
                <Input
                  value={taxData.label}
                  onChange={(e) => setTaxData({ ...taxData, label: e.target.value })}
                  placeholder="MwSt"
                />
              </div>

              <Button onClick={handleTaxUpdate} disabled={saving} className="w-full sm:w-auto">
                MwSt-Einstellungen speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Einstellungen (SMTP)</CardTitle>
              <CardDescription>Konfigurieren Sie SMTP für den E-Mail-Versand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>SMTP Host *</Label>
                  <Input
                    value={settings?.email?.smtpHost || ''}
                    placeholder="smtp.gmail.com"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">z.B. smtp.gmail.com, smtp.office365.com</p>
                </div>
                <div>
                  <Label>SMTP Port *</Label>
                  <Input
                    type="number"
                    value={settings?.email?.smtpPort || 587}
                    placeholder="587"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Standard: 587 (TLS) oder 465 (SSL)</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>SMTP Benutzername *</Label>
                  <Input
                    type="email"
                    value={settings?.email?.smtpUser || ''}
                    placeholder="ihr-email@domain.ch"
                    disabled
                  />
                </div>
                <div>
                  <Label>SMTP Passwort *</Label>
                  <Input
                    type="password"
                    value="••••••••"
                    placeholder="Ihr SMTP Passwort"
                    disabled
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Absender E-Mail *</Label>
                  <Input
                    type="email"
                    value={settings?.email?.fromEmail || ''}
                    placeholder="noreply@firma.ch"
                    disabled
                  />
                </div>
                <div>
                  <Label>Absender Name *</Label>
                  <Input
                    value={settings?.email?.fromName || ''}
                    placeholder="Ihre Firma"
                    disabled
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Hinweis:</strong> E-Mail-Einstellungen können derzeit nur über die API konfiguriert werden. 
                  Die UI-Integration erfolgt in Kürze.
                </p>
              </div>

              <Button disabled className="w-full sm:w-auto">
                SMTP-Einstellungen speichern (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
