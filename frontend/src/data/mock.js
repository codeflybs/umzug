export const mockCompanyInfo = {
  name: "Gelbe-Umzüge",
  hauptsitz: {
    title: "Hauptsitz",
    company: "Gelbe - Umzüge",
    street: "Sandstrasse 5",
    city: "3322 Schönbühl",
    website: "www.gelbe-umzuege.ch",
    email: "info@gelbe-umzuege.ch",
    phone: "Tel. 031 557 24 31 / 079 247 00 05"
  },
  branch: {
    company: "Gelbe - Umzüge",
    street: "Güterstrasse 204",
    city: "4053 Basel",
    website: "www.gelbe-umzuege.ch",
    email: "info@gelbe-umzuege.ch"
  }
};

export const mockOffer = {
  offerNumber: "10088",
  offerDate: "19.11.2024",
  customerNumber: "4227",
  contactPerson: "Herr Minerva Marco",
  currentLocation: {
    hasElevator: true,
    customer: {
      title: "Frau",
      firstName: "Corinna",
      lastName: "Stiegeler",
      street: "Birsfelderstrasse 15",
      zipCode: "CH-4132",
      city: "Muttenz",
      phone: "078 228 71 80",
      email: "corinna.stiegeler@web.de"
    }
  },
  newLocation: {
    hasElevator: false,
    street: "Mühlackerstrasse 82",
    zipCode: "CH-4132",
    city: "Muttenz"
  },
  movingDetails: {
    movingDate: "25.01.2025",
    startTime: "08.00 Uhr",
    cleaningDate: "",
    cleaningStartTime: "",
    object: "2.5 Zimmer-Haus mit 4+ Etagen, 56m² (Etage 0)"
  },
  services: {
    movingTrucks: 1,
    movingWorkers: 4,
    movingBoxes: "20 Umzugskisten Kostenlos zur Verfügung",
    assembly: "Inkl. De/Montage",
    movingPrice: "1'500.00"
  },
  additionalServices: [
    {
      serviceId: "cleaning",
      name: "Reinigung",
      selected: true,
      price: 900.00
    },
    {
      serviceId: "disposal",
      name: "Entsorgung",
      selected: false,
      price: 250.00
    },
    {
      serviceId: "packing",
      name: "Verpackungsservice",
      selected: false,
      price: 50.00
    }
  ],
  total: "2'400.00"
};

export const standardTerms = {
  insurance: {
    title: "Versicherungen:",
    text: "Gegen Verlust oder Beschädigung Ihrer Güter haften wir gemäss Schweizerischem Frachtvertragsgesetz (OF). Wir machen Sie darauf aufmerksam, dass die Ware zum Zeitwert und nicht zum Neuwert versichert ist und zwar bis zu einem Warenwert von CHF 1 Mio. Kontaktieren Sie uns bitte falls Sie das Transportgut oder einzelne Gegenstände zu Neuwert speziell versichern möchten, wir informieren Sie gerne über die Ansätze."
  },
  preparation: {
    title: "Vorbereitung:",
    text: "Das Verpacken von kleineren Gegenständen wird durch den Kunden in Kartonschachteln bereitgestellt. Grösseres Umzugsgut wie TV und Sofa wird durch die Firma Gelbe-Umzüge verpackt."
  },
  material: {
    title: "Verbrauchsmaterial:",
    text: "Umzugsdecken werden vor Ort gratis zur Verfügung gestellt, damit das Umzugsgut gut gesichert wird. Verbrauchsmaterial wie Folien oder Bodenfliesen werden verrechnet, sowie das Depot für die Umzugskisten."
  },
  breaks: {
    title: "Pausen:",
    text: "Vor- Und Nachmittag: 15 Minuten\nMittagspause: 30 Minuten"
  },
  information: {
    title: "Information:",
    text: "Die Offerte setzt voraus, dass beide Standorte frei zugänglich und über das schweizer Strassennetz erreichbar sind. Ist der Lieferwert mit normalen Umzugswagen nicht oder nur erschwert zugänglich, so erfolgt die Lieferung bis zur nächsten allgemein zugänglichen Stelle die ohne Zusatzaufwand oder Zusatzkosten erreicht werden kann."
  },
  damages: {
    title: "Schäden:",
    text: "Schäden müssen gemäss OR Art.452 Absatz 1 sofort nach dem Umzug am Umzugsladearbeiter mitgeteilt und schriftlich auf dem Schadenmeldungsformular mit dem Unterschrift des Kunden und des Umzugschefs festgehalten werden. Schäden die nach dem Umzug können -abgesehen von dem im OR Art. 452 Absätze 2 und 3 erwähnten äusserlich nicht erkennbaren Schäden mit einer Reklamationsfrist von 2 Tagen- nicht mehr berücksichtigt werden."
  },
  payment: {
    title: "Zahlungsbedingungen:",
    text: "Barzahlung am Abladeort nach dem Umzug an den Teamleiter. Dies betrifft den Betrag für den gesammten Umzug und Reinigung."
  }
};