import React from 'react';
import { Separator } from './ui/separator';
import { CheckSquare, Square } from 'lucide-react';

const OfferDocument = ({ offer, companyInfo, terms }) => {
  return (
    <div className="min-h-screen bg-white p-4 text-black sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Logo and Company Info */}
        <div className="relative mb-8">
          {/* Yellow/Black Top Border */}
          <div className="flex mb-4">
            <div className="h-2 bg-black flex-1"></div>
            <div className="h-2 bg-yellow-400 flex-1"></div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Logo Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black p-3 rounded">
                  <svg className="w-12 h-12 text-white sm:h-16 sm:w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 17h14v-5l-1.5-4.5h-11L5 12v5z"/>
                    <path d="M5 17v-5l-2 1v4h2z"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                    <path d="M7 8h6v-3h-6v3z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  <span className="text-yellow-500">GELBE</span>
                  <span className="text-black">-UMZÜGE</span>
                </h1>
              </div>
            </div>

            {/* Company Contact - Right Side */}
            <div className="text-sm text-left md:text-right">
              <p className="font-bold">{companyInfo.hauptsitz.title}</p>
              <p className="font-semibold">{companyInfo.hauptsitz.company}</p>
              <p>{companyInfo.hauptsitz.street}</p>
              <p>{companyInfo.hauptsitz.city}</p>
              <p className="text-blue-600">{companyInfo.hauptsitz.website}</p>
              <p className="text-blue-600">{companyInfo.hauptsitz.email}</p>
              <p className="font-semibold mt-1">{companyInfo.hauptsitz.phone}</p>
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div className="grid gap-6 mb-6 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <div className="flex flex-col gap-1 sm:flex-row">
              <span className="font-semibold sm:w-48">Offert Nr.</span>
              <span>{offer.offerNumber}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row">
              <span className="font-semibold sm:w-48">Offertdatum</span>
              <span>{offer.offerDate}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row">
              <span className="font-semibold sm:w-48">Ihre Kundennummer</span>
              <span>{offer.customerNumber}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row">
              <span className="font-semibold sm:w-48">Ihr Ansprechpartner</span>
              <span>{offer.contactPerson}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="font-semibold">{companyInfo.branch.company}</p>
            <p>{companyInfo.branch.street}</p>
            <p>{companyInfo.branch.city}</p>
            <p className="text-blue-600">{companyInfo.branch.website}</p>
            <p className="text-blue-600">{companyInfo.branch.email}</p>
          </div>
        </div>

        {/* Current and New Location */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <div>
            <h3 className="font-bold mb-2">Aktueller Standort:</h3>
            <p className="text-sm mb-2">__ Meter zur Ladekante, Lift: {offer.currentLocation.hasElevator ? 'Ja' : 'Nein'}</p>
            <div className="text-sm space-y-0.5">
              <p>{offer.currentLocation.customer.title}</p>
              <p>{offer.currentLocation.customer.firstName} {offer.currentLocation.customer.lastName}</p>
              <p>{offer.currentLocation.customer.street}</p>
              <p>{offer.currentLocation.customer.zipCode} {offer.currentLocation.customer.city}</p>
              <p>Tel: {offer.currentLocation.customer.phone}</p>
              <p className="text-blue-600">{offer.currentLocation.customer.email}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Neuer Standort:</h3>
            <p className="text-sm mb-2">__ Meter zur Ladekante, Lift: {offer.newLocation.hasElevator ? 'Ja' : 'Nein'}</p>
            <div className="text-sm space-y-0.5">
              <p>{offer.newLocation.street}</p>
              <p>{offer.newLocation.zipCode} {offer.newLocation.city}</p>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-4xl font-bold mb-6">Offerte</h2>

        {/* Greeting */}
        <p className="mb-6">Sehr geehrte {offer.currentLocation.customer.title} {offer.currentLocation.customer.lastName}</p>
        <p className="mb-6">Vielen Dank für Ihre Anfrage. Ich freue mich, Ihnen die folgende Offerte unterbreiten zu können:</p>

        {/* Moving Details */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Umzugstermin:</span>
            <span>{offer.movingDetails.movingDate}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Arbeitsbeginn:</span>
            <span>{offer.movingDetails.startTime}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Reinigungstermin:</span>
            <span>{offer.movingDetails.cleaningDate || 'offen'}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Reinigung Arbeitsbeginn:</span>
            <span>{offer.movingDetails.cleaningStartTime || 'offen'}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Abgabe:</span>
            <span>{offer.movingDetails.delivery || '—'}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <span className="font-semibold sm:w-48">Objekt:</span>
            <span>{offer.movingDetails.object}</span>
          </div>
        </div>

        {/* Moving Services Table */}
        <div className="mb-6 overflow-x-auto">
          <div className="min-w-[560px] border border-gray-300">
            <div className="bg-gray-100 px-4 py-2 font-bold border-b border-gray-300">Umzug:</div>
            <div className="grid grid-cols-[2fr,1fr,3fr,2fr] text-sm">
              <div className="px-4 py-2 border-b border-r border-gray-300">Umzugswagen:</div>
              <div className="px-4 py-2 border-b border-r border-gray-300">{offer.services.movingTrucks}</div>
              <div className="px-4 py-2 border-b border-r border-gray-300 font-semibold">Pauschalpreis Umzug:</div>
              <div className="px-4 py-2 border-b border-gray-300 text-right font-semibold">CHF {offer.services.movingPrice}</div>
              
              <div className="px-4 py-2 border-b border-r border-gray-300">Umzugsmitarbeiter:</div>
              <div className="px-4 py-2 border-b border-r border-gray-300">{offer.services.movingWorkers}</div>
              <div className="px-4 py-2 border-b border-r border-gray-300"></div>
              <div className="px-4 py-2 border-b border-gray-300"></div>
              
              <div className="px-4 py-2 border-r border-gray-300" style={{gridColumn: 'span 2'}}>{offer.services.movingBoxes}</div>
              <div className="px-4 py-2 border-r border-gray-300">{offer.services.assembly}</div>
              <div className="px-4 py-2"></div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="space-y-4 mb-6">
          {offer.additionalServices && Array.isArray(offer.additionalServices) && offer.additionalServices.length > 0 ? (
            offer.additionalServices.map((service, index) => (
              <div key={index} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold">{service.name}:</span>
                  <div className="flex items-center gap-2">
                    {service.selected ? 
                      <CheckSquare className="w-5 h-5" /> : 
                      <Square className="w-5 h-5" />
                    }
                    <span>JA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!service.selected ? 
                      <CheckSquare className="w-5 h-5" /> : 
                      <Square className="w-5 h-5" />
                    }
                    <span>NEIN</span>
                  </div>
                </div>
                {service.selected && (
                  <div className="font-semibold text-left md:text-right">
                    Pauschalpreis {service.name} <span className="ml-4">CHF {typeof service.price === 'number' ? service.price.toFixed(2) : service.price}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">Keine Zusatzleistungen ausgewählt</div>
          )}
        </div>

        {/* Total */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold">Total:</span>
            <span className="border-b-2 border-black pb-1 text-lg font-bold">CHF {offer.total}</span>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Terms and Conditions - Page 2 */}
        <div className="mt-12">
          {/* Yellow/Black Top Border */}
          <div className="flex mb-4">
            <div className="h-2 bg-black flex-1"></div>
            <div className="h-2 bg-yellow-400 flex-1"></div>
          </div>

          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="bg-black p-2 rounded">
              <svg className="w-10 h-10 text-white sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17h14v-5l-1.5-4.5h-11L5 12v5z"/>
                <path d="M5 17v-5l-2 1v4h2z"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
                <path d="M7 8h6v-3h-6v3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">
              <span className="text-yellow-500">GELBE</span>
              <span className="text-black">-UMZÜGE</span>
            </h2>
          </div>

          <div className="grid gap-8 text-sm md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">{terms.insurance.title}</h3>
                <p className="text-justify">{terms.insurance.text}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{terms.preparation.title}</h3>
                <p className="text-justify">{terms.preparation.text}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{terms.material.title}</h3>
                <p className="text-justify">{terms.material.text}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{terms.breaks.title}</h3>
                <p className="text-justify whitespace-pre-line">{terms.breaks.text}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">{terms.information.title}</h3>
                <p className="text-justify">{terms.information.text}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{terms.damages.title}</h3>
                <p className="text-justify">{terms.damages.text}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{terms.payment.title}</h3>
                <p className="text-justify">{terms.payment.text}</p>
              </div>
            </div>
          </div>

          {/* Closing Section */}
          <div className="mt-8 space-y-6">
            <p className="text-sm">
              Falls Ihnen unser Angebot zusagt, bitten wir Sie uns dieses umgehend unterschrieben zurück zu schicken, damit wir den von Ihnen gewünschten Termin frühzeitig reservieren können.
            </p>

            <p className="text-sm">
              Wir würden uns freuen, diesen Auftrag für Sie auszuführen und sichern Ihnen in jeder Beziehung eine fachmännische und zuverlässigen Umzug zu. Falls Sie Fragen haben, stehen wir Ihnen gerne zur Verfügung.
            </p>

            <p className="text-sm">Freundliche Grüsse</p>

            <div className="text-sm">
              <p className="font-semibold">Verkaufsleiter</p>
              <p className="font-semibold">{offer.contactPerson.replace('Herr ', '')}</p>
              <p className="font-bold mt-2">{companyInfo.hauptsitz.title}</p>
              <p className="font-semibold">{companyInfo.hauptsitz.company}</p>
              <p>{companyInfo.hauptsitz.street}</p>
              <p>{companyInfo.hauptsitz.city.replace('3322 ', '3322 Urtenen-')}</p>
            </div>

            <div className="mt-8">
              <p className="text-sm mb-4">
                Hiermit erteile ich der Firma Gelbe-Umzüge den obgenannten Auftrag und bestätige, dieses Angebot gelesen zu haben und mit allen Punkten einverstanden zu sein. Mit der Unterschrift bestätigen Sie, dass Sie mit den AGB's und der Offerte einverstanden sind.
              </p>

              <div className="grid gap-8 mt-8 md:grid-cols-2">
                <div>
                  <p className="font-semibold mb-2">Ort, Datum</p>
                  <div className="border-b-2 border-gray-400 h-12"></div>
                </div>
                <div>
                  <p className="font-semibold mb-2">Unterschrift</p>
                  <div className="border-b-2 border-gray-400 h-12"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-gray-300 pt-4 text-center text-xs text-gray-700 sm:text-sm">
            <p className="font-semibold">{companyInfo.hauptsitz.company}</p>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:justify-center sm:gap-4">
              <span>Tel: 031 552 24 31 / 079 247 00 05</span>
              <span>E-Mail: info@gelbe-umzuege.ch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDocument;
