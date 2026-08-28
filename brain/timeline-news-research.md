# Timeline research — new candidate items from the IMG news archive

**Date of research:** 2026-08-27
**Source:** https://www.schadedoormijnbouw.nl/nieuws (Instituut Mijnbouwschade Groningen news archive)
**Scope:** last ~1 year of news (2025-08 → 2026-08), cross-checked against KNMI seismology data.

---

## Data model reminder (from `src/shared/types.ts`)

```ts
type Timeline = { date: string; label: string; html: string; description: string; category: string };
```
- `date` format: `'YYYY-M-D'` (no zero-padding, e.g. `2025-11-13`, `2022-10-8`)
- `label` and `html` are the same display string (`html` is the `data_label` key)
- `description`: short extra info, e.g. `(magnitude 3.4)`
- `category`: `'beving'` (earthquake) or `'regeling'` (scheme / organisational / political event)

## How the data was fetched

- The `/nieuws` page is a Vue app. The list is loaded from a JSON API:
  `GET https://www.schadedoormijnbouw.nl/api/news/publicsite?skip={n}&take=100`
  (found in `/dist/website/vue/newsoverview.vue.bundle.js`). 790 items total; all pages fetched.
  Note: `?period=1` maps to `All` (the whole archive), NOT "last year" — the enum is
  `1=All, 2=Week, 3=Month, 4=Quarter, 5=HalfYear, 6=Year`. I filtered the full archive to the last ~1 year.
- KNMI cross-check: the aardbevingen page is JS-rendered; the map reads
  `https://cdn.knmi.nl/knmi/json/current/seismology/earthquake-events.json` (rolling 30 events) and each event links to a detail page `/nederland-nu/seismologie/aardbevingen/{eventid}`. For the full year I used the public FDSN event service:
  `https://rdsa.knmi.nl/fdsnws/event/1/query?starttime=2025-08-01&endtime=2026-08-27&minmagnitude=1.5&format=text`.

---

## STRONG candidates (recommend adding)

### 1. Earthquake — Geelbroek (Drenthe)
```ts
{
  date: "2026-3-14",
  label: "Geelbroek",
  html: "Geelbroek",
  description: "(magnitude 3.0)",
  category: "beving",
}
```
- **Date:** 2026-03-14 (KNMI: 2026-03-14T01:14:28.6 UTC)
- **Magnitude:** 3.0 (KNMI MLn 2.99)
- **Sources:**
  - https://www.schadedoormijnbouw.nl/nieuws/2026/03/img-ontvangt-ruim-300-schademeldingen-na-aardbeving-bij-geelbroek — "Na de aardbeving van 3.0 op schaal van Richter bij Geelbroek in Drenthe … ruim 300 schademeldingen … Deze beving valt niet binnen de bevoegdheid van het IMG, maar onder de verantwoordelijkheid van de Commissie Mijnbouwschade."
  - https://www.schadedoormijnbouw.nl/nieuws/2026/03/update-schademeldingen-na-beving-geelbroek — "de beving bij Geelbroek van 14 maart"; 883 meldingen by 20 March, 26 AOS-meldingen.
  - KNMI FDSN event `knmi2026fbqr`: 2026-03-14T01:14:28.6 UTC, lat 52.955 lon 6.569, depth 3.0 km, MLn 2.99, "Geelbroek", type "induced or triggered event".
- **Summary:** An induced earthquake of magnitude 3.0 struck Geelbroek (Drenthe) on 14 March 2026. It falls under the Commissie Mijnbouwschade rather than the IMG, but the IMG still received 883 damage reports and 26 acute-unsafety (AOS) reports. Strongest quake in the period after Zeerijp.
- **Note:** It is the largest induced quake since Zeerijp (Nov 2025) and is in Drenthe — worth flagging that it is handled by the Commissie, not the IMG, but it is a significant beving for the timeline.

### 2. Earthquake — Zandeweer
```ts
{
  date: "2026-8-21",
  label: "Zandeweer",
  html: "Zandeweer",
  description: "(magnitude 2.8)",
  category: "beving",
}
```
- **Date:** 2026-08-21 (KNMI: 2026-08-21T03:50:39 UTC; "vroege ochtend van vrijdag 21 augustus")
- **Magnitude:** 2.8 (KNMI ML 2.76)
- **Sources:**
  - https://www.schadedoormijnbouw.nl/nieuws/2026/08/aardbeving-bij-zandeweer — "aardbeving bij Zandeweer met een sterkte van 2.8 op de schaal van Richter"; by 24 Aug 450 schademeldingen, 12 AOS-meldingen.
  - https://www.schadedoormijnbouw.nl/nieuws/2026/08/2199-meldingen-van-fysieke-schade-waardedaling-en-immateriele-schade — weekly report attributes the jump in reports to "de aardbeving in Zandeweer".
  - KNMI detail page: https://www.knmi.nl/nederland-nu/seismologie/aardbevingen/knmi2026qmut — 2026-08-21 03:50:39 UTC, lat 53.378 lon 6.667, depth 3.0 km, type "Geïnduceerde aardbeving", magnitude 2.8.
- **Summary:** An induced earthquake of magnitude 2.8 hit Zandeweer (Groningen) on the morning of 21 August 2026. The IMG received 450 damage reports within days, with 12 possible acute-unsafety situations. The most recent significant beving.

### 3. Scheme — Aanvullende vaste vergoeding (full rollout)
```ts
{
  date: "2025-10-21",
  label: "Start Aanvullende vaste vergoeding",
  html: "Start Aanvullende vaste vergoeding",
  description: "(aanvulling tot 10.000 euro)",
  category: "regeling",
}
```
- **Date:** 2025-10-21 (open in all municipalities without pre-registration). Alternative anchor: 2025-09-15 (Eemsdelta start without pre-registration).
- **Sources:**
  - https://www.schadedoormijnbouw.nl/nieuws/2025/10/aanvullende-vaste-vergoeding-in-alle-gemeenten-aan-te-vragen-zonder-voorinschrijving — "Alle woningeigenaren in het effectgebied … kunnen vanaf nu de aanvullende vaste vergoeding aanvragen … Eerder uitgekeerde vergoedingen … worden hiermee aangevuld tot 10.000 euro … kleine objecten … tot maximaal 5.000 euro."
  - https://www.schadedoormijnbouw.nl/nieuws/2025/09/aanvragen-aanvullende-vaste-vergoeding-zonder-voorinschrijving-start-in-eemsdelta — start in Eemsdelta 15 Sep 2025, after ~39.000 pre-registrations were largely handled.
- **Summary:** The Aanvullende vaste vergoeding (AVV) tops up earlier payouts (NAM, CVW, TCMG, IMG) to €10,000 for buildings / €5,000 for small objects, compensating historical differences. After a pre-registration phase it became available without pre-registration in Eemsdelta (mid-Sep 2025) and in all municipalities by 21 Oct 2025. Directly extends the existing "Verhoging vaste vergoeding naar 10.000 euro" (2024-03-18) item.

### 4. Scheme — Vaste herhaalvergoeding
```ts
{
  date: "2026-4-8",
  label: "Start vaste herhaalvergoeding",
  html: "Start vaste herhaalvergoeding",
  description: "(5.000 euro, Nij Begun)",
  category: "regeling",
}
```
- **Date:** 2026-04-08 ("Sinds vandaag, woensdag 8 april, bieden we een nieuwe mogelijkheid …")
- **Sources:**
  - https://www.schadedoormijnbouw.nl/nieuws/2026/04/vaste-herhaalvergoeding-snelle-afhandeling-van-nieuwe-schade — "De vaste herhaalvergoeding is 5.000 euro. Voor kleinere gebouwen en objecten … is dit 2.500 euro. De vaste herhaalvergoeding is één van de maatregelen uit Nij Begun."
- **Summary:** New scheme (from Nij Begun) for repeat damage after a new quake: a flat €5,000 (buildings) / €2,500 (small objects) without a cause investigation — only a damage survey. Explicitly aimed at cases like repeat damage after the Zeerijp quake. A distinct new regeling, so a strong timeline item.

---

## MODERATE candidates (consider adding; scheme/process changes)

### 5. Process change — herstel werkwijze (one full survey per request)
```ts
{
  date: "2025-8-20",
  label: "Aanpassing werkwijze schadeherstel",
  html: "Aanpassing werkwijze schadeherstel",
  description: "(één schadeopname per aanvraag, vanaf november)",
  category: "regeling",
}
```
- **Date:** 2025-08-20 (announcement; change effective from November 2025)
- **Source:** https://www.schadedoormijnbouw.nl/nieuws/2025/08/aanpassing-in-werkwijze-voor-aanvragen-voor-herstel-sneller-en-duidelijker-vanaf-november — ~2.000 people waiting on herstel; the IMG stops the "aanvullende opname" and from November works with one full, current damage survey per request, to cut waiting times.
- **Summary:** Change to the damage-handling process for herstel requests (repair up to €60.000 ceiling): drop the supplementary survey, one full survey per request, faster handling from Nov 2025. Borderline because it is an internal process change rather than a new scheme, but it is a visible change to the damage-handling process (task category 2).

### 6. Scheme change — equal treatment of renters and owners for immaterial damage
```ts
{
  date: "2025-9-8",
  label: "Gelijke behandeling huurders en eigenaren bij immateriële schade",
  html: "Gelijke behandeling huurders en eigenaren",
  description: "",
  category: "regeling",
}
```
- **Date:** 2025-09-08
- **Source:** https://www.schadedoormijnbouw.nl/nieuws/2025/09/gelijke-behandeling-van-huurders-en-eigenaren-bij-immateriele-schade — from now on owners and non-owners (huurders, samenwonende partners, inwonende meerderjarige kinderen) are treated the same in IMS assessments; also applies retroactively via a vervolgaanvraag.
- **Summary:** The immaterial-damage (IMS) scheme is broadened so renters/non-owners are treated the same as owners, with retroactive effect for earlier applicants. A real widening of an existing regeling (the timeline already has "Start regeling Immateriële schade" 2021-11-15), so a reasonable candidate.

---

## BORDERLINE / WEAK candidates

### 7. Organisation — new board member Ineke van Gent
```ts
{
  date: "2025-12-15",
  label: "Ineke van Gent benoemd tot bestuurslid IMG",
  html: "Ineke van Gent benoemd tot bestuurslid IMG",
  description: "",
  category: "regeling",
}
```
- **Date:** announced 2025-12-15; takes office 2026-01-01 (replaces Els van Schie, who leaves 2026-02-01).
- **Source:** https://www.schadedoormijnbouw.nl/nieuws/2025/12/ineke-van-gent-benoemd-tot-nieuw-bestuurslid-instituut-mijnbouwschade-groningen — appointment fixed by Koninklijk Besluit; Van Gent (former MP, mayor of Schiermonnikoog) takes the social-societal portfolio.
- **Summary:** A single board-member appointment (not chair or director). The task lists "new director/board" as a category, but this is a routine board change — borderline. Only add if the timeline wants to track board composition. (Director Ronald Koch unchanged.)

### 8. Scheme — Duurzaam herstel beyond pilot phase
```ts
{
  date: "2026-1-21",
  label: "Duurzaam herstel na pilotfase",
  html: "Duurzaam herstel na pilotfase",
  description: "(regeling verruimd vanaf 2026)",
  category: "regeling",
}
```
- **Date:** announced 2026-01-21; new conditions effective 2026-01-01.
- **Source:** https://www.schadedoormijnbouw.nl/nieuws/2026/01/img-blijft-woningen-ook-na-de-pilotfase-duurzaam-herstellen — pilot of Duurzaam herstel (constructive measures to reduce recurring damage) ends; from 2026 the regeling applies to a wider area with adjusted conditions.
- **Summary:** Continuation + widening of an existing pilot regeling. Weak because it is a continuation rather than a new scheme.

### 9. Operational — automatic top-up round for immaterial damage (adults)
```ts
{
  date: "2025-9-2",
  label: "Automatische aanvulronde immateriële schade",
  html: "Automatische aanvulronde immateriële schade",
  description: "",
  category: "regeling",
}
```
- **Date:** 2025-09-02 (payments from 15 Sep 2025)
- **Source:** https://www.schadedoormijnbouw.nl/nieuws/2025/09/nieuwe-automatische-aanvulronde-immateriele-schade-volwassenen — ~600 adults automatically get a (supplementary) IMS payment, ~€1.2m total; quarterly top-up rounds.
- **Summary:** A recurring quarterly operational top-up, not a new scheme. Weak — probably not timeline-worthy.

---

## Events already in the timeline (SKIP)

- **Zeerijp 2025-11-13 / 2025-11-14 (magnitude 3.4)** — already present. Cross-check: KNMI FDSN `knmi2025whfa` = 2025-11-14T00:16:40 UTC, MLn 3.44, "Zeerijp", induced. News: https://www.schadedoormijnbouw.nl/nieuws/2025/11/aardbeving-bij-zeerijp (14 Nov 2025) and follow-up https://www.schadedoormijnbouw.nl/nieuws/2025/11/na-de-beving-bij-zeerijp-img-helpt-bewoners-met-afhandeling-van-de-schade (24 Nov 2025). No action needed.

## Events I could NOT verify / not found

- **Wet mijnbouwschade (new legal basis):** no news item in the entire archive (2018–2026) mentions "Wet mijnbouwschade" / "mijnbouwschadewet" / a wetsvoorstel. The IMG news site does not cover the legislative process — if a timeline item is wanted, it must come from a different source (e.g. overheid.nl / Rijksoverheid), not from this archive.
- **New kamerbrieven / kabinetsmaatregelen / parliamentary motions in the last year:** none in the archive. The last such items are the existing 2023 kamerbrief/kabinetsmaatregelen entries. (The only Nij Begun-related news in the period is the Vaste herhaalvergoeding, item 4.)
- **New director/chair:** none — Ronald Koch remains algemeen directeur (mentioned in the 3-miljard and jaarverslag items); Henk Korvinus remains bestuursvoorzitter.
- **Milestone "3 miljard uitgekeerd"** (2026-01-14, https://www.schadedoormijnbouw.nl/nieuws/2026/01/img-passeert-het-bedrag-van-3-miljard-aan-mijnbouwschade): a financial milestone, not a scheme/political event — flagged as NOT recommended for the timeline (mention only if a "milestones" category is ever added).
- **Jaarverslag 2025** (2026-03-27, https://www.schadedoormijnbouw.nl/nieuws/2026/03/img-jaarverslag-2025-108000-schademeldingen-afgehandeld-blijvende-aandacht-voor-verbetering): routine annual report — not recommended.
- **Ombudsman complaints report** (2026-06-22, https://www.schadedoormijnbouw.nl/nieuws/2026/06/klachten-over-het-img-excuses-aangeboden-en-verbeteracties-ingezet): a complaints/quality item — not recommended for the timeline.
- **New expert-advice contracts** (2025-08-29, https://www.schadedoormijnbouw.nl/nieuws/2025/08/nieuwe-overeenkomsten-voor-deskundigenadvies): procurement/operational — not recommended.

## Other quakes in the period (below threshold, NOT recommended)

From KNMI FDSN (2025-08-01 → 2026-08-27, induced events in NL): Wirdum 2025-10-21 (1.6), Zeerijp aftershock 2025-11-14 (2.1), Westerwijtwerd 2025-11-29 (1.6), Woudbloem 2025-12-16 (2.0), Uithuizen 2026-05-07 (1.8), Appingedam 2026-05-11 (1.9), Noordbeemster 2026-07-21 (1.7), Sappemeer 2026-07-26 (1.6). All < 2.5 — none are significant enough for the timeline. (A tectonic North Sea quake 2025-09-09 mag 2.9 is not mining-related — excluded.)
