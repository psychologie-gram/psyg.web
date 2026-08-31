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
Medienordner `src/assets/images/uploads` und werden in den JSON-Dateien mit
einem Pfad wie `/images/uploads/datei.svg` referenziert. TinaCloud schreibt
neue Uploads in denselben Git-Ordner. Astro importiert diese Dateien beim Build
und liefert sie als statische Workers-Assets aus; eine Laufzeit-Dateisystemroute
ist nicht erforderlich. Nicht-redaktionelle Website-Dateien wie Favicon und
Open-Graph-Grafik bleiben ausserhalb dieses Ordners.
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

Die Produktionsarchitektur besteht aus einem statischen Astro-Build auf einem
Cloudflare Worker und TinaCloud als verwaltetem CMS-Backend. Es gibt keinen
Tina-Backend-Server, keine Datenbank, keinen Runtime-Dateispeicher und kein
R2-Medienarchiv. `wrangler.jsonc` konfiguriert Workers Assets, die
On-Demand-Route fuer Tina-Islands, 404-Verhalten und Observability.

### Produktions-Build

Der lokale Build bleibt fuer Entwicklung und CI ohne Cloud-Zugang verfuegbar:

```sh
npm run build
```

Ein manueller Produktions-Build verwendet dagegen:

```sh
npm ci
npm run build:production
npm run deploy
```

`build:production` fuehrt `tinacms build --content=local` aus und startet
danach `astro build`. Dadurch liest der statische Produktions-Build die
committeten JSON-Dateien und Medien aus dem lokalen Repository, waehrend der
generierte Produktions-Client fuer den Editor weiterhin auf TinaCloud zeigt.
Der generierte Admin wird zusammen mit der Website gebaut und der
Astro-Server wird nur fuer `/tina-island/*` in den Worker aufgenommen. Fuer
einen lokalen Worker-Test zuerst `npm run build` und danach
`npm run preview:worker` ausfuehren.

`--content=local` ist nicht dasselbe wie `--local`: Ersteres verwendet lokale
Inhalte und Medien, erzeugt aber den TinaCloud-Client fuer die Laufzeit des
Editors. `--local` erzeugt dagegen einen lokalen Tina-Client und ist fuer den
Produktions-Deploy nicht vorgesehen. Aenderungen, die in TinaCloud gespeichert
werden, erscheinen auf den oeffentlichen Cloudflare-Seiten nach dem bestehenden
GitHub- und Produktions-Build/Deploy.
`npm run preview` verwendet mit dem Cloudflare-Adapter ebenfalls die
Workerd/Wrangler-Vorschau und ist kein Node-Produktionsserver.

### TinaCloud einrichten

1. Das Repository in [TinaCloud](https://app.tina.io/) als Projekt anlegen,
   GitHub verbinden und den Produktionsbranch festlegen. `tina/tina-lock.json`
   muss committed und auf diesem Branch vorhanden sein.
2. Die TinaCloud-Konfiguration beziehungsweise den Backend-Init ausfuehren
   und die Projekt-ID sowie den Read-only-Token aus dem TinaCloud-Projekt
   verwenden.
3. Die folgenden Werte als **GitHub-Environment-Variablen beziehungsweise
   -Secrets** im Environment `production` hinterlegen, nicht in `src/`,
   `public/`, `wrangler.jsonc` oder generierten Output schreiben:

   | Variable | Zweck | Geheimnis |
   | --- | --- | --- |
   | `TINA_CLIENT_ID` | TinaCloud-Projekt-ID und Admin-Konfiguration | Nein |
   | `TINA_TOKEN` | Read-only-Token fuer Build- und Preview-Abfragen | Ja |
   | `TINA_BRANCH` | Branch, aus dem der Deployment-Build liest, z. B. `main` | Nein |

   `TINA_BRANCH` hat Vorrang vor automatisch erkannten CI-Branchvariablen.
   Ohne diese Variable verwendet die Konfiguration `GITHUB_BRANCH`,
   `CF_BRANCH`, `CF_PAGES_BRANCH`, `GITHUB_REF_NAME`, `HEAD` oder zuletzt
   `main`. So bleibt die Branch-Auswahl deployabhängig und es wird kein
   Preview-Branch im Code festgeschrieben.
4. Als erlaubte Site-/Preview-Origins mindestens
   `https://www.psychologie-gram.at` und die tatsaechlich verwendete
   Cloudflare-Vorschau-URL in TinaCloud eintragen. `/admin/` bleibt auf
   derselben Website-Origin; `PUBLIC_TINA_ADMIN_ORIGIN` ist nur bei einer
   zusaetzlichen Cross-Origin-Vorschau erforderlich.

TinaCloud uebernimmt Authentifizierung, Berechtigungen, GraphQL, Indexierung,
GitHub-Commits und Medien-Uploads. Die vorhandenen `TinaIsland`-Wrapper,
Feldmarker und die Route `src/pages/tina-island/[name].ts` bleiben deshalb
Bestandteil der Anwendung.

### GitHub Actions, Cloudflare und Domains

`.github/workflows/deploy.yml` baut und deployt den Worker. Der Workflow laeuft
bei jedem Push auf `main` und kann ueber `workflow_dispatch` manuell gestartet
werden. Dadurch loest ein TinaCloud-Commit auf dem Produktionsbranch
automatisch eine neue Veroeffentlichung aus. Cloudflare Workers Builds sollte
fuer diesen Worker nicht parallel aktiviert werden, damit nicht zwei
Deployment-Pipelines dieselbe Version veroeffentlichen.

Im GitHub-Environment `production` muessen zusaetzlich diese Cloudflare-Werte
hinterlegt werden:

| Variable/Secret | Zweck | Geheimnis |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Wrangler-Authentifizierung fuer den Worker-Deploy | Ja |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare-Account des Workers | Ja |

Der API-Token sollte auf den benoetigten Cloudflare-Account und die
Workers-Scripts-Berechtigung zum Bearbeiten begrenzt werden. Der Workflow
verwendet Node.js `22.12.0`, `npm ci`, `npm run build:production` und danach
`npm run deploy`. Fehlgeschlagene Tina-Generierung, fehlende Variablen,
ungueltige Inhalte oder Deploy-Fehler brechen den Lauf ab und sind in der
GitHub-Actions-Historie sichtbar. Jede erfolgreiche Ausfuehrung erzeugt eine
neue Worker-Version, die im Cloudflare-Dashboard zurueckgerollt werden kann.

Ein TinaCloud-Speichern ist daher nicht sofort oeffentlich: TinaCloud committet
zuerst nach GitHub, danach veroeffentlicht der ausgelöste GitHub-Actions-Lauf
die neue Worker-Version. Ein GitHub-Revert durchlaeuft denselben Weg und
aktualisiert anschliessend auch die TinaCloud-Branchdaten.

Den Worker im Dashboard mit `www.psychologie-gram.at` und dem bevorzugten
kanonischen Host verbinden. DNS, Custom Domain, TLS und Redirect vom jeweils
anderen Host werden dort konfiguriert; die kanonische URL bleibt
`https://www.psychologie-gram.at`. Cloudflare Assets bedienen HTML, Admin,
JavaScript, CSS und alle importierten Medien. Die
`/tina-island/*`-Anfragen werden dagegen im Worker ausgefuehrt und greifen fuer
die Live-Vorschau auf TinaCloud zu.

Die Kosten und Limits richten sich nach den gewaehlten TinaCloud- und
Cloudflare-Tarifen. Besonders GitHub-basierte Medien vergroessern Repository
und Build-Zeit; R2 oder ein eigenes Backend wuerden eine zweite Quelle der
Wahrheit und zusaetzliche Betriebs- und Kostenflaechen einfuehren und sind
deshalb nicht Teil dieser Konfiguration. Das Kontaktformular behaelt
unveraendert sein bestehendes `mailto:`-Verhalten.
