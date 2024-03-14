// partis zip code et adresse
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

// partis date de naissance
$(document).ready(function () {
  $('[data-toggle="datepicker"]').datepicker({
    format: "DD-MM-YYYY",
    startDate: "1960",
    endDate: "2006",
  });
  if (window.innerWidth < 768) {
    $('[data-toggle="datepicker"]').attr("readonly", "readonly");
  }
});
$(document).ready(function () {
  $('[data-toggle="datepicker2"]').datepicker({
    format: "DD-MM-YYYY",
    startDate: "2009",
  });
  if (window.innerWidth < 768) {
    $('[data-toggle="datepicker"]').attr("readonly", "readonly");
  }
});

// Partis ajouter un credit
var nbCredit = 1; // Commencez à 1 puisque le crédit 1 existe déjà
document
  .getElementById("AJOUTER-UN-CREDIT")
  .addEventListener("click", function () {
    nbCredit++; // Incrémente le numéro du crédit pour le nouveau crédit

    // Récupère le HTML du crédit 1 (ou d'un modèle si ce n'est pas le premier ajout)
    var originalCredit = document.querySelector(".credit-1");
    var newCredit = originalCredit.cloneNode(true); // Clone le conteneur du crédit

    // Mise à jour des classes dans 'newCredit'
    newCredit.classList.remove("credit-1");
    newCredit.classList.add(`credit-${nbCredit}`);
    var label = newCredit.querySelector("label.nb-credits");
    if (label) {
      label.textContent = `Crédit ${nbCredit - 1} :`;
      // Assurez-vous également de mettre à jour l'attribut 'for' si nécessaire
      var forAttribute = label.getAttribute("for");
      if (forAttribute) {
        label.setAttribute(
          "for",
          forAttribute.replace(/-\d+$/, "") + `-${nbCredit}`
        );
      }
    }
    // Mise à jour des attributs 'name' des éléments de formulaire pour éviter les doublons
    var formElements = newCredit.querySelectorAll("input, select, textarea");
    formElements.forEach(function (element) {
      var name = element.name;
      if (name) {
        // Vérifie si l'élément a un attribut 'name'
        // Ajoute ou met à jour le suffixe du 'name' avec le numéro actuel du crédit
        element.name = name.replace(/-\d+$/, "") + `credit-${nbCredit}`;
      }
    });

    // Nettoie les valeurs d'entrée dans 'newCredit'
    formElements.forEach((input) => (input.value = "")); // Réinitialise les champs de texte

    // Ajoute le nouvel élément de crédit au DOM
    originalCredit.parentNode.appendChild(newCredit);

    // Mise à jour du bouton de suppression dans 'newCredit'
    var deleteButton = newCredit.querySelector(".delete-credit");
    if (deleteButton) {
      deleteButton.addEventListener("click", deleteCreditHandler);
    }
  });

