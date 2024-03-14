
var Webflow = Webflow || [];
Webflow.push(function () {
  var l = $("#flowbaseSlider .w-slider-arrow-left");
  var r = $("#flowbaseSlider .w-slider-arrow-right");
  $("#flowbaseSlider")
    .on(
      "click",
      ".slider-left:not(#updateback-emprunteur, #update-co-emprunteur-back)",
      function () {
        l.trigger("tap");
      }
    )
    .on(
      "click",
      ".slider-right:not(#update-emprunteur-next, #update-co-emprunteur-next)",
      function () {
        r.trigger("tap");
      }
    );
});
$(document).ready(function() {
  // Récupérer le paramètre "question_id" de l'URL
  var urlParams = new URLSearchParams(window.location.search);
  var questionId = urlParams.get('question_id');

  // Définir le texte spécifique pour chaque question et l'URL de post en fonction de la question
  var questionText, postUrl;
  switch(questionId) {
    case '1':
      questionText = "confirmer si vous avez refusé et clôturé le dossier relatif aux panneaux solaires";
      postUrl = "https://hook.eu1.make.com/qql124gh1ieeduhpqiqxshni5rwh8x22";
      break;
    case '2':
      questionText = " confirmer si vous avez accepté le dossier concernant les panneaux solaires";
      postUrl = "https://hook.eu1.make.com/m84u9kq8ux77azd2aydkrfzai5uztlgr";
      break;
    case '3':
      questionText = "confirmer si le dossier relatif aux panneaux solaires a été classé sans suite ?";
      postUrl = "https://hook.eu1.make.com/n2b3r3aho3sv4nrsmb5grkpqyglf7kx6";
      break;
    case '4':
      questionText = "confirmer si le vendeur de panneaux solaires a validé le dossier ?";
      postUrl = "https://hook.eu1.make.com/sv82walybk0oiq9py2dwrtm93htb8f28";
      break;
    case '5':
      questionText = "confirmer si l'installation des panneaux solaires a bien été réalisée ?";
      postUrl = "https://hook.eu1.make.com/fyyckff1tsvsr2mub4k4uus9htwo51sk";
      break;
    case '6':
      questionText = "demande de déblocage des fonds suite à la réalisation de l'installation des panneaux solaires ?";
      postUrl = "https://hook.eu1.make.com/5alffn6s5dpcpkjvrkzohliyx6pi5sjz";
      break;
    default:
      questionText = "Question inconnue";
      postUrl = "URL_pour_question_inconnue";
  }

  // Changer le texte de l'élément avec l'ID "question-text"
  $("#question-text").text(questionText);

  // Gérer le clic sur le bouton #getdata
  $("#getdata").click(function () {
    GoToSubscriptionForm();
  });

  // Fonction pour traiter le clic sur le bouton #getdata
  async function GoToSubscriptionForm() {
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
    $(document).ready(function() {
      resultats.collectionid = "{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
      // Effectuer la requête AJAX POST
      $.ajax({
        url: postUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(resultats),
        success: function(response) {
          console.log("Post réussi !");
        },
        error: function(xhr, status, error) {
          console.error("Erreur lors du post :", error);
        }
      });
    });
  }
});

