function roundToOneDecimal(num) {
  return Number(Math.round(num+'e1')+'e-1');
}
function getPrettyLatLng(latlng){
  //                latitude 7.2 - 92.8        longitude 7.2 - 92.8
  var lat = roundToOneDecimal(latlng.lat * 83 + 8.8);
      lng = roundToOneDecimal(latlng.lng * 83 + 8.3);
	return lat + ',' + lng;
};
function getUglyLatLng(latlng){
	return latlng.lat + ',' + latlng.lng;
};

L.Projection.NoWrap = {
  project: function (latlng) {
    return new L.Point(latlng.lng, latlng.lat);
  },
  unproject: function (point, unbounded) {
    return new L.LatLng(point.y, point.x, true);
  }
};
L.CRS.Direct = L.Util.extend({}, L.CRS, {
  code: 'Direct',
  projection: L.Projection.NoWrap,
  transformation: new L.Transformation(1, 0, 1, 0)
});

var coordBox = $('#coords'),
    mapUrl = 'https://s3.amazonaws.com/arkmaptiles/{z}/{x}/{y}.png',
    markers = [];

var mapLayer = L.tileLayer(mapUrl, {
      minZoom: 1,
      maxZoom: 6,
      tms: true,
      continuousWorld: false,
      noWrap: true,
      detectRetina: true,
      worldCopyJump: false, 
      crs: L.CRS.Direct
    });
var map = L.map('map',{
      layers: [mapLayer],
      worldCopyJump: false, 
      crs: L.CRS.Direct,
      attributionControl: false,
      zoomSnap: 0,
      zoomDelta: 0.01,
    }).setView([0.5,0.5],1);

if (location.hash) {
  var hash = location.hash.replace("#",'');
  var coords = hash.split(';');
  for (var i=0; i<coords.length; i++) {
    addMarker(L.latLng(coords[i].split(',')));
  }
}

map.on('mousemove', function(e) {
  coordBox.text(getPrettyLatLng(e.latlng));
});

function markerPopup(marker){
  var trashcan = $('<i class="icon-bin"></i>').click(removeMarker.bind(null, marker));
  var tmpl = $('<span>'+getPrettyLatLng(marker._latlng)+'</span>').append(trashcan);
  return tmpl[0];
};
function updateURL(){
  var hash = "#"+ markers.map(function(m){return getUglyLatLng(m._latlng);}).join(';');
  if(history.pushState) {
    history.pushState(null, null, hash);
  }
  else {
    location.hash = hash;
  }
};
function addMarker(latlng){
  var marker = L.marker([latlng.lat, latlng.lng],{
    draggable: true,
    title: getPrettyLatLng(latlng)
  });
  markers.push(marker);
  marker.addTo(map);
  marker.bindPopup(markerPopup(marker));
  marker.on('dragend', function(e){
    marker.setPopupContent(markerPopup(marker));
    updateURL();
  });
};
function removeMarker(marker){
  map.removeLayer(marker);
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]._leaflet_id == marker._leaflet_id) {
      markers.splice(i, 1);
      break;
    }
  }
  updateURL();
}

map.on('click', function(e){
  addMarker(e.latlng);
  updateURL();
});
