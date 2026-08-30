# Psychologie Gram

Moderne Astro-Website fuer `psychologie-gram.at`, umgesetzt mit Astro 7, Tailwind CSS 4 und Tina CMS.

## Entwicklung

```sh
npm install
npm run dev
```

`npm run dev` ist der verbindliche lokale Startbefehl. Er startet Tina CMS und
Astro zusammen. Das lokale Tina-Admin ist unter
`http://localhost:4321/admin/` erreichbar; die Astro-Seite laeuft unter
`http://localhost:4321/`.

Die lokalen Prozesse verwenden diese Ports:

- Astro-Website und Admin-URL: `4321`
- Tina-Admin-Assets und lokaler GraphQL-Server: `4001`
- Tina-Datenlayer: `9000` (intern)

Das Admin wird beim Start von Tina unter `public/admin/` erzeugt und durch
Astros Dev-Server ausgeliefert. Deshalb muss fuer lokale Inhaltsbearbeitung
immer `npm run dev` verwendet werden. Der direkte Start mit `astro dev`,
`npm run astro -- dev` oder `npm run preview` startet den Tina-Server nicht;
das Admin kann dann fehlen, veraltet sein oder keine Inhalte speichern.

Die Entwicklungsumgebung setzt `PUBLIC_TINA_ADMIN_ORIGIN` auf die lokale
Astro- und Admin-Origin. Dadurch kann die Vorschau im Admin per `postMessage`
mit dem lokalen Editor kommunizieren.

Die Website startet standardmaessig im hellen Farbschema. Ueber das Sonnen-/
Mond-Symbol im Desktop-Header oder im mobilen Menue kann zwischen hellem und
dunklem Farbschema gewechselt werden; die Auswahl wird lokal im Browser
gespeichert.

## Pruefen und bauen

```sh
npm run astro -- check
npm run build
```

## Inhalte bearbeiten

- Die Seitenstruktur liegt direkt in `src/pages/*.astro`.
- `src/components/ui/` ist die private Psychology-Design-System-Schicht. Sie
  kapselt DaisyUI und Tailwind und bietet nur semantische Props wie
  `variant`, `tone` und `size`.
- `src/components/` enthält die Inhaltsblöcke und das Site-Chrome, die diese
  UI-Schicht verwenden. Tina kennt weder DaisyUI-Namen noch Tailwind- oder
  Klassenfelder.
- Redaktionsinhalte und globale Angaben liegen in JSON-Dateien unter `src/data/`.
- Tina CMS bearbeitet diese JSON-Dateien ueber das Schema in `tina/config.ts`.
- Die Seitenvorschau fuer das visuelle Editieren laeuft ueber `src/lib/tina/` und `src/pages/tina-island/[name].ts`.

Wichtige Datenquellen:

- `src/data/site.json` fuer globale Angaben wie Kontakt und Metadaten
- `src/data/pages/*.json` fuer strukturierte Seiteninhalte
- `tina/config.ts` fuer das Tina-Schema und die Admin-Konfiguration

`public/admin/` wird von Tina waehrend `npm run dev` und `npm run build` generiert und ist kein manuell gepflegter Quellcode.

Alle sichtbaren Texte und Beschriftungen werden ueber diese Dokumente geladen.
Globale UI-Texte liegen unter `site.ui`; Seitenbilder liegen in den
entsprechenden `page.blocks[]`-Vorlagen, zum Beispiel `hero.image` oder
`services.cards[].image`. Alle in Tina bearbeitbaren Medien liegen im
Medienordner `public/images/uploads` und werden in den JSON-Dateien mit einem
Pfad wie `/images/uploads/datei.svg` referenziert. Sie koennen im Editor durch
Uploads oder andere vorhandene Medien ersetzt werden. Nicht-redaktionelle
Website-Dateien wie Favicon und Open-Graph-Grafik bleiben ausserhalb dieses
Ordners.
Der Textinhalt-Block verwendet ein Tina-Rich-Text-Feld. Dadurch koennen
Formatierungen wie Fett, Kursiv, Hervorhebung und Links direkt im visuellen
Editor gepflegt werden.

Die Seiteninhalte liegen als geordnete, semantische `blocks` vor. Verfügbare
Vorlagen sind Hero, Schwerpunkte, Angebot, Textinhalt, Erfahrung/Zeitstrahl,
Ablauf & Kosten, Hinweis, Kontakt und rechtlicher Inhalt. Jeder Block kann
angezeigt/ausgeblendet werden; wo sinnvoll gibt es nur vordefinierte
Darstellungsvarianten. Listenfelder sind direkt sortierbar und die Darstellung
folgt der gespeicherten Reihenfolge.
Pfad und interne Seitenreihenfolge bleiben dabei im Editor verborgen und an die
festen Astro-Routen gebunden.

### Einen Inhaltsblock erweitern

1. Eine semantische Vorlage mit ausschließlich Inhaltsfeldern und begrenzten
   Optionen in `tina/config.ts` ergänzen.
2. Den zugehörigen Zod-Typ in `src/lib/site-data.ts` und die Normalisierung in
   `src/lib/tina/data.ts` ergänzen.
3. Einen Block-Renderer in `src/components/` erstellen, der die vorhandenen
   UI-Wrapper komponiert, und ihn in
   `src/components/tina/EditablePageContent.astro` registrieren.
4. Tina-Feldmarker an Block- und verschachtelten Inhaltsfeldern anbringen.

Keine CMS-Vorlage darf Klassen, DaisyUI-Komponenten oder beliebiges Markup
entgegennehmen. Nach Änderungen `npm run astro -- check` und `npm run build`
ausführen; der Build regeneriert die Tina-Dateien.

## Tina CMS lokal verwenden

Die aktuelle Tina-Integration ist bewusst lokal-first:

```sh
npm run dev
```

Danach:

1. Astro laeuft auf `http://localhost:4321`
2. Tina GraphQL und die Admin-Assets laufen lokal auf Port `4001`
3. Das Admin ist unter `http://localhost:4321/admin/`
4. Seiteninhalte sind in der Vorschau klickbar und werden ueber Tina-Islands live aktualisiert

In diesem Setup bearbeitet Tina die vorhandenen JSON-Dateien direkt im Repository. Es ist keine Cloud-Konfiguration noetig.

Typischer Ablauf:

1. `http://localhost:4321/admin/` oeffnen
2. Eine Seite in Tina auswaehlen
3. Die Vorschau der echten Astro-Seite oeffnen
4. Texte, Links oder Bilder direkt in der Vorschau anklicken und im
   zugehoerigen Tina-Feld bearbeiten
5. Eintraege innerhalb der Listen per Drag-and-drop neu anordnen
6. Speichern und die Vorschau beziehungsweise die Seite neu laden, um die
   persistierten Inhalte zu pruefen

Die Vorschau versieht die gerenderten Elemente mit Tina-Feldmarkierungen,
einschliesslich verschachtelter Listenfelder. Die Markierungen werden aus den
Tina-Quelldaten und nicht aus den sichtbaren Titeln erzeugt, damit sie auch
nach dem Umbenennen oder Verschieben eines Eintrags korrekt bleiben.

Wichtig: Fuer die lokale Bearbeitung immer `npm run dev` verwenden. Das Admin
unter `http://localhost:4321/admin/` wird dann vom lokalen Tina-Server
versorgt, waehrend die Vorschau auf derselben Astro-Origin laeuft. Auch die
VS-Code-Startkonfiguration verwendet deshalb `npm run dev` statt `astro dev`.

`public/admin/` ist ausschliesslich Tina-generierter Output. Keine manuelle
Admin-Route oder sonstige Dateien dort hinzufuegen.

## Projektstruktur

```text
src/
├── components/
│   ├── ui/          # Private Psychology-Wrapper (DaisyUI intern)
│   ├── tina/        # Tina-Island und Block-Renderer
│   └── *.astro      # Semantische Inhaltsblöcke und Site-Chrome
├── data/            # CMS-bearbeitbare JSON-Inhalte
├── layouts/         # Base Layout
├── lib/             # Typen, Hilfsfunktionen, Site-Daten und Tina-Loader
└── pages/           # Explizite Astro-Routen und Tina-Island-Endpoint

tina/
└── config.ts        # Tina Schema und lokale Admin-Konfiguration
```

## Deployment

Die aktuelle Tina-Konfiguration ist fuer lokale Bearbeitung ohne TinaCloud ausgelegt. Wenn spaeter ein gehostetes Editor-Setup noetig ist, muessen Tina-Cloud- oder Self-Hosted-Details gezielt ergaenzt werden.
