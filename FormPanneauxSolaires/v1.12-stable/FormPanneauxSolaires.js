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
  });
  if (window.innerWidth < 768) {
    $('[data-toggle="datepicker"]').attr("readonly", "readonly");
  }
});
$(document).ready(function () {
  $('[data-toggle="datepicker2"]').datepicker({
    format: "DD-MM-YYYY",
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

    $(document).ready(function () {
      $('[data-toggle="datepicker2"]').datepicker({
        format: "DD-MM-YYYY",
      });
      if (window.innerWidth < 768) {
        $('[data-toggle="datepicker"]').attr("readonly", "readonly");
      }
    });
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
    // Construit la clé pour accéder au type de projet en prenant en compte que le premier crédit n'a pas de suffixe
    let typeProjetKey = `Type-Projet${
      index === 0 ? "" : "credit-" + (index + 1)
    }`;

    // Vérifie si le type de projet est "residence_principale"
    if (credit[typeProjetKey] === "residence_principale") {
      // Appelle la fonction pour calculer le capital restant dû et l'assigne à la propriété appropriée
      credit.residence_principale = calculerCapitalRestantDu(credit, index);
      jsonString = JSON.stringify(credits, null, 2);
    }

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
  var total = totalMensualite + mensualiteOffreGreen;
  console.log("totalMensualite", totalMensualite);
  console.log("mensualiteOffreGreen", mensualiteOffreGreen);
  // Calculer le revenu total
  let revenuTotal = revenusEmprunteur + revenusCoEmprunteur;

  // Calculer le pourcentage des crédits par rapport au revenu total
  let pourcentageCreditRevenu = (total / revenuTotal) * 100;
  console.log("total", total);
  console.log("revenuTotal", revenuTotal);
  console.log(
    "Pourcentage des crédits par rapport au revenu :",
    pourcentageCreditRevenu.toFixed(2) + "%"
  );
    var gettarif = false
  if ($("#pret-encours-non").is(":checked")) {
    var gettarif = true
  }
  if (credits.length>1) {
    var gettarif = true
  }
  if (gettarif) {
    GetTariffs(
      pourcentageCreditRevenu.toFixed(2),
      jsonString,
      mensualiteOffreGreen
    );
  }
  
  // Vous pouvez ensuite envoyer cette chaîne JSON à un serveur ou la traiter selon vos besoins
});

function calculerCapitalRestantDu(credit, index) {
  // Construire les clés pour accéder aux différentes propriétés
  let montantPretKey = `Montant-du-pr-t${
    index !== 0 ? "credit-" + (index + 1) : ""
  }`;
  let tauxInteretKey = `Taux-du-pr-t${
    index !== 0 ? "credit-" + (index + 1) : ""
  }`;
  let mensualiteKey = `Mensualit${index !== 0 ? "credit-" + (index + 1) : ""}`;
  let dureePretMoisKey = `Dur-e-totale-mois${
    index !== 0 ? "credit-" + (index + 1) : ""
  }`;
  let differeRemboursementMoisKey = `Dont-diff-r-mois${
    index !== 0 ? "credit-" + (index + 1) : ""
  }`;
  let dateString = `date_effet2${index !== 0 ? "credit-" + (index + 1) : ""}`;
  // Extraire les valeurs des propriétés correspondantes
  let montantPret = Number(credit[montantPretKey]);
  let tauxInteret = Number(credit[tauxInteretKey]);
  let mensualite = Number(credit[mensualiteKey]);
  let dureePretMois = Number(credit[dureePretMoisKey]);
  let differeRemboursementMois = Number(credit[differeRemboursementMoisKey]);

  // Convertir le taux d'intérêt annuel en taux mensuel (en décimale)
  var tauxInteretMensuel = tauxInteret / 100 / 12;

  // Analyser la date de début du prêt depuis la chaîne de date
  var dateDebutPret = moment(dateString, "DD-MM-YYYY").toDate(); // Convert to Date object

  // Récupérer la date actuelle
  var dateActuelle = new Date();

  // Calculer le nombre de mois écoulés depuis le début du prêt, en tenant compte du différé de remboursement
  var differenceMois =
    (dateActuelle.getFullYear() - dateDebutPret.getFullYear()) * 12 +
    (dateActuelle.getMonth() - dateDebutPret.getMonth());
  differenceMois -= differeRemboursementMois;
  differenceMois = Math.max(0, differenceMois);

  // Calculer la mensualité (formule 2)
  var Newmensualite =
    (montantPret * tauxInteretMensuel) /
    (1 - Math.pow(1 + tauxInteretMensuel, -dureePretMois));
  var assurence = Newmensualite - mensualite;
  // Calculer le capital restant dû (formule 1)
  var capitalRestantDu =
    (Newmensualite *
      (1 -
        Math.pow(1 + tauxInteretMensuel, -(dureePretMois - differenceMois)))) /
    tauxInteretMensuel;

  // Arrondir à 2 décimales
  var crd = capitalRestantDu.toFixed(2);

  // Retourner les paramètres calculés ainsi que la mensualité
  return {
    mensualitesansassurence: Newmensualite,
    assurence: assurence.toFixed(2),
    mensualite: mensualite,
    capitalRestantDu: crd,
    RestantMois: dureePretMois - differenceMois,
    montantPret: montantPret,
    tauxInteret: tauxInteret,
    dureePretMois: dureePretMois,
    differeRemboursementMois: differeRemboursementMois,
  };
}

document
  .getElementById("co-emprunteur-non")
  .addEventListener("click", function () {
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
    }
  });
  $("#flowbaseSlider").on("click", "#back-co-emprunteur", function (e) {
    if ($("#co-emprunteur-oui").is(":checked")) {
      l.trigger("tap");
    } else if ($("#co-emprunteur-non").is(":checked")) {
      l.trigger("tap");
      l.trigger("tap");
    }
  });
  $("#flowbaseSlider")
    .on(
      "click",
      ".slider-left:not(#back-co-emprunteur,#ifcreditback)",
      function () {
        l.trigger("tap");
      }
    )
    .on(
      "click",
      ".slider-right:not(#co-emprunteur-next,#ifcredit)",
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
  var dureeEffectivePretMois = dureePretMois;
  var montantPretavecfrais = montantPret + 3000;
  // Frais de courtage par mois

  // Montant de l'assurance par mois
  var montantAssuranceParMois = 1.5;

  // Convertir le taux d'intérêt annuel en taux mensuel (en décimal)
  var tauxInteretMensuel = tauxInteretAnnuel / 100 / 12;

  // Calculer la mensualité sans tenir compte de l'assurance et des frais de courtage
  var mensualiteBase =
    (montantPretavecfrais * tauxInteretMensuel) /
    (1 - Math.pow(1 + tauxInteretMensuel, -dureeEffectivePretMois));

  // Calculer le montant du prêt total en ajoutant les mois de différé
  var montantTotal = montantPretavecfrais;

  // Si des mois de différé sont spécifiés, ajuster le montant total du prêt en fonction
  if (moisDiffere > 0) {
    montantTotal += mensualiteBase * moisDiffere;
  }

  // Recalculer la mensualité en tenant compte du montant total du prêt et sans les extras
  var mensualiteSansExtras =
    (montantTotal * tauxInteretMensuel) /
    (1 - Math.pow(1 + tauxInteretMensuel, -dureeEffectivePretMois));

  // Ajouter les extras (assurance et frais de courtage) à la mensualité recalculée
  var mensualiteAvecExtras = mensualiteSansExtras + montantAssuranceParMois;
  $("#total").attr(
    "fs-numbercount-end",
    parseFloat(mensualiteAvecExtras * 120).toFixed(0)
  );

  return mensualiteAvecExtras;
}
async function GetTariffs(
  pourcentageCreditRevenu,
  jsonString,
  mensualiteOffreGreen
) {
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
  //console.log(resultats);
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
        quotite: "50",
        package_garanties: "DC-IPT-MNO",
        franchise: "90",
      },
    ],
  };

  if (resultats["co-emprunteur-oui"] === "on") {
    jsonToSend.garanties[0].quotite = "50";
  } else {
    jsonToSend.garanties[0].quotite = "100";
  }
  console.log(jsonToSend);
  var Probabilite = calculerProbabilite(pourcentageCreditRevenu);
  $("#probabilite").attr(
    "fs-numbercount-end",
    parseFloat(Probabilite * 100).toFixed(2)
  );
  $("#montant-installation").attr(
    "fs-numbercount-end",
    parseFloat(
      document.getElementById("Montant-TTC-de-l-installation").value
    ).toFixed(2)
  );
  $("#mensualite").attr(
    "fs-numbercount-end",
    parseFloat(mensualiteOffreGreen).toFixed(2)
  );
  document.getElementById("voir-plus").addEventListener("click", function () {
    console.log("clic");
    var element = document.getElementById("details");
    var container = document.getElementById("details-conteneur");
   
    // Vérifier si l'élément est caché ou si son style display est vide
    if (element.style.display === "" || element.style.display === "none") {
      // S'il est caché, le rendre visible et ajouter la classe divmeilleur-offre
      element.style.display = "block";
      container.classList.add("divmeilleur-offre");
      container.classList.remove("divmeilleur-offre-copy");
      console.log($("#Frais-de-credit"));
      $("#Frais-de-credit").text(
        parseFloat(
          
            parseFloat(
              document.getElementById("Montant-TTC-de-l-installation").value
            ).toFixed(2) + 3000
        ).toFixed(0)
      );
    } else {
      // Sinon, le cacher et remplacer la classe divmeilleur-offre par divmeilleur-offre-copy
      element.style.display = "none";
      container.classList.remove("divmeilleur-offre");
      container.classList.add("divmeilleur-offre-copy");
    }
  });
  // Assurez-vous que les valeurs nécessaires sont définies pour éviter les erreurs
  var dateOrigine = resultats.date_naissance_emprunteur || "";
  var dateFormatee =
    moment(dateOrigine, "DD-MM-YYYY").format("YYYY-MM-DD") || "";

  // Gérer les champs éventuellement non définis
  jsonToSend.beneficiaires[0].date_naissance = dateFormatee || "";
  jsonToSend.beneficiaires[0].code_postal = resultats.zip || "";
  jsonToSend.contrat.type_projet = resultats.type_projet || "";
  jsonToSend.prets[0].taux_pret = resultats.range_taux || "";

  // Gérer les valeurs booléennes éventuellement non définies
  jsonToSend.beneficiaires[0].risque_fumeur =
    resultats["Is-Fumeur-Oui"] === "on" ? "fumeur" : "non_fumeur";
  jsonToSend.beneficiaires[0].risque_port_charges =
    getRisquePortCharges(resultats);
  jsonToSend.beneficiaires[0].risque_travail_hauteur =
    getRisqueTravailHauteur(resultats);
  jsonToSend.beneficiaires[0].statut_professionnel =
    resultats.profession1 || "";
  jsonToSend.beneficiaires[0].risque_km_pro =
    resultats["risque_km_pro-oui-2"] === "on" ? "sup_20000" : "inf_20000";

  // Gérer le co-emprunteur si présent
  if (resultats["co-emprunteur-oui"] === "on") {
    jsonToSend = gererCoEmprunteur(jsonToSend, resultats);
  }

  // Fonction pour obtenir le risque de port de charges en fonction des résultats
  function getRisquePortCharges(resultats) {
    if (resultats["risque_port_charges-15kg"] === "on") {
      return "inf_15kg";
    } else if (resultats["risque_port_charges-non"] === "on") {
      return "aucun";
    } else if (resultats["risque_port_charges-plus15kg"] === "on") {
      return "sup_15kg";
    }
  }

  // Fonction pour obtenir le risque de travail en hauteur en fonction des résultats
  function getRisqueTravailHauteur(resultats) {
    if (resultats["risque_travail_hauteur-15m"] === "on") {
      return "inf_15m";
    } else if (resultats["risque_travail_hauteur-non"] === "on") {
      return "aucun";
    } else if (resultats["risque_travail_hauteur-plus15m"] === "on") {
      return "sup_15m";
    } else {
      return "non_defini";
    }
  }

  // Fonction pour gérer les données du co-emprunteur
  function gererCoEmprunteur(jsonToSend, resultats) {
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
      quotite: "50",
      package_garanties: "DC-IPT-MNO",
      franchise: "90",
    });

    var dateOrigineCoEmprunteur =
      resultats["Date-Naissanceco-emprunteur-se"] || "";
    var dateFormateeCoEmprunteur =
      moment(dateOrigineCoEmprunteur, "DD-MM-YYYY").format("YYYY-MM-DD") || "";

    jsonToSend.beneficiaires[1].date_naissance = dateFormateeCoEmprunteur || "";
    jsonToSend.beneficiaires[1].code_postal =
      resultats["Zipco-emprunteur"] || "";
    jsonToSend.beneficiaires[1].statut_professionnel =
      resultats["Profession-2co-emprunteur-se-2"] || "";
    jsonToSend.beneficiaires[1].risque_fumeur =
      resultats["Is-Fumeur-Oui-2co-emprunteur-se"] === "on"
        ? "fumeur"
        : "non_fumeur";
    jsonToSend.beneficiaires[1].risque_port_charges =
      getRisquePortChargesCoEmprunteur(resultats);
    jsonToSend.beneficiaires[1].risque_travail_hauteur =
      getRisqueTravailHauteurCoEmprunteur(resultats);
    jsonToSend.beneficiaires[1].risque_km_pro =
      resultats["Risque-Km-Pro-Oui-2co-emprunteur-se"] === "on"
        ? "sup_20000"
        : "inf_20000";
    jsonToSend.garanties[1].quotite =
      resultats["co-emprunteur-oui"] === "on" ? "50" : "100";

    return jsonToSend;
  }

  // Fonction pour obtenir le risque de port de charges du co-emprunteur en fonction des résultats
  function getRisquePortChargesCoEmprunteur(resultats) {
    if (resultats["Risque-Port-Charges-15-Kg-2co-emprunteur-se"] === "on") {
      return "inf_15kg";
    } else if (
      resultats["Risque-Port-Charges-Non-2co-emprunteur-se"] === "on"
    ) {
      return "aucun";
    } else if (
      resultats["Risque-Port-Charges-Plus-15-Kg-2co-emprunteur-se"] === "on"
    ) {
      return "sup_15kg";
    }
  }

  // Fonction pour obtenir le risque de travail en hauteur du co-emprunteur en fonction des résultats
  function getRisqueTravailHauteurCoEmprunteur(resultats) {
    if (resultats["Risque-Travail-Hauteur-15-M-2co-emprunteur-se"] === "on") {
      return "inf_15m";
    } else if (
      resultats["Risque-Travail-Hauteur-Non-2co-emprunteur-se"] === "on"
    ) {
      return "aucun";
    } else if (
      resultats["Risque-Travail-Hauteur-Plus-15-M-2co-emprunteur-se"] === "on"
    ) {
      return "sup_15m";
    } else {
      return "non_defini";
    }
  }

  function calculerProbabilite(pourcentageCreditRevenu) {
    if (pourcentageCreditRevenu >= 45) {
      return 0; // Peu probable
    } else if (pourcentageCreditRevenu >= 35 && pourcentageCreditRevenu < 45) {
      return 0.3; // 30% de probabilité que le dossier passe
    } else if (pourcentageCreditRevenu >= 25 && pourcentageCreditRevenu < 35) {
      return 0.5; // 50% de probabilité que le dossier passe
    } else if (pourcentageCreditRevenu >= 0 && pourcentageCreditRevenu < 25) {
      return 0.7; // 70% de probabilité que le dossier passe
    } else {
      return -1; // Code d'erreur pour une valeur invalide
    }
  }

  var script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@finsweet/attributes-numbercount@1/numbercount.js";
  script.defer = !0;
  document.head.appendChild(script);

  jsonToSend.resultatform = resultats;
  jsonToSend.creditform = JSON.parse(jsonString);
  var make = {
    "all data ": [jsonToSend, { Montant: parseFloat(
      document.getElementById("Montant-TTC-de-l-installation").value
    ) + 3000 , Montantinstalation: parseFloat(
      document.getElementById("Montant-TTC-de-l-installation").value
    )  }],
  };
  console.log(make);
  $("#avec-documents").click(function () {
    $.ajaxSetup({ cache: false });
    var uniqueParam = new Date().getTime();
    $.ajax({
      url:
        "https://hook.eu1.make.com/h1xs2v654kbwc38j6tk06cwpwbm06e38?" +
        uniqueParam,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(make),
    });
  });
  $("#sans-documents").click(function () {
    $.ajaxSetup({ cache: false });
    var uniqueParam = new Date().getTime();
    $.ajax({
      url:
        "https://hook.eu1.make.com/4qpr3gapg8cf4l3yi4ics5u6pyjr12fe?" +
        uniqueParam,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(make),
    });
  });
}
