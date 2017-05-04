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
    }).setView([0,0],0);

function getLatLng(latlng){
  //                latitude 7.2 - 92.8        longitude 7.2 - 92.8
  var lat = Number(Math.round(latlng.lat * 83 + 8.8+'e1')+'e-1'),
      lng = Number(Math.round(latlng.lng * 83 + 8.3+'e1')+'e-1');
	return lat + ',' + lng;
};

map.on('mousemove', function(e) {
  coordBox.text(getLatLng(e.latlng));
});

map.on('click', function(e){
  L.marker([e.latlng.lat, e.latlng.lng],{
		title: getLatLng(e.latlng)
  }).addTo(map);
});
