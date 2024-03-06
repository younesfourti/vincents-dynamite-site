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
        questionText = "Texte pour la question 1";
        postUrl = "URL_pour_la_question_1";
        break;
      case '2':
        questionText = "Texte pour la question 2";
        postUrl = "URL_pour_la_question_2";
        break;
      case '3':
        questionText = "Texte pour la question 3";
        postUrl = "URL_pour_la_question_3";
        break;
      case '4':
        questionText = "Texte pour la question 4";
        postUrl = "URL_pour_la_question_4";
        break;
      case '5':
        questionText = "Texte pour la question 5";
        postUrl = "URL_pour_la_question_5";
        break;
      case '6':
        questionText = "Texte pour la question 6";
        postUrl = "URL_pour_la_question_6";
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
        resultats.collectionid = "{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}";
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