// Fonction gestionnaire pour la suppression d'un crédit
function deleteCreditHandler() {
  this.closest(".credit-container").remove();
  // La gestion de nbCredit ici peut dépendre de vos besoins spécifiques
}
$("#ifcredit, #JsonCredit").click(function () {
  var allCreditsData = []; // Pour stocker les données de tous les crédits

  var creditContainers = document.querySelectorAll(".credit-container"); // Sélectionnez tous les conteneurs de crédit

  creditContainers.forEach(function (container, index) {
    var creditData = {}; // Crée un objet pour stocker les données de ce crédit

    // Récupère tous les éléments input, select, textarea pour le crédit actuel
    var formElements = container.querySelectorAll("input, select, textarea");

    // Parcourez chaque élément de formulaire et stockez ses données dans creditData
    formElements.forEach(function (element) {
      var key = element.name; // Utilisez l'attribut 'name' de l'élément comme clé
      var value = element.value; // La valeur saisie par l'utilisateur
      creditData[key] = value; // Ajoutez la paire clé/valeur à l'objet creditData
    });

    allCreditsData.push(creditData); // Ajoutez les données du crédit actuel au tableau de tous les crédits
  });

  // Convertissez l'objet JavaScript contenant toutes les données des crédits en chaîne JSON
  var jsonString = JSON.stringify(allCreditsData, null, 2); // Le paramètre '2' ajoute des espaces pour une meilleure lisibilité

  console.log(jsonString); // Affiche la chaîne JSON dans la console
  const credits = JSON.parse(jsonString);

  let totalMensualite = 0;

  credits.forEach((credit, index) => {
    // Construit la clé pour accéder à la mensualité en prenant en compte que le premier crédit n'a pas de suffixe
    let mensualiteKey = `Mensualit${
      index === 0 ? "" : "credit-" + (index + 1)
    }`;
    // Convertit la valeur de la mensualité en nombre et l'ajoute au total
    totalMensualite += Number(credit[mensualiteKey]);
  });
  // Récupérer les valeurs des revenus de l'emprunteur et du co-emprunteur
  let revenusEmprunteur = Number(
    document.getElementById("Revenus-emprunteur").value
  );
  let revenusCoEmprunteur = Number(
    document.getElementById("Revenus-coEmprunteur-Se").value
  );

  var montantPret = parseFloat(
    document.getElementById("Montant-TTC-de-l-installation").value
  );
  var moisDiffere = parseFloat(
    document.getElementById("differe-installation-2").value
  );

  // Utilisation de la fonction calculerMensualite avec différé
  var mensualiteOffreGreen = calculerMensualite(montantPret, moisDiffere);
  var fraisdecortage = 3000/120;
  var total = totalMensualite + mensualiteOffreGreen + fraisdecortage;
  // Calculer le revenu total
  let revenuTotal = revenusEmprunteur + revenusCoEmprunteur;

  // Calculer le pourcentage des crédits par rapport au revenu total
  let pourcentageCreditRevenu = (total / revenuTotal) * 100;

  console.log(
    "Pourcentage des crédits par rapport au revenu :",
    pourcentageCreditRevenu.toFixed(2) + "%"
  );
  // Vous pouvez ensuite envoyer cette chaîne JSON à un serveur ou la traiter selon vos besoins
});

var Webflow = Webflow || [];
Webflow.push(function () {
  var l = $("#flowbaseSlider .w-slider-arrow-left");
  var r = $("#flowbaseSlider .w-slider-arrow-right");
  $("#flowbaseSlider").on("click", "#ifcredit", function (e) {
    if ($("#pret-encours-oui").is(":checked")) {
      r.trigger("tap");
    } else if ($("#pret-encours-non").is(":checked")) {
      r.trigger("tap");
      r.trigger("tap");
    }
  });
  $("#flowbaseSlider").on("click", "#ifcreditback", function (e) {
    if ($("#pret-encours-oui").is(":checked")) {
      l.trigger("tap");
    } else if ($("#pret-encours-non").is(":checked")) {
      l.trigger("tap");
      l.trigger("tap");
    }
  });

  $("#flowbaseSlider").on("click", "#co-emprunteur-next", function (e) {
    if ($("#co-emprunteur-oui").is(":checked")) {
      r.trigger("tap");
    } else if ($("#co-emprunteur-non").is(":checked")) {
      r.trigger("tap");
      r.trigger("tap");
      r.trigger("tap");
    }
  });
  $("#flowbaseSlider").on("click", "#back-co-emprunteur", function (e) {
    if ($("#co-emprunteur-oui").is(":checked")) {
      l.trigger("tap");
    } else if ($("#co-emprunteur-non").is(":checked")) {
      l.trigger("tap");
      l.trigger("tap");
      l.trigger("tap");
    }
  });
  $("#flowbaseSlider")
    .on(
      "click",
      ".slider-left:not(#back-co-emprunteur, #ifcredit)",
      function () {
        l.trigger("tap");
      }
    )
    .on(
      "click",
      ".slider-right:not(#co-emprunteur-next, #ifcreditback)",
      function () {
        r.trigger("tap");
      }
    );
});
// Appel de la fonction avec des valeur

