# PostgREST Endpoints — IMG Dashboard

**Materialized Views:**

- `main.regelingen_week` / `main.regelingen_maand`
- `main.gemeenten_week` / `main.gemeenten_maand`

---

## 1. regelingen_view

**Endpoints:**

```
GET /regelingen?aggregatie=week
GET /regelingen?aggregatie=maand
GET /regelingen?domein_code.eq=MW&regeling_code.eq=MW
```

**Columns (100+):**

- `aggregatie`: 'week' | 'maand'
- `periode`: jaartal (e.g., 2024)
- `periode_vanaf`: week_vanaf | maand_vanaf
- `periode_totenmet`: week_totenmet | maand_totenmet
- `domein_code`: MW, VV, IMK, WD, WNW, NAMTEG, etc.
- `regeling_code`: specific regeling within domain

**Metrics:**
| Category | Columns |
|----------|---------|
| **Status** | ingediend_aantal, afgerond_aantal, beschikt_aantal, toegekend_aantal, afgewezen_aantal, anders_afgehandeld_aantal |
| **Cumulatie** | \*\_cumul, toegekend_cumul_perc, beschikt_binn_termijn_cumul_perc |
| **Bedragen** | bedrag_beschikt_schade_eur, bedrag_beschikt_totaal_eur, bedrag_betaald_schade_eur, bedrag_betaald_totaal_eur |
| **Voorraad** | voorraad_cumul, voorraad_verschil |
| **Snelheid** | beslistermijn_dagen, oud_voorraad_gemiddeld_dagen, oud_voorraad_mediaan_dagen, dlt_verwacht_rolling8_dagen, dlt_gerealiseerd_gemiddeld_dagen |
| **Termijngevolgd** | oud_voorraad_binnen_termijn, oud_voorraad_1_2_termijn, oud_voorraad_2_4_termijn, oud_voorraad_buiten_4_termijn, beschikt_binn_termijn_aantal, beschikt_binn_termijn_perc |

**Sub-regelingen (PEAG):**

- `peag_maatwerk_afgerond_aantal`, `peag_herstel_afgerond_aantal`, `peag_vv_afgerond_aantal`

**Sub-regelingen (IM):**

- `im_aanvulling_toegekend_aantal`

**Sub-regelingen (BZ):**

- `bz_ingediend_aantal`, `bz_afgerond_aantal`, `bz_beschikt_aantal`, `bz_toegekend_aantal`, `bz_afgewezen_aantal`, `bz_anders_afgehandeld_aantal`, `bz_voorraad_cumul`, `bz_vertraagd_jaar_perc`

**Sub-regelingen (AOS):**

- `aos_ingediend_aantal`, `aos_gegrond_aantal`

**Sub-regelingen (SP):**

- `sp_mkb_...`, `sp_agro_...`, `sp_erfgoed_...`, `sp_overig_...`
- Columns: ingediend, beschikt, toegekend, afgewezen, afgerond, anders_afgeh

**Other Sub-regelingen:**

- `toegekend_avv_aantal`, `toegekend_ves_aantal`
- `toegekend_mv_aantal`
- `toegekend_hea_aantal`, `toegekend_hai_aantal`, `toegekend_hea_hai_aantal`
- `toegekend_dzh_aantal`
- `toegekend_vhv_aantal`

---

## 2. gemeenten_view

**Endpoints:**

```
GET /gemeenten?aggregatie=week
GET /gemeenten?aggregatie=maand
GET /gemeenten?gemeente=Groningen
```

**Columns (40+):**

- `aggregatie`: 'week' | 'maand'
- `periode`: jaartal
- `periode_vanaf`: week_vanaf | maand_vanaf
- `periode_totenmet`: week_totenmet | maand_totenmet
- `gemeente`: municipality name
- `domein_code`: MAPPED (MW→FYSIEK, IMK→IMS, WD/WNW/NAMTEG→WDL)
- `regeling_code`: NORMALIZED (same as above)

**Metrics:**
| Category | Columns |
|----------|---------|
| **Status** | ingediend_aantal, beschikt_aantal, toegekend_aantal, afgewezen_aantal, anders_afgehandeld_aantal, afgerond_aantal |
| **Bedragen** | bedrag_verleend_schade_eur, bedrag_verleend_schade_cumul_eur, bedrag_verleend_totaal_eur, bedrag_verleend_totaal_cumul_eur |

**Sub-regelingen:**

- `toegekend_avv_aantal`, `toegekend_ves_aantal`
- `toegekend_mv_aantal`
- `toegekend_hai_aantal`, `toegekend_hea_aantal`, `toegekend_hea_hai_aantal`
- `toegekend_vhv_aantal`
- `toegekend_dzh_aantal`

---

## Domain → Regeling Mapping

```sql
-- Domain mapping
CASE
  WHEN domein_code IN ('MW', 'VV') THEN 'FYSIEK'
  WHEN domein_code = 'IMK' THEN 'IMS'
  WHEN domein_code IN ('WD', 'WNW', 'NAMTEG') THEN 'WDL'
  ELSE domein_code
END

-- Regeling normalization
CASE
  WHEN regeling_code IN ('FYSIEK', 'IMS', 'WDL') THEN domein_code
  ELSE regeling_code
END
```

---

## Usage Examples

### Get all regelingen data (monthly)

```
GET /regelingen?select=*&aggregatie=eq.maand
```

### Filter by domain and regeling

```
GET /regelingen?select=*&domein_code.eq=MW&regeling_code.eq=MW&aggregatie=eq.week
```

### Get specific municipality (gemeenten view)

```
GET /gemeenten?select=*&gemeente.eq=Groningen&aggregatie=eq.maand
```

### Combine week + maand data

```
GET /regelingen?select=*&aggregatie=eq.week&domein_code.eq=MW
GET /regelingen?select=*&aggregatie=eq.maand&domein_code.eq=MW
```
