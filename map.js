// Initial map position
const initialCenter = [52.569777, 11.109035];
const initialZoom = 6;
const maxZoom = 10;

const layerBounds = L.latLngBounds(
  [47.2701, 5.8663],   // southwest: min lat, min lng
  [55.0581, 15.0419]   // northeast: max lat, max lng
);

// Create the map
const map = L.map("map", {
  center: initialCenter,
  zoom: initialZoom,
  zoomControl: true,
  scrollWheelZoom: true,
  touchZoom: true,
  dragging: true,
  maxBounds: layerBounds,
  maxZoom: maxZoom,
  minZoom: 6
});

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: maxZoom,
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var baseMaps = {
    "OpenStreetMap": osm,
    "Esri satellite": Esri_WorldImagery,
};

Esri_WorldImagery.addTo(map)
L.control.layers(baseMaps).addTo(map);


let currentLayer = null;

function switch_map() {
  const radios = document.querySelectorAll('input[name="layer"]');

  function updateLayer(year) {
    // remove old layer first
    if (currentLayer !== null) {
      map.removeLayer(currentLayer);
    }

    // add new layer
    currentLayer = L.tileLayer(`./tile_data/WetVegDE_tile_${year}/{z}/{x}/{y}.webp`, {
      maxZoom: maxZoom,
      bounds: layerBounds,
      noWrap: true,
      errorTileUrl: ''
    }).addTo(map);

    currentLayer.bringToFront();
  }

  radios.forEach(radio => {
    radio.addEventListener('change', function () {
      updateLayer(this.value);
    });
  });

  // load default layer when page first opens
  const checkedRadio = document.querySelector('input[name="layer"]:checked');
  updateLayer(checkedRadio ? checkedRadio.value : '2024');
}

switch_map();

const slider = document.getElementById("map-slider");
const sliderValue = document.getElementById("slider-value");

slider.addEventListener("input", function () {
    const value = Number(this.value);
    const opacity = Number(value) / 100;
    sliderValue.textContent = value;
    currentLayer.setOpacity(opacity);
});





// Fix map sizing issues on mobile/browser resize
window.addEventListener("resize", () => {
  map.invalidateSize();
});