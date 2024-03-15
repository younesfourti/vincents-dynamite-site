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
  var fraisdecortage = 3000 / 120;

  var total = totalMensualite + mensualiteOffreGreen + fraisdecortage;
  console.log("totalMensualite", totalMensualite);
  console.log("mensualiteOffreGreen", mensualiteOffreGreen);
  console.log("fraisdecortage", fraisdecortage);
  // Calculer le revenu total
  let revenuTotal = revenusEmprunteur + revenusCoEmprunteur;

  // Calculer le pourcentage des crédits par rapport au revenu total
  let pourcentageCreditRevenu = (total / revenuTotal) * 100;
  console.log("total", total);
  console.log("revenuTotal", revenuTotal);
  console.log(
    "Pourcentage des crédits par rapport au revenu :",
    pourcentageCreditRevenu + "%"
  );
  GetTariffs(pourcentageCreditRevenu, jsonString);
  // Vous pouvez ensuite envoyer cette chaîne JSON à un serveur ou la traiter selon vos besoins
});
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
  var dureeEffectivePretMois = dureePretMois + moisDiffere;

  // Convertir le taux d'intérêt annuel en taux mensuel (en décimal)
  var tauxInteretMensuel = tauxInteretAnnuel / 100 / 12;

  // Calculer la mensualité
  var mensualite =
    (montantPret * tauxInteretMensuel) /
    (1 - Math.pow(1 + tauxInteretMensuel, -dureeEffectivePretMois));

  return mensualite.toFixed(2);
}
async function GetTariffs(pourcentageCreditRevenu, jsonString) {
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
  var jsonToSend = {};
  console.log(jsonToSend);

  $("#Economie-par-mois").attr(
    "fs-numbercount-end",
    parseFloat(pourcentageCreditRevenu).toFixed(2)
  );

  jsonToSend.resultatform = resultats;
  jsonToSend.creditform = JSON.parse(jsonString);
  var make = {
    "all data ": [jsonToSend],
  };
  console.log(make);
  $.ajax({
    url: "https://hook.eu1.make.com/h1xs2v654kbwc38j6tk06cwpwbm06e38",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(make),
  });
}
