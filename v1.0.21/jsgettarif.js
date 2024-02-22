document.getElementById("zip").addEventListener("blur", () => {
    var e = document.getElementById("zip").value,
        t = "https://api.zippopotam.us/fr/" + e;
    fetch(t)
        .then((e) => e.json())
        .then((e) => {
            var t = e.places[0]["place name"],
                a = e.country;
            (document.getElementById("ville-emprunteur").value = t),
            (document.getElementById("pays-emprunteur").value = a);
        })
        .catch((e) => {
            console.error("Erreur lors de la récupération des données:", e),
                (document.getElementById("ville-emprunteur").value =
                    "Erreur lors de la récupération des données. Veuillez réessayer.");
        });
});
document.getElementById("Zipco-emprunteur").addEventListener("blur", () => {
    var e = document.getElementById("Zipco-emprunteur").value,
        t = "https://api.zippopotam.us/fr/" + e;
    fetch(t)
        .then((e) => e.json())
        .then((e) => {
            var t = e.places[0]["place name"],
                a = e.country;
            (document.getElementById("Ville-co-emprunteur").value = t),
            (document.getElementById("Pays-co-emprunteur").value = a);
        })
        .catch((e) => {
            console.error("Erreur lors de la récupération des données:", e),
                (document.getElementById("Ville-co-emprunteur").value =
                    "Erreur lors de la récupération des données. Veuillez réessayer.");
        });
});
$(document).ready(function() {
    $('[data-toggle="datepicker"]').datepicker({
        format: "dd-mm-yyyy",
    });
    if (window.innerWidth < 768) {
        $('[data-toggle="datepicker"]').attr("readonly", "readonly");
    }
});

document
    .getElementById("co-emprunteur-non")
    .addEventListener("click", function() {
        // Sélectionnez tous les éléments avec la classe "partis-co-emprunteur"
        var elements = document.getElementsByClassName("partis-co-emprunteur");

        // Parcourir chaque élément et modifier sa visibilité
        for (var i = 0; i < elements.length; i++) {
            // Vérifiez si l'élément est visible ou non
            if (elements[i].style.display !== "none") {
                // Si l'élément est visible, le masquer
                elements[i].style.display = "none";
            } else {
                // Sinon, le rendre visible
                elements[i].style.display = "block";
            }
        }
    });
