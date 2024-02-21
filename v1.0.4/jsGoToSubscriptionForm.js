document.getElementById("zip").addEventListener("blur", () => {
    var e = document.getElementById("zip").value,
        t = "https://api.zippopotam.us/fr/" + e;
    fetch(t).then(e => e.json()).then(e => {
        var t = e.places[0]["place name"],
            a = e.country;
        document.getElementById("ville").value = t, document.getElementById("pays").value = a
    }).catch(e => {
        console.error("Erreur lors de la récupération des données:", e), document.getElementById("ville").value = "Erreur lors de la récupération des données. Veuillez réessayer."
    })
});

$(document).ready(function() {
    $('[data-toggle="datepicker"]').datepicker({
        format: "mm-dd-yyyy"
    });
    if (window.innerWidth < 768) {
        $('[data-toggle="datepicker"]').attr("readonly", "readonly")
    }
});
var Webflow = Webflow || [];
Webflow.push(function() {
    var l = $("#flowbaseSlider .w-slider-arrow-left");
    var r = $("#flowbaseSlider .w-slider-arrow-right");
    $("#flowbaseSlider").on("click", "#co-emprunteur-next", function(e) {
        if ($("#co-emprunteur-oui").is(":checked")) {
            r.trigger("tap")
        } else if ($("#co-emprunteur-non").is(":checked")) {
            r.trigger("tap");
            r.trigger("tap");
            r.trigger("tap")
        }
    });
    $("#flowbaseSlider").on("click", "#back-co-emprunteur", function(e) {
        if ($("#co-emprunteur-oui").is(":checked")) {
            l.trigger("tap")
        } else if ($("#co-emprunteur-non").is(":checked")) {
            l.trigger("tap");
            l.trigger("tap");
            l.trigger("tap")
        }
    });
    $("#flowbaseSlider").on("click", ".slider-left:not(#back-co-emprunteur, #back-differe)", function() {
        l.trigger("tap")
    }).on("click", ".slider-right:not(#co-emprunteur-next, #differe-next)", function() {
        r.trigger("tap")
    })
});
$("#triggerTarifs").click(function() {
    GetToken()
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
                Code_partenaire: "F92ApnKiUAqlXEAk1hp99LegD"
            })
        });
        const token = tokenResponse.GetTokenResponse.token;
        await GetTariffs(token)
    } finally {
        $("#triggerTarifs").data("fetching", !1)
    }
}
async function GetTariffs(token) {
    var resultats = {};
    $("input, textarea, select").each(function() {
        var type = $(this).attr("type");
        var name = $(this).attr("id");
        var value = $(this).val();
        if (type === "checkbox" || type === "radio") {
            value = $(this).is(":checked") ? $(this).val() : null
        }
        if (value !== null && value !== undefined) {
            resultats[name] = value
        }
    });
    $(".datepicker input").each(function() {
        var name = $(this).attr("id");
        var value = $(this).val();
        if (value) {
            resultats[name] = value
        }
    });
    console.log(resultats);
    var jsonToSend = {};

    console.log(jsonToSend);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);
    const data = await $.ajax({
        url: "https://demosoizic.zenioo.com/Mortgage/rest/v1/GetTariffs",
        method: "POST",
        headers: {
            Authorization: token
        },
        contentType: "application/json",
        data: JSON.stringify(jsonToSend)
    });
    data.resultatform = resultats;
    console.log(data);
    $.ajax({
        url: "https://hook.eu1.make.com/4fju693ly1z6nbqkykftfx94tmp6xjvv",
        method: "POST",
        headers: {
            Authorization: token
        },
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}