const urlService = "https://www.omia.ai/ServiciosOmiaV2";
let interval;
let intervalFecha;
let promedio = 0;

$(document).ready(function () {
  console.log("ready!");
  main();
});

$(window).on("unload", function () {
  clearInterval(interval);
  clearInterval(intervalFecha);
});

function GetDate() {
  var hoy = new Date();
  var fecha =
    hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();
  var hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();

  $("p#hora").text(hora);
  $("p#fecha").text(fecha);
}

function main() {
  GeneratedChart();
  Services();
  interval = setInterval(() => {
    Services();
  }, 60000);

  intervalFecha = setInterval(() => {
    GetDate();
  }, 1000);
}

function Services() {
  $.get(
    `${urlService}/ApiAnalytic/GetDataResumenocupacionActual/?rol_id=140031&country_id=${null}&location_id=${null}&camera_id=44&instance=${null}&clase=${null}&analytic_id=${null}`,
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
      offsetY: -120,
      offsetX: -120,
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
          background: "#e7e7e7",
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
            fontSize: "30px",
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
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}