var Webflow = Webflow || [];
Webflow.push(function() {
    var l = $("#flowbaseSlider .w-slider-arrow-left");
    var r = $("#flowbaseSlider .w-slider-arrow-right");
    $("#flowbaseSlider").on("click", "#co-emprunteur-next", function(e) {
        if ($("#co-emprunteur-oui").is(":checked")) {
            r.trigger("tap");
        } else if ($("#co-emprunteur-non").is(":checked")) {
            r.trigger("tap");
            r.trigger("tap");
            r.trigger("tap");
        }
    });
    $("#flowbaseSlider").on("click", "#back-co-emprunteur", function(e) {
        if ($("#co-emprunteur-oui").is(":checked")) {
            l.trigger("tap");
        } else if ($("#co-emprunteur-non").is(":checked")) {
            l.trigger("tap");
            l.trigger("tap");
            l.trigger("tap");
        }
    });
    $("#flowbaseSlider").on("click", "#differe-next", function(e) {
        if ($("#differe-oui").is(":checked")) {
            r.trigger("tap");
        } else if ($("#differe-non").is(":checked")) {
            r.trigger("tap");
            r.trigger("tap");
        }
    });
    $("#flowbaseSlider").on("click", "#back-differe", function(e) {
        if ($("#differe-oui").is(":checked")) {
            l.trigger("tap");
        } else if ($("#differe-non").is(":checked")) {
            l.trigger("tap");
            l.trigger("tap");
        }
    });
    $("#flowbaseSlider")
        .on(
            "click",
            ".slider-left:not(#back-co-emprunteur, #back-differe)",
            function() {
                l.trigger("tap");
            }
        )
        .on(
            "click",
            ".slider-right:not(#co-emprunteur-next, #differe-next)",
            function() {
                r.trigger("tap");
            }
        );
});
$("#range_price, #range_CRD, #range_cotisation").ionRangeSlider({
    grid: !0,
    min: 5000,
    max: 35000,
    from: 2500,
    prefix: "$",
    postfix: "+",
    hide_min_max: !0,
    decorate_both: !0,
    force_edges: !0,
    step: 50,
});
$("#range_taux").ionRangeSlider({
    grid: !0,
    min: 0,
    max: 15,
    from: 6,
    postfix: "%",
    hide_min_max: !0,
    decorate_both: !0,
    force_edges: !0,
    step: 0.1,
});
$("#range_date-credit").ionRangeSlider({
    grid: !0,
    min: 1,
    max: 27,
    from_min: 1,
    from: 1,
    postfix: "ans",
    step: 1,
});
$("#range_date-differe").ionRangeSlider({
    grid: !0,
    min: 0,
    max: 24,
    from_min: 0,
    from: 0,
    postfix: "mois",
    hide_min_max: !0,
    force_edges: !0,
    step: 1,
});
$("#fetchbanque").click(function() {
    performFetchAndUpdateList();
    console.log("hello");
});
async function performFetchAndUpdateList() {
    if ($("#banque").data("fetching")) return;
    $("#banque").data("fetching", !0);
    try {
        const tokenResponse = await $.ajax({
            url: "https://demosoizic.zenioo.com/Mortgage/rest/v1/GetToken",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                Cle_partenaire: "TiTAndeMO2024",
                Code_partenaire: "F92ApnKiUAqlXEAk1hp99LegD",
            }),
        });
        const token = tokenResponse.GetTokenResponse.token;
        await updateListWithAPIdata(token);
    } finally {
        $("#banque").data("fetching", !1);
    }
}
async function updateListWithAPIdata(token) {
    const data = await $.ajax({
        url: "https://demosoizic.zenioo.com/Mortgage/rest/v1/GetBanks",
        method: "GET",
        headers: {
            Authorization: token,
        },
    });
    const $banqueSelect = $("#banque");
    $banqueSelect.empty();
    data.organismes_preteurs.forEach(function(org) {
        const $option = $("<option>")
            .val(org.id_organisme_preteur)
            .text(org.raison_sociale);
        $banqueSelect.append($option);
    });
}

function calculerMoisRestants(
    montantPret,
    tauxInteret,
    dureePretAnnees,
    differeRemboursementMois,
    dateString
) {
    // Convertir la durée du prêt en mois
    var dureePretMois = dureePretAnnees * 12;

    // Récupérer la date de début du prêt depuis le paramètre dateString
    var dateDebutPret = new Date(dateString);

    // Récupérer la date actuelle
    var dateActuelle = new Date();

    // Calculer le nombre de mois écoulés depuis le début du prêt, en tenant compte du différé de remboursement
    var differenceMois =
        (dateActuelle.getFullYear() - dateDebutPret.getFullYear()) * 12 +
        (dateActuelle.getMonth() - dateDebutPret.getMonth());
    differenceMois -= differeRemboursementMois;
    differenceMois = Math.max(0, differenceMois);

    // Calculer le nombre de mois restants jusqu'à la fin du prêt
    var moisRestants = dureePretMois - differenceMois;

    // Retourner le nombre de mois restants
    return moisRestants;
}

function calculerMensualite(
    montantPret,
    tauxInteret,
    dureePretAnnees,
    differeRemboursementMois,
    dateString
) {
    // Convertir la durée du prêt en mois
    var dureePretMois = dureePretAnnees * 12;

    // Convertir le taux d'intérêt annuel en taux mensuel (en décimale)
    var tauxInteretMensuel = tauxInteret / 100 / 12;

    // Calculer la mensualité (formule 2)
    var mensualite =
        (montantPret * tauxInteretMensuel) /
        (1 - Math.pow(1 + tauxInteretMensuel, -dureePretMois));

    // Récupérer la date de début du prêt depuis le paramètre dateString
    var dateDebutPret = new Date(dateString);

    // Récupérer la date actuelle
    var dateActuelle = new Date();

    // Calculer le nombre de mois écoulés depuis le début du prêt, en tenant compte du différé de remboursement
    var differenceMois =
        (dateActuelle.getFullYear() - dateDebutPret.getFullYear()) * 12 +
        (dateActuelle.getMonth() - dateDebutPret.getMonth());
    differenceMois -= differeRemboursementMois;
    differenceMois = Math.max(0, differenceMois);

    // Calculer le capital restant dû (formule 1)
    var capitalRestantDu =
        (mensualite *
            (1 -
                Math.pow(1 + tauxInteretMensuel, -(dureePretMois - differenceMois)))) /
        tauxInteretMensuel;
    console.log("Capital restant dû: " + capitalRestantDu);
    $("#capitalRestantDu-2").val(capitalRestantDu.toFixed(2));
    $('#capitalRestantDu-2').prop('disabled', true);

    // Retourner la mensualité calculée
    return mensualite.toFixed(2);
}
// Récupérer les valeurs des éléments HTML
$("#go_calcule, #differe-next , triggerTarifs").click(function() {
    var mensualite = calculerMensualite(
        parseFloat(document.getElementById("montant-du-pret-2").value),
        parseFloat(document.getElementById("range_taux").value),
        parseFloat(document.getElementById("range_date-credit").value),
        parseFloat(document.getElementById("range_date-differe").value) || 0,
        document.getElementById("date_effet-2").value
    );

    $('#mensualit-sans-assurance').text("Nous vous affichons le montant de la mensualité sans assurance de " + mensualite + "€, (vous pouvez l utiliser comme base)");
    console.log("Mensualité calculée: " + mensualite);
});




$("#triggerTarifs").click(function() {
    GetToken();
});
async function GetToken() {
    if ($("#triggerTarifs").data("fetching")) return;
    $("#triggerTarifs").data("fetching", !0);
    try {
        const tokenResponse = await $.ajax({
            url: "https://demosoizic.zenioo.com/Mortgage/rest/v1/GetToken",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                Cle_partenaire: "TiTAndeMO2024",
                Code_partenaire: "F92ApnKiUAqlXEAk1hp99LegD",
            }),
        });
        const token = tokenResponse.GetTokenResponse.token;
        await GetTariffs(token);
    } finally {
        $("#triggerTarifs").data("fetching", !1);
    }
}
async function GetTariffs(token) {
    var resultats = {};
    $("input, textarea, select").each(function() {
        var type = $(this).attr("type");
        var name = $(this).attr("id");
        var value = $(this).val();
        if (type === "checkbox" || type === "radio") {
            value = $(this).is(":checked") ? $(this).val() : null;
        }
        if (value !== null && value !== undefined) {
            resultats[name] = value;
        }
    });
    $(".datepicker input").each(function() {
        var name = $(this).attr("id");
        var value = $(this).val();
        if (value) {
            resultats[name] = value;
        }
    });
    console.log(resultats);
    var dateActuelle = moment();

// Ajoute 2 mois à la date actuelle
var dateDansDeuxMois = dateActuelle.add(2, 'months');

// Formate la date dans le format YYYY-MM-DD
var dateFormatee = dateDansDeuxMois.format("YYYY-MM-DD");
    var jsonToSend = {
        login_courtier_zenioo: "henrycourtierstd@yopmail.com",
        code_courtier_zenioo: "AAOG",
        id_projet_partenaire: "EMP12334",
        code_produit: "MP80",
        taux_commission: "50/15",
        contrat: {
            type_projet: "residence_principale",
            type_contrat: "nouveau_pret",
            date_effet: dateFormatee,
        },
        beneficiaires: [{
            rang_beneficiaire: "1",
            role: "souscripteur",
            type_assure: "emprunteur",
            date_naissance: "1999-05-04",
            code_postal: "69008",
            statut_professionnel: "salarie",
            risque_km_pro: "aucun",
            risque_travail_hauteur: "inf_15m",
            risque_port_charges: "sup_15kg",
            risque_fumeur: "non_fumeur",
            risque_ppe: "aucun",
            encours_inf_200000: "sup_200000",
            frais_courtage: "0",
        }, ],
        prets: [{
            rang_pret: "1",
            crd: "",
            type_pret: "amortissable",
            taux_pret: "1.5",
            duree_remboursement_mois: "185",
            dont_differe_mois: "0",
        }, ],
        garanties: [{
            rang_beneficiaire: "1",
            quotite: "80",
            package_garanties: "DC-IPT-MNO",
            franchise: "90",
        }, ],
    };
    jsonToSend.prets[0].duree_remboursement_mois = parseFloat(document.getElementById("range_date-credit").value)*12;
    var dateOrigine = resultats.date_naissance_emprunteur;
    var dateActuelle = moment();

// Ajoute 2 mois à la date actuelle
var dateDansDeuxMois = dateActuelle.add(2, 'months');

// Formate la date dans le format YYYY-MM-DD
var dateFormatee = dateDansDeuxMois.format("YYYY-MM-DD");
    jsonToSend.beneficiaires[0].date_naissance = dateFormatee;
    jsonToSend.beneficiaires[0].code_postal = resultats.zip;
    jsonToSend.contrat.type_projet = resultats.type_projet;
    jsonToSend.prets[0].taux_pret = resultats.range_taux;
    jsonToSend.prets[0].crd = resultats["capitalRestantDu-2"];
    if (resultats["differe-oui"] === "on") {
        jsonToSend.prets[0].dont_differe_mois = resultats["range_date-differe"];
    }

    jsonToSend.beneficiaires[0].risque_fumeur =
        resultats["Is-Fumeur-Oui"] === "on" ? "fumeur" : "non_fumeur";
    let charges;
    if (resultats["risque_port_charges-15kg"] === "on") {
        charges = "inf_15kg";
    } else if (resultats["risque_port_charges-non"] === "on") {
        charges = "aucun";
    } else if (resultats["risque_port_charges-plus15kg"] === "on") {
        charges = "sup_15kg";
    }
    jsonToSend.beneficiaires[0].risque_port_charges = charges;
    let valeurHauteur;
    if (resultats["risque_travail_hauteur-15m"] === "on") {
        valeurHauteur = "inf_15m";
    } else if (resultats["risque_travail_hauteur-non"] === "on") {
        valeurHauteur = "aucun";
    } else if (resultats["risque_travail_hauteur-plus15m"] === "on") {
        valeurHauteur = "sup_15m";
    } else {
        valeurHauteur = "non_defini";
    }
    jsonToSend.beneficiaires[0].risque_travail_hauteur = valeurHauteur;
    jsonToSend.beneficiaires[0].statut_professionnel = resultats.profession1;
    jsonToSend.beneficiaires[0].risque_km_pro =
        resultats["risque_km_pro-oui-2"] === "on" ? "sup_20000" : "inf_20000";
    if (resultats["quotite-50"] === "on") {
        jsonToSend.garanties[0].quotite = "50";
    }
    if (resultats["quotite-100"] === "on") {
        jsonToSend.garanties[0].quotite = "100";
    }
    if (resultats["co-emprunteur-oui"] === "on") {
        jsonToSend.beneficiaires.push({
            rang_beneficiaire: "2",
            role: "co_assure",
            type_assure: "emprunteur",
            date_naissance: "1999-05-04",
            code_postal: "69008",
            statut_professionnel: "salarie",
            risque_km_pro: "aucun",
            risque_travail_hauteur: "inf_15m",
            risque_port_charges: "sup_15kg",
            risque_fumeur: "non_fumeur",
            risque_ppe: "aucun",
            encours_inf_200000: "sup_200000",
            frais_courtage: "0",
        });
        jsonToSend.garanties.push({
            rang_beneficiaire: "2",
            quotite: "80",
            package_garanties: "DC-IPT-MNO",
            franchise: "90",
        });
        var dateOrigineCoEmprunteur = resultats["Date-Naissanceco-emprunteur-se"];
        var dateFormateeCoEmprunteur = moment(
            dateOrigineCoEmprunteur,
            "MM-DD-YYYY"
        ).format("YYYY-MM-DD");
        jsonToSend.beneficiaires[1].date_naissance = dateFormateeCoEmprunteur;
        jsonToSend.beneficiaires[1].code_postal = resultats["Zipco-emprunteur"];
        jsonToSend.beneficiaires[1].statut_professionnel =
            resultats["Profession-2co-emprunteur-se-2"];
        jsonToSend.beneficiaires[1].risque_fumeur =
            resultats["Is-Fumeur-Oui-2co-emprunteur-se"] === "on" ?
            "fumeur" :
            "non_fumeur";
        let chargesCoEmprunteur;
        if (resultats["Risque-Port-Charges-15-Kg-2co-emprunteur-se"] === "on") {
            chargesCoEmprunteur = "inf_15kg";
        } else if (
            resultats["Risque-Port-Charges-Non-2co-emprunteur-se"] === "on"
        ) {
            chargesCoEmprunteur = "aucun";
        } else if (
            resultats["Risque-Port-Charges-Plus-15-Kg-2co-emprunteur-se"] === "on"
        ) {
            chargesCoEmprunteur = "sup_15kg";
        }
        jsonToSend.beneficiaires[1].risque_port_charges = chargesCoEmprunteur;
        let valeurHauteurCoEmprunteur;
        if (resultats["Risque-Travail-Hauteur-15-M-2co-emprunteur-se"] === "on") {
            valeurHauteurCoEmprunteur = "inf_15m";
        } else if (
            resultats["Risque-Travail-Hauteur-Non-2co-emprunteur-se"] === "on"
        ) {
            valeurHauteurCoEmprunteur = "aucun";
        } else if (
            resultats["Risque-Travail-Hauteur-Plus-15-M-2co-emprunteur-se"] === "on"
        ) {
            valeurHauteurCoEmprunteur = "sup_15m";
        } else {
            valeurHauteurCoEmprunteur = "non_defini";
        }
        jsonToSend.beneficiaires[1].risque_travail_hauteur =
            valeurHauteurCoEmprunteur;
        jsonToSend.beneficiaires[1].risque_km_pro =
            resultats["Risque-Km-Pro-Oui-2co-emprunteur-se"] === "on" ?
            "sup_20000" :
            "inf_20000";
        if (resultats["co-emprunteur-oui"] === "on") {
            jsonToSend.garanties[1].quotite = "50";
        } else {
            jsonToSend.garanties[1].quotite = "100";
        }
    }
    console.log(jsonToSend);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);
    const data = await $.ajax({
        url: "https://demosoizic.zenioo.com/Mortgage/rest/v1/GetTariffs",
        method: "POST",
        headers: {
            Authorization: token,
        },
        contentType: "application/json",
        data: JSON.stringify(jsonToSend),
    });
    var differenceMois_1 =calculerMoisRestants(
        parseFloat(document.getElementById("montant-du-pret-2").value),
        parseFloat(document.getElementById("range_taux").value),
        parseFloat(document.getElementById("range_date-credit").value),
        parseFloat(document.getElementById("range_date-differe").value) || 0,
        document.getElementById("date_effet-2").value
    );
    console.log("differenceMois : " + differenceMois_1);

    // Calcul initial de la cotisation mensuelle
    var Cotisation_mensuelle ; 
    if (data.Tarif_beneficiaire.length >= 2) {
        Cotisation_mensuelle = data.Tarif_beneficiaire[0].cotisation_echeance_moyenne + data.Tarif_beneficiaire[1].cotisation_echeance_moyenne;
    } else {
        Cotisation_mensuelle = data.Tarif_beneficiaire[0].cotisation_echeance_moyenne;
    }
    console.log(Cotisation_mensuelle);
    // Récupération de la valeur actuelle de l'assurance depuis l'input et conversion en nombre
    var Montant_actuel_assurance =
        resultats["montant-actuel-de-votre-assurance-2"];
    console.log(Montant_actuel_assurance);
    // Vérification que Montant_actuel_assurance est un nombre, sinon le définir à 0 pour éviter les NaN dans les calculs
    if (isNaN(Montant_actuel_assurance)) {
        Montant_actuel_assurance = 0;
    }

    // Calcul des frais de courtage
    var frais_courtage;
    if (data.Tarif_beneficiaire.length >= 2) {
        if (Montant_actuel_assurance - Cotisation_mensuelle < 75) {
            frais_courtage = Montant_actuel_assurance - Cotisation_mensuelle;
        } else {
            
            frais_courtage = 75;
        }
    } else {
        if (Montant_actuel_assurance - Cotisation_mensuelle < 50) {
            frais_courtage = Montant_actuel_assurance - Cotisation_mensuelle;
        } else {
            
            frais_courtage = 50;
        }
    }
    
    console.log("frais_courtage"+frais_courtage * 12);
    
    // Calcul de la cotisation mensuelle ajustée
    var Cotisation_mensuelle_ajustée = Cotisation_mensuelle + frais_courtage;
    $("#total-de-l-assurance").attr(
        "fs-numbercount-end", parseFloat(data.Tarif_beneficiaire[0].cotisation_totale).toFixed(2));
    console.log(Cotisation_mensuelle_ajustée);
    // Mise à jour de l'attribut fs-numbercount-end pour l'année 2 avec la cotisation annuelle divisée par 12
    $("#mensuelle-moyenne").attr(
        "fs-numbercount-end",
        parseFloat(Cotisation_mensuelle).toFixed(2));
   $("#Economie-globale").attr(
        "fs-numbercount-end",
        parseFloat(
            (Montant_actuel_assurance * differenceMois_1) - data.Tarif_beneficiaire[0].cotisation_totale - (frais_courtage * 12)
        ).toFixed(2)
    );
    $("#Economie-par-mois").attr(
        "fs-numbercount-end",
        parseFloat(
            Montant_actuel_assurance - Cotisation_mensuelle
        ).toFixed(2)
    );

    jsonToSend.resultatform = resultats;
    var make = {
        "all data ": [jsonToSend, data],
        "frais_courtage": frais_courtage,
        "frais_courtage+commission": (frais_courtage * 12)+(data.Tarif_beneficiaire[0].cotisation_annuelle_moyenne/2),
        "Cotisation_mensuelle_ajustée annee 1 ": Cotisation_mensuelle_ajustée,
        "mensuelle-moyenne": parseFloat(Cotisation_mensuelle).toFixed(2),
        "Economie-globale": parseFloat(data.Tarif_beneficiaire[0].cotisation_totale - ((Montant_actuel_assurance * differenceMois_1) + frais_courtage * 12)).toFixed(2),
        "Economie-mensuelle": parseFloat(Montant_actuel_assurance - Cotisation_mensuelle).toFixed(2),
        "total-de-l-assurance": parseFloat(data.Tarif_beneficiaire[0].cotisation_totale).toFixed(2)
    };
    console.log(make);
    $.ajax({
        url: "https://hook.eu1.make.com/4fju693ly1z6nbqkykftfx94tmp6xjvv",
        method: "POST",
        headers: {
            Authorization: token,
        },
        contentType: "application/json",
        data: JSON.stringify(make),
    });

    var script = document.createElement("script");
    script.src =
        "https://cdn.jsdelivr.net/npm/@finsweet/attributes-numbercount@1/numbercount.js";
    script.defer = !0;
    document.head.appendChild(script);
}