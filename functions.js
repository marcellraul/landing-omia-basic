var urlService = "https://www.omia.ai/ServiciosOmiaV2";
var interval;
var intervalFecha;
var promedio = 0;

var hash;
var isValid;

function ValidHash() {
  if (isValid) {
    $("#content").hide();
    $("#UrlInvalid").show();
  } else if (!isValid) {
    $("#UrlInvalid").hide();
    $("#content").show();
  }
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
  return false;
};

function Hash() {
  //var valores = window.location.search;
  //var urlParams = new URLSearchParams(valores);
  var hash = getUrlParameter("hash") // urlParams.get("hash");
  console.log("hash:", hash);
  if (
    hash &&
    hash == "0cda1f2904dc14e34ec69f5b23e36a0eb0fc222785ba496c41dba4a38bd9f9a5"
  ) {
    isValid = false;
  } else {
    isValid = true;
  }

  ValidHash();
}

$(document).ready(function () {
  main();
});

$(window).on("unload", function () {
  clearInterval(interval);
  clearInterval(intervalFecha);
});

function GetDate() {
  var hoy = new Date();
  var cero;
  var ceromin;

  if (hoy.getSeconds() < 10) {
    cero = 0;
  } else cero = "";

  if (hoy.getMinutes() < 10) {
    ceromin = 0;
  } else ceromin = "";

  var fecha =
    hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();
  var hora =
    hoy.getHours() +
    ":" +
    ceromin +
    hoy.getMinutes() +
    ":" +
    cero +
    hoy.getSeconds();
  $("p#hora").text(hora);
  $("p#fecha").text(fecha);
}

function main() {
  //GeneratedChart();
  Hash();
  //ValidHash();
  Services();
  interval = setInterval(function () {
    Services();
  }, 60000);

  intervalFecha = setInterval(function () {
    GetDate();
  }, 1000);
}

function Services() {
  $.get(
    urlService +
      "/ApiAnalytic/GetDataResumenocupacionActual/?rol_id=140031&country_id=null&location_id=null&camera_id=44&instance=null&clase=null&analytic_id=null",
    function (response) {
      //console.log(response);
      promedio = Math.round(response.data[0].prom * 100);
      $("div#maximo").text(response.data[0].capacidad);
      $("div#minimo").text(response.data[0].disponible);
      $("div#aforo").text(
        Math.round(response.data[0].prom * response.data[0].capacidad)
      );
      GeneratedChart();
    },
    "json"
  );
}

function GeneratedChart() {
  var options = {
    series: [promedio],
    chart: {
      type: "radialBar",
      width: "900px",
      offsetY: -90,
      //offsetX: -120,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#4CCFCA"],

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#ffffff",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "27px",
            color: "#ffffff",
            offsetY: -10,
            fontWeight: "bold",
          },
          value: {
            show: true,
            offsetY: -100,
            fontSize: "70px",
            color: "#ffffff",
            fontWeight: "bold",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {},
    labels: ["Porcentaje de ocupación"],
  };

  $("#chart").empty();
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}
