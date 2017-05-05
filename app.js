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

var coordBox = $(coords),
    mapUrl = 'https://s3.amazonaws.com/arkmaptiles/{z}/{x}/{y}.png';

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

function getLatLng(latlng){
  //                latitude 7.2 - 92.8        longitude 7.2 - 92.8
  var lat = Number(Math.round(latlng.lat * 83 + 8.8+'e1')+'e-1'),
      lng = Number(Math.round(latlng.lng * 83 + 8.3+'e1')+'e-1');
	return lat + ',' + lng;
};

map.on('mousemove', function(e) {
  coordBox.text(getLatLng(e.latlng));
});

var markers = [];
var markerPopup = function(marker){
  var tmpl = $('<span>'+getLatLng(marker._latlng)+'<i class="fa fa-trash" aria-hidden="true"></i></span>')
  tmpl.find('i').click(function(){
    map.removeLayer(marker);
  });
  return tmpl[0];
};
var updateURL = function(){
  var hash = "#"+ markers.map(function(m){return getLatLng(m._latlng);}).join(';');
  if(history.pushState) {
    history.pushState(null, null, hash);
  }
  else {
    location.hash = hash;
  }
};
var addMarker = function(latlng){
  var marker = L.marker([latlng.lat, latlng.lng],{
    draggable: true,
    title: getLatLng(latlng)
  });
  markers.push(marker);
  marker.addTo(map);
  marker.bindPopup(markerPopup(marker));
  marker.on('dragend', function(e){
    marker.setPopupContent(markerPopup(marker));
    updateURL();
  });
};

map.on('click', function(e){
  addMarker(e.latlng);
  updateURL();
});

if (location.hash) {
  setTimeout(function(){
    var hash = location.hash.replace("#",'');
    var coords = hash.split(';');
    for (var i=0; i<coords.length; i++) {
      addMarker(L.latLng(coords[i].split(',')));
    }
  }, 1000);
}