function calculerMensualite(montantPret, moisDiffere) {
  var tauxInteretAnnuel = 6.29;
  var dureePretMois = 120; // Équivalent de 10 ans
  // Ajuster la durée du prêt en fonction du différé
  var dureeEffectivePretMois = dureePretMois + moisDiffere;

  // Convertir le taux d'intérêt annuel en taux mensuel (en décimal)
  var tauxInteretMensuel = tauxInteretAnnuel / 100 / 12;

  // Calculer la mensualité
  var mensualite =
    (montantPret * tauxInteretMensuel) /
    (1 - Math.pow(1 + tauxInteretMensuel, -dureeEffectivePretMois));

  return mensualite.toFixed(2);
}
async function GetTariffs(token) {
  var resultats = {};
  $("input, textarea, select").each(function () {
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
  $(".datepicker input").each(function () {
    var name = $(this).attr("id");
    var value = $(this).val();
    if (value) {
      resultats[name] = value;
    }
  });
  console.log(resultats);
  var dateActuelle = moment();

  // Ajoute 2 mois à la date actuelle
  var dateDansDeuxMois = dateActuelle.add(2, "months");

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
    beneficiaires: [
      {
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
      },
    ],
    prets: [
      {
        rang_pret: "1",
        crd: "",
        type_pret: "amortissable",
        taux_pret: "1.5",
        duree_remboursement_mois: "185",
        dont_differe_mois: "0",
      },
    ],
    garanties: [
      {
        rang_beneficiaire: "1",
        quotite: "80",
        package_garanties: "DC-IPT-MNO",
        franchise: "90",
      },
    ],
  };
  jsonToSend.prets[0].duree_remboursement_mois =
    parseFloat(document.getElementById("range_date-credit").value) * 12;
  var dateOrigine = resultats.date_naissance_emprunteur;
  var dateFormatee = moment(dateOrigine, "DD-MM-YYYY").format("YYYY-MM-DD");
  jsonToSend.beneficiaires[0].date_naissance = dateFormatee;
  jsonToSend.beneficiaires[0].code_postal = resultats.zip;
  jsonToSend.contrat.type_projet = resultats.type_projet;
  jsonToSend.prets[0].taux_pret = resultats.range_taux;
  var capitalRestantDu = calculercapitalRestantDu(
    parseFloat(document.getElementById("montant-du-pret-2").value),
    parseFloat(document.getElementById("range_taux").value),
    parseFloat(document.getElementById("range_date-credit").value),
    parseFloat(document.getElementById("range_date-differe").value) || 0,
    document.getElementById("date_effet-2").value
  );
  console.log("capitalRestantDu:", capitalRestantDu);
  jsonToSend.prets[0].crd = capitalRestantDu;
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
      "DD-MM-YYYY"
    ).format("YYYY-MM-DD");
    jsonToSend.beneficiaires[1].date_naissance = dateFormateeCoEmprunteur;
    jsonToSend.beneficiaires[1].code_postal = resultats["Zipco-emprunteur"];
    jsonToSend.beneficiaires[1].statut_professionnel =
      resultats["Profession-2co-emprunteur-se-2"];
    jsonToSend.beneficiaires[1].risque_fumeur =
      resultats["Is-Fumeur-Oui-2co-emprunteur-se"] === "on"
        ? "fumeur"
        : "non_fumeur";
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
      resultats["Risque-Km-Pro-Oui-2co-emprunteur-se"] === "on"
        ? "sup_20000"
        : "inf_20000";
    if (resultats["co-emprunteur-oui"] === "on") {
      jsonToSend.garanties[1].quotite = "50";
    } else {
      jsonToSend.garanties[1].quotite = "100";
    }
  }
  console.log(jsonToSend);

  $("#Economie-par-mois").attr(
    "fs-numbercount-end",
    parseFloat(Montant_actuel_assurance - Cotisation_mensuelle).toFixed(2)
  );

  jsonToSend.resultatform = resultats;
  var make = {
    "all data ": [jsonToSend],
    };
  console.log(make);
  $.ajax({
    url: "https://hook.eu1.make.com/h1xs2v654kbwc38j6tk06cwpwbm06e38",
    method: "POST",
    headers: {
      Authorization: token,
    },
    contentType: "application/json",
    data: JSON.stringify(make),
  });
}
