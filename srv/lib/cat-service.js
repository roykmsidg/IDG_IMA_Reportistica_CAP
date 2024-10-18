const cds = require("@sap/cds");
const { response } = require("express");
// const fetch = require("node-fetch");

// TODO: Return the value with the dynamic filters

module.exports = class CatalogService extends cds.ApplicationService {
  log;

  init() {
    this.log = cds.log("reportistica", {
      label: "reportistica.IDGFAB",
    });
    this.log.info("Service OperationService start.");
    
    return super.init();
  }


  async CreateQuery(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
    let whereClauses = [];

	    // Controllo per il parametro Entity (obbligatorio e array)
		if (Array.isArray(entity) && entity.length > 0) {
			whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Tipo Contratto (obbligatorio e array)
		if (Array.isArray(tipoContratto) && tipoContratto.length > 0) {
			whereClauses.push('"RECNTYPE" IN (' + tipoContratto.map(tc => `'${tc}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Tipo Contratto' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Contratto (facoltativo e array)
		if (contratto) {
			if (Array.isArray(contratto)) {
				if(contratto.length > 0){
					whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
				}
			} else {
				whereClauses.push('"RECNNR" = \'' + contratto + '\'');
			}
		}
	
		// Controllo per il parametro Year (obbligatorio e non array)
		if (year !== null && year !== undefined) {
			whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
		} else {
			throw new Error("Il parametro 'Year' è obbligatorio.");
		}
	
		// Controllo per il parametro Period (obbligatorio e non array)
		if (period !== null && period !== undefined) {
			whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
		} else {
			throw new Error("Il parametro 'Period' è obbligatorio.");
		}
	
		// Controllo per il parametro Cost Center (facoltativo e array)
		if (Array.isArray(costCenter)) {
			if(costCenter.length > 0) {
				whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
			}
		} else if (costCenter) {
			whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
		}

				// Controllo per il parametro Year (obbligatorio e non array)
		if (Id_storico !== null && Id_storico !== undefined) {
			whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
		} else {
			throw new Error("Il parametro 'Id_storico' è obbligatorio.");
		}
	
		// Costruzione della query finale
		let sqlQuery = ''; // Sostituisci con il nome della tua tabella
		if (whereClauses.length > 0) {
			sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
		}
	
		return sqlQuery;
	}

  async CreateQueryWithMinor(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
		let whereClauses = [];
	
			// Controllo per il parametro Entity (obbligatorio e array)
			if (Array.isArray(entity) && entity.length > 0) {
				whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
			} else {
				throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
			}
		
			// Controllo per il parametro Tipo Contratto (obbligatorio e array)
			if (Array.isArray(tipoContratto) && tipoContratto.length > 0) {
				whereClauses.push('"RECNTYPE" IN (' + tipoContratto.map(tc => `'${tc}'`).join(', ') + ')');
			} else {
				throw new Error("Il parametro 'Tipo Contratto' è obbligatorio e deve essere un array.");
			}
		
			// Controllo per il parametro Contratto (facoltativo e array)
			if (contratto) {
				if (Array.isArray(contratto)) {
					if(contratto.length > 0){
						whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
					}
				} else {
					whereClauses.push('"RECNNR" = \'' + contratto + '\'');
				}
			}
		
			// Controllo per il parametro Year (obbligatorio e non array)
			if (year !== null && year !== undefined) {
				whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
			} else {
				throw new Error("Il parametro 'Year' è obbligatorio.");
			}
		
			// Controllo per il parametro Period (obbligatorio e non array)
			if (period !== null && period !== undefined) {
				whereClauses.push('TO_INT("PERIODDUEDATE") <= ' + period);
			} else {
				throw new Error("Il parametro 'Period' è obbligatorio.");
			}
		
			// Controllo per il parametro Cost Center (facoltativo e array)
			if (Array.isArray(costCenter)) {
				if(costCenter.length > 0) {
					whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
				}
			} else if (costCenter) {
				whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
			}
	
					// Controllo per il parametro Year (obbligatorio e non array)
			if (Id_storico !== null && Id_storico !== undefined) {
				whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
			} else {
				throw new Error("Il parametro 'Id_storico' è obbligatorio.");
			}
		
			// Costruzione della query finale
			let sqlQuery = ''; // Sostituisci con il nome della tua tabella
			if (whereClauses.length > 0) {
				sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
			}
		
			return sqlQuery;
		}


async GetTabellaFiltrata(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {

	let query = await this.CreateQuery(entity, tipoContratto, contratto, year, period, costCenter, Id_storico)

	let queryWithMinor = await this.CreateQueryWithMinor(entity, tipoContratto, contratto, year, period, costCenter, Id_storico)

	this.log.info(query)
	this.log.info("query 2 ", queryWithMinor)



    try{
        const filteredTable = await cds.db.run(`SELECT "XMBEZ" AS "ASSET_CLASS",
    "INTERCOMPANY",
    "IDENTOBJNR" AS "CDC",
    "KTEXT" AS "CDC_CODE",
    "RECNTXTOLD" AS "LEASE_N",
    "RECNNR" AS "CONTRACT_CODE",
    "GSBER" AS "ACC_SECTOR",
    "RECNTXT" AS "CONTRACT_DESCRIPTION",
    "ZZSOCIETA" AS "MERGED_ENTITY",
    SUM("RIGHT_OF_USE") AS "RIGHT_OF_USE",
    SUM("ACCUMULATED_DEPRECIATION") AS "ACCUMULATED_DEPRECIATION",
    SUM("NET_RIGHT_OF_USE") AS "NET_RIGHT_OF_USE",
    SUM("CLOSING_LEASES_LIABILITIES") AS "CLOSING_LEASES_LIABILITIES",
    SUM("LEASE_LIABILITIES_SHORT_TERM") AS "LEASE_LIABILITIES_SHORT_TERM",
    SUM("LEASE_LIABILITIES_LONG_TERM") AS "LEASE_LIABILITIES_LONG_TERM",
    SUM("YTD_INTEREST") AS "YTD_INTEREST",
    SUM("LEASE_COST") AS "LEASE_COST",
    SUM("DEPRECIATION") AS "DEPRECIATION",
    0 AS "GAIN_FX_RATES",
    0 AS "LOSS_FX_RATES"
FROM (
-- Prima query

    SELECT "XMBEZ",
        CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        TO_DECIMAL('0') AS "RIGHT_OF_USE",
        SUM("FONDO_AMM_CUM") AS "ACCUMULATED_DEPRECIATION",
        SUM("BBWHR_DEPRECIATION_SUM_END") AS "NET_RIGHT_OF_USE",
        SUM("BBWHR_LIABILITY_SUM_END") AS "CLOSING_LEASES_LIABILITIES",
        SUM(DEBITO_BTERM) AS "LEASE_LIABILITIES_SHORT_TERM",
        SUM(DEBITO_LTERM) + SUM("DEBITO_MTERM") AS "LEASE_LIABILITIES_LONG_TERM",
        TO_DECIMAL('0') AS "YTD_INTEREST",
        TO_DECIMAL('0') AS "LEASE_COST",
        TO_DECIMAL('0') AS "DEPRECIATION",
        TO_DECIMAL('0') AS "GAIN_FX_RATES",
        TO_DECIMAL('0') AS "LOSS_FX_RATES"
    FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
    ${query}
       
    GROUP BY "XMBEZ",
        "ZZPARTNER",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
    UNION ALL 
-- Seconda query

    SELECT "XMBEZ",
        CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        TO_DECIMAL('0') AS "RIGHT_OF_USE",
        TO_DECIMAL('0') AS "ACCUMULATED_DEPRECIATION",
        TO_DECIMAL('0') AS "NET_RIGHT_OF_USE",
        TO_DECIMAL('0') AS "CLOSING_LEASES_LIABILITIES",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_SHORT_TERM",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_LONG_TERM",
        SUM("BBWHR_INTEREST") AS "YTD_INTEREST",
        SUM("BBWHR_PAYMENT") AS "LEASE_COST",
        SUM("BBWHR_DEPRECIATION") AS "DEPRECIATION",
        TO_DECIMAL('0') AS "GAIN_FX_RATES",
        TO_DECIMAL('0') AS "LOSS_FX_RATES"
    FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
    ${queryWithMinor}
         
    GROUP BY "XMBEZ",
        "ZZPARTNER",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
    UNION ALL
-- Terza query per il calcolo del RIGHT OF USE

    SELECT "XMBEZ",
        "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        SUM("PRICE_SROU") + SUM("BBWHR_ACQUISITION") AS "RIGHT_OF_USE",
        TO_DECIMAL('0') AS "ACCUMULATED_DEPRECIATION",
        TO_DECIMAL('0') AS "NET_RIGHT_OF_USE",
        TO_DECIMAL('0') AS "CLOSING_LEASES_LIABILITIES",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_SHORT_TERM",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_LONG_TERM",
        TO_DECIMAL('0') AS "YTD_INTEREST",
        TO_DECIMAL('0') AS "LEASE_COST",
        TO_DECIMAL('0') AS "DEPRECIATION",
        TO_DECIMAL('0') AS "GAIN_FX_RATES",
        TO_DECIMAL('0') AS "LOSS_FX_RATES"
    FROM (
        SELECT t1."XMBEZ",
            CASE WHEN t1."ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
            t1."IDENTOBJNR",
            t1."KTEXT",
            t1."RECNTXTOLD",
            t1."RECNNR",
            t1."GSBER",
            t1."RECNTXT",
            t1."ZZSOCIETA",
            CASE WHEN ((t1."PRICE_SROU" > 0.00) AND (NOT (t1."RECNDPO" = t1."RECNBEG")) AND (t1."RECNTXTOLD" != '')) THEN t1."BBWHR_ACQUISITION" * -1 ELSE 0 END AS "BBWHR_ACQUISITION",
            t1."PRICE_SROU"
        FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2" t1
        JOIN (
            SELECT RECNNR,
                "IDENTOBJNR",
                "YEARDUEDATE",
                MIN("PERIODDUEDATE") AS min_period
            FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
            ${queryWithMinor}
                  
            GROUP BY "RECNNR",
                "IDENTOBJNR",
                "YEARDUEDATE"
        ) t2 ON t1.RECNNR = t2.RECNNR AND t1."IDENTOBJNR" = t2."IDENTOBJNR" AND t1."PERIODDUEDATE" = t2.min_period AND t1."YEARDUEDATE" = t2."YEARDUEDATE"
        UNION ALL
        SELECT t1."XMBEZ",
            CASE WHEN t1."ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
            t1."IDENTOBJNR",
            t1."KTEXT",
            t1."RECNTXTOLD",
            t1."RECNNR",
            t1."GSBER",
            t1."RECNTXT",
            t1."ZZSOCIETA",
            t1."BBWHR_ACQUISITION",
            t1."PRICE_SROU"
        FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2" t1
         ${queryWithMinor}
               
    ) AS CalcRightOfUse
    GROUP BY "XMBEZ",
        "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
) AS all_results
GROUP BY "XMBEZ",
    "INTERCOMPANY",
    "IDENTOBJNR",
    "KTEXT",
    "RECNTXTOLD",
    "RECNNR",
    "GSBER",
    "RECNTXT",
    "ZZSOCIETA";`);
  

			console.log(filteredTable);
            return filteredTable

    }
    catch(error){
        this.log.error
        throw error
    }
}
//   async CreateQuery(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = []) {
//     let whereClauses = [];

// 	    // Controllo per il parametro Entity (obbligatorio e array)
// 		if (Array.isArray(entity) && entity.length > 0) {
// 			whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
// 		} else {
// 			throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
// 		}
	
// 		// Controllo per il parametro Tipo Contratto (obbligatorio e array)
// 		if (Array.isArray(tipoContratto) && tipoContratto.length > 0) {
// 			whereClauses.push('"RECNTYPE" IN (' + tipoContratto.map(tc => `'${tc}'`).join(', ') + ')');
// 		} else {
// 			throw new Error("Il parametro 'Tipo Contratto' è obbligatorio e deve essere un array.");
// 		}
	
// 		// Controllo per il parametro Contratto (facoltativo e array)
// 		if (contratto) {
// 			if (Array.isArray(contratto)) {
// 				whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
// 			} else {
// 				whereClauses.push('"RECNNR" = \'' + contratto + '\'');
// 			}
// 		}
	
// 		// Controllo per il parametro Year (obbligatorio e non array)
// 		if (year !== null && year !== undefined) {
// 			whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
// 		} else {
// 			throw new Error("Il parametro 'Year' è obbligatorio.");
// 		}
	
// 		// Controllo per il parametro Period (obbligatorio e non array)
// 		if (period !== null && period !== undefined) {
// 			whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
// 		} else {
// 			throw new Error("Il parametro 'Period' è obbligatorio.");
// 		}
	
// 		// Controllo per il parametro Cost Center (facoltativo e array)
// 		if (Array.isArray(costCenter) && costCenter.length > 0) {
// 			whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
// 		} else if (costCenter) {
// 			whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
// 		}
	
// 		// Costruzione della query finale
// 		let sqlQuery = ''; // Sostituisci con il nome della tua tabella
// 		if (whereClauses.length > 0) {
// 			sqlQuery += ' WHERE ' + whereClauses.join(' AND ');
// 		}
	
// 		return sqlQuery;
// 	}


// async GetTabellaFiltrata(entity = [], tipoContratto = [], contratto = null, year = null, period = null, costCenter = []) {

// 	let query = this.CreateQuery(entity, tipoContratto, contratto, year, period, costCenter)

// 	this.log.info(query)

//     try{
//         const filteredTable = await cds.db.run(`SELECT "TXK20" AS "ASSET CLASS",
// 	"INTERCOMPANY",
// 	"IDENTOBJNR" AS "CDC",
// 	"KTEXT" AS "CDC CODE",
// 	"RECNTXTOLD" AS "LEASE N",
// 	"RECNNR" AS "CONTRACT CODE",
// 	"GSBER" AS "ACC SECTOR",
// 	"RECNTXT" AS "CONTRACT DESCRIPTION",
// 	"ZZSOCIETA" AS "MERGED ENTITY",
// 	0 AS "Right of use",
// 	SUM("ACCUMULATED DEPRECIATION") AS "ACCUMULATED DEPRECIATION",
// 	SUM("NET RIGHT OF USE") AS "NET RIGHT OF USE",
// 	SUM("CLOSING LEASES LIABILITIES") AS "CLOSING LEASES LIABILITIES",
// 	SUM("LEASE LIABILITIES SHORT TERM") AS "LEASE LIABILITIES SHORT TERM",
// 	SUM("LEASE LIABILITIES LONG TERM") AS "LEASE LIABILITIES LONG TERM",
// 	SUM("YTD INTEREST") AS "YTD INTEREST",
// 	SUM("LEASE COST") AS "LEASE COST",
// 	SUM("DEPRECIATION") AS "DEPRECIATION",
// 	0 AS "Gain Fx Rates",
// 	0 AS "Loss Fx Rates"
// FROM (
// -- Prima query

// 		SELECT "TXK20",
// 			CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
// 			"IDENTOBJNR",
// 			"KTEXT",
// 			"RECNTXTOLD",
// 			"RECNNR",
// 			"GSBER",
// 			"RECNTXT",
// 			"ZZSOCIETA",
// 			SUM("FONDO_AMM_CUM") AS "ACCUMULATED DEPRECIATION",
// 			SUM("BBWHR_DEPRECIATION_SUM_END") AS "NET RIGHT OF USE",
// 			SUM("BBWHR_LIABILITY_SUM_END") AS "CLOSING LEASES LIABILITIES",
// 			SUM(DEBITO_BTERM) AS "LEASE LIABILITIES SHORT TERM",
// 			SUM(DEBITO_LTERM) + SUM("DEBITO_MTERM") AS "LEASE LIABILITIES LONG TERM",
// 			TO_DECIMAL('0') AS "YTD INTEREST",
// 			TO_DECIMAL('0') AS "LEASE COST",
// 			TO_DECIMAL('0') AS "DEPRECIATION"
// 		FROM "CATALOGSERVICE_VIEW_ALL_DATA"
// 		 WHERE "BUKRS" IN ('ATOP') AND "RECNNR" = '0000001500006' AND "YEARDUEDATE" = '2024' AND TO_INT("PERIODDUEDATE") = 12 AND "IDENTOBJNR" IN ('000175AT20')
// 		GROUP BY "TXK20",
// 			"ZZPARTNER",
// 			"IDENTOBJNR",
// 			"KTEXT",
// 			"RECNTXTOLD",
// 			"RECNNR",
// 			"GSBER",
// 			"RECNTXT",
// 			"ZZSOCIETA"
// 		UNION ALL 
// -- Seconda query

// 		SELECT "TXK20",
// 			CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
// 			"IDENTOBJNR",
// 			"KTEXT",
// 			"RECNTXTOLD",
// 			"RECNNR",
// 			"GSBER",
// 			"RECNTXT",
// 			"ZZSOCIETA",
// 			TO_DECIMAL('0') AS "ACCUMULATED DEPRECIATION",
// 			TO_DECIMAL('0') AS "NET RIGHT OF USE",
// 			TO_DECIMAL('0') AS "CLOSING LEASES LIABILITIES",
// 			TO_DECIMAL('0') AS "LEASE LIABILITIES SHORT TERM",
// 			TO_DECIMAL('0') AS "LEASE LIABILITIES LONG TERM",
// 			SUM("BBWHR_INTEREST") AS "YTD INTEREST",
// 			SUM("BBWHR_PAYMENT") AS "LEASE COST",
// 			SUM("BBWHR_DEPRECIATION") AS "DEPRECIATION"
// 		FROM "CATALOGSERVICE_VIEW_ALL_DATA"
// 		 WHERE "BUKRS" IN ('ATOP') AND "RECNNR" = '0000001500006' AND "YEARDUEDATE" = '2024' AND TO_INT("PERIODDUEDATE") = 12 AND "IDENTOBJNR" IN ('000175AT20')
// 		GROUP BY "TXK20",
// 			"ZZPARTNER",
// 			"IDENTOBJNR",
// 			"KTEXT",
// 			"RECNTXTOLD",
// 			"RECNNR",
// 			"GSBER",
// 			"RECNTXT",
// 			"ZZSOCIETA") AS combined_results
// GROUP BY "TXK20",
// 	"INTERCOMPANY",
// 	"IDENTOBJNR",
// 	"KTEXT",
// 	"RECNTXTOLD",
// 	"RECNNR",
// 	"GSBER",
// 	"RECNTXT",
// 	"ZZSOCIETA";`);
  

// 			console.log(filteredTable);
//             return filteredTable;

//     }
//     catch(error){
//         this.log.error
//         throw error
//     }
// }


async Filters() {
	console.log("Filters action invoked");
	
	const {GV_FILTRI_ID22} = cds.entities();

	this.log.info({GV_FILTRI_ID22});
	
	// Esegui la query con DISTINCT e logga i risultati
	const distinctData = await cds.run(
		SELECT.distinct.from('CATALOGSERVICE_GV_FILTRI_ID22').columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
	);
	
	console.log("Query executed, result:", distinctData);
	
	if (!distinctData || distinctData.length === 0) {
		console.warn("No data found.");
		return [];
	}
	
        // Usa Set per rimuovere automaticamente i duplicati
        const butxt = new Set();
        const recntype = new Set();
        const recnnr = new Set();
        const yearduedate = new Set();
        const periodduedate = new Set();
        const cdc = new Set();
        const bukrs = new Set();
		const id_storico = new Set();

        
        // Loop attraverso i dati distinti e popola i set
        distinctData.forEach(row => {
            butxt.add(row.BUTXT);
            recntype.add(row.RECNTYPE);
            recnnr.add(row.RECNNR);
            yearduedate.add(row.YEARDUEDATE);
            periodduedate.add(row.PERIODDUEDATE);
            cdc.add(row.IDENTOBJNR);
            bukrs.add(row.BUKRS);
			id_storico.add(row.ID_STORICO);

        });
        
        // Converte i set in array
        const BUTXT = Array.from(butxt);
        const RECNTYPE = Array.from(recntype);
        const RECNNR = Array.from(recnnr);
        const YEARDUEDATE = Array.from(yearduedate);
        const PERIODDUEDATE = Array.from(periodduedate);
        const CDC = Array.from(cdc);
        const BUKRS = Array.from(bukrs);
		const ID_STORICO = Array.from(id_storico);

        
        console.log("butxt array:", BUTXT);
        console.log("recntype array:", RECNTYPE);
        console.log("recnnr array:", RECNNR);
        console.log("yearduedate array:", YEARDUEDATE);
        console.log("periodduedate array:", PERIODDUEDATE);
        console.log("cdc array:", CDC);
        console.log("bukrs array:", BUKRS);
		console.log("Id_storico array:", ID_STORICO);
        
        // Ritorna gli array
        return {
            BUTXT: BUTXT,
            RECNTYPE: RECNTYPE,
            RECNNR: RECNNR,
            YEARDUEDATE: YEARDUEDATE,
            PERIODDUEDATE: PERIODDUEDATE,
            CDC: CDC,
            BUKRS: BUKRS,
			ID_STORICO: ID_STORICO
        };
}
}