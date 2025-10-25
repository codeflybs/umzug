import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { FileText, Eye, Download } from 'lucide-react';
import OfferForm from '../components/OfferForm';
import OfferDocument from '../components/OfferDocument';
import { mockOffer, mockCompanyInfo, standardTerms } from '../data/mock';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const OfferPage = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleOfferSubmit = (offerData) => {
    // Generate unique ID and add timestamps
    const offer = {
      ...offerData,
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedOffers = localStorage.getItem('offers');
    const offers = savedOffers ? JSON.parse(savedOffers) : [];
    offers.push(offer);
    localStorage.setItem('offers', JSON.stringify(offers));
    
    setCurrentOffer(offer);
    setActiveTab('preview');
    
    toast({
      title: t('common.success'),
      description: `${t('offer.title')} #${offer.offerNumber} wurde erfolgreich gespeichert.`,
    });
  };

  const handleUseMockData = () => {
    setCurrentOffer(mockOffer);
    setActiveTab('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2 gap-2">
            <TabsTrigger value="create" className="gap-2">
              <FileText className="w-4 h-4" />
              {t('offer.create')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2" disabled={!currentOffer}>
              <Eye className="w-4 h-4" />
              {t('offer.preview')}
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'create' && (
            <Button onClick={handleUseMockData} variant="outline" className="gap-2 w-full md:w-auto">
              <FileText className="w-4 h-4" />
              {t('offer.loadExample')}
            </Button>
          )}
        </div>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-4xl mx-auto">
            <OfferForm onSubmit={handleOfferSubmit} initialData={currentOffer} />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {currentOffer && (
            <div>
              <div className="mb-4 flex flex-col gap-3 print:hidden md:flex-row md:justify-end">
                <Button onClick={handlePrint} className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black md:self-end">
                  <Download className="w-4 h-4" />
                  {t('offer.print')}
                </Button>
              </div>
              <div className="bg-white shadow-2xl">
                <OfferDocument 
                  offer={currentOffer} 
                  companyInfo={mockCompanyInfo} 
                  terms={standardTerms} 
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfferPage;
