    WITH berekeningen AS (
    SELECT 
        replace(lower(basis_1.gemeente), ' ', '-') AS gemeente,
        monthly.d AS _date,
        monthly._yearmonth AS _yearmonth
    FROM (
        SELECT 
            to_char(_b.datum - INTERVAL '7 days', 'YYYYMM') AS _yearmonth,
            (date_trunc('month'::text, MIN(_b.datum) OVER (PARTITION BY to_char(_b.datum - INTERVAL '7 days', 'YYYYMM'))::timestamp) + INTERVAL '6 days')::date AS d
        FROM api.fs_basis _b
    ) monthly
    JOIN api.fs_basis basis_1 
        ON monthly._yearmonth = to_char(basis_1.datum - INTERVAL '7 days', 'YYYYMM')
        AND monthly.d = basis_1.datum::date
)
SELECT b.gemeente,
    basis.datum,
    basis.totaal_meldingen_cumulatief,
    basis.totaal_meldingen_cumulatief - lag(basis.totaal_meldingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS totaal_meldingen,
    basis.totaal_werkvoorraad,
    basis.totaal_afgehandeld_cumulatief,
    basis.totaal_afgehandeld_cumulatief - lag(basis.totaal_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS totaal_afgehandeld,
    basis.totaal_verleend_bedrag_cumulatief,
    basis.totaal_verleend_bedrag_cumulatief - lag(basis.totaal_verleend_bedrag_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS totaal_verleend_bedrag,
    basis.totaal_afwijzingen_cumulatief,
    basis.totaal_afwijzingen_cumulatief - lag(basis.totaal_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS totaal_afwijzingen,
    basis.maatwerk_meldingen_cumulatief,
    basis.maatwerk_meldingen_cumulatief - lag(basis.maatwerk_meldingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS maatwerk_meldingen,
    basis.maatwerk_werkvoorraad,
    basis.maatwerk_afgehandeld_cumulatief,
    basis.maatwerk_afgehandeld_cumulatief - lag(basis.maatwerk_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS maatwerk_afgehandeld,
    basis.maatwerk_verleend_bedrag_cumulatief,
    basis.maatwerk_verleend_bedrag_cumulatief - lag(basis.maatwerk_verleend_bedrag_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS maatwerk_verleend_bedrag,
    basis.maatwerk_afgehandeld_cumulatief - basis.maatwerk_afwijzingen_cumulatief AS maatwerk_toekenningen_cumulatief,
    (basis.maatwerk_afgehandeld_cumulatief - lag(basis.maatwerk_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum)) - basis.maatwerk_afwijzingen_cumulatief - lag(basis.maatwerk_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS maatwerk_toekenningen,
    basis.maatwerk_afwijzingen_cumulatief,
    basis.maatwerk_afwijzingen_cumulatief - lag(basis.maatwerk_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS maatwerk_afwijzingen,
    basis.vaste_vergoeding_meldingen_cumulatief,
    basis.vaste_vergoeding_meldingen_cumulatief - lag(basis.vaste_vergoeding_meldingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS vaste_vergoeding_meldingen,
    basis.vaste_vergoeding_werkvoorraad,
    basis.vaste_vergoeding_afgehandeld_cumulatief,
    basis.vaste_vergoeding_afgehandeld_cumulatief - lag(basis.vaste_vergoeding_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS vaste_vergoeding_afgehandeld,
    basis.vaste_vergoeding_verleend_bedrag_cumulatief,
    basis.vaste_vergoeding_verleend_bedrag_cumulatief - lag(basis.vaste_vergoeding_verleend_bedrag_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS vaste_vergoeding_verleend_bedrag,
    basis.vaste_vergoeding_afgehandeld_cumulatief - basis.vaste_vergoeding_afwijzingen_cumulatief AS vaste_vergoeding_toekenningen_cumulatief,
    basis.vaste_vergoeding_afgehandeld_cumulatief - lag(basis.vaste_vergoeding_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) - (basis.vaste_vergoeding_afwijzingen_cumulatief - lag(basis.vaste_vergoeding_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum)) AS vaste_vergoeding_toekenningen,
    basis.vaste_vergoeding_afwijzingen_cumulatief,
    basis.vaste_vergoeding_afwijzingen_cumulatief - lag(basis.vaste_vergoeding_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS vaste_vergoeding_afwijzingen,
    basis.aanvullende_vaste_vergoeding_meldingen_cumulatief,
    lag(basis.aanvullende_vaste_vergoeding_meldingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_meldingen,
    basis.aanvullende_vaste_vergoeding_werkvoorraad,
    basis.aanvullende_vaste_vergoeding_afgehandeld_cumulatief,
    basis.aanvullende_vaste_vergoeding_afgehandeld_cumulatief - lag(basis.aanvullende_vaste_vergoeding_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_afgehandeld,
    basis.aanvullende_vaste_vergoeding_verleend_bedrag_cumulatief,
    basis.aanvullende_vaste_vergoeding_verleend_bedrag_cumulatief - lag(basis.aanvullende_vaste_vergoeding_verleend_bedrag_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_verleend_bedrag,
    basis.aanvullende_vaste_vergoeding_afwijzingen_cumulatief,
    basis.aanvullende_vaste_vergoeding_afwijzingen_cumulatief - lag(basis.aanvullende_vaste_vergoeding_afwijzingen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_afwijzingen,
    basis.aanvullende_vaste_vergoeding_toekenningen_cumulatief,
    basis.aanvullende_vaste_vergoeding_toekenningen_cumulatief - lag(basis.aanvullende_vaste_vergoeding_toekenningen_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_toekenningen,
    basis.aanvullende_vaste_vergoeding_anders_afgehandeld_cumulatief,
    basis.aanvullende_vaste_vergoeding_anders_afgehandeld_cumulatief - lag(basis.aanvullende_vaste_vergoeding_anders_afgehandeld_cumulatief) OVER (ORDER BY basis.gemeente, basis.datum) AS aanvullende_vaste_vergoeding_anders_afgehandeld,
    basis._year,
    basis._month,
    basis._week,
    basis._yearmonth,
    basis._yearweek,
    basis.datum AS _einddatum,
    lag(basis.datum) OVER (ORDER BY basis.gemeente, basis.datum) AS _startdatum
FROM berekeningen b
    JOIN api.fs_basis basis ON b._yearmonth = to_char(basis.datum - INTERVAL '7 days', 'YYYYMM')
        AND b._date = basis.datum::date
ORDER BY b._date DESC;