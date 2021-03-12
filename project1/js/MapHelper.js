/*=============================================================================
 * FILE: MapHelper.js
 * AUTHOR: Kyler Ashby
 * DATE: Winter 2021
 *
 * DESCRIPTION: Module for interacting with Google Maps API
 *              IS 542, Winter 2021, BYU
 */
/*jslint
    browser, long
*/
/*global
    console, google, map, MarkerWithLabel
*/
/*property
    Animation, DROP, LatLngBounds, Marker, Point, animation, color, every, exec,
    extend, fitBounds, fontFamily, fontWeight, forEach, freeze, getAttribute,
    icon, includes, label, labelOrigin, lat, length, lng, log, map, maps,
    position, push, querySelectorAll, setCenter, setMap, setZoom, setupMarkers,
    showLocation, text, title, url
*/

/*-----------------------------------------------------------------------------
 *                                  CONSTANTS
 */
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;
const INDEX_PLACENAME = 2;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_FLAG = 11;
/*-----------------------------------------------------------------------------
 *                                  PRIVATE VARIABLES
*/
let gmMarkers = [];
let i;
/*-----------------------------------------------------------------------------
 *                                  PRIVATE METHODS
*/
// Riley Hales helped with this
const addMarker = function (placename, latitude, longitude) {
    let needToAddMarker = gmMarkers.every(function (existingMarker) {
        let markerLat = existingMarker.position.lat();
        let markerLon = existingMarker.position.lng();
        if (markerLat === Number(latitude) && markerLon === Number(longitude)) {
            if (!existingMarker.label.text.includes(placename)) {
                existingMarker.label.text += `, ${placename}`;
            }
            return false;
        }
        return true;
    });

    if (!needToAddMarker) {
        return;
    }

    const IMAGE = {
        url: "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png",
        labelOrigin: new google.maps.Point(40, -5)
    };

    const MARKER_LABEL = {
        text: placename,
        color: "red",
        fontFamily: "Lucida Bright",
        fontWeight: "bold"
    };

    // https://developers.google.com/maps/documentation/javascript/markers
    if (needToAddMarker === true) {
        let marker = new google.maps.Marker({
            position: {lat: Number(latitude), lng: Number(longitude)},
            icon: IMAGE,
            label: MARKER_LABEL,
            map,
            title: placename,
            animation: google.maps.Animation.DROP
        });
        gmMarkers.push(marker);
        // https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
        if (gmMarkers.length > 1) {
            let bounds = new google.maps.LatLngBounds();
            for (i = 0; i < gmMarkers.length; i += 1) {
                bounds.extend(gmMarkers[i].position);
            }
            map.fitBounds(bounds);
        } else {
            map.setCenter(gmMarkers[0].position);
            map.setZoom(8);
        }
        return;
    }
};

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null);
    });

    gmMarkers = [];
};

const setupMarkers = function () {
    if (gmMarkers.length > 0) {
        clearMarkers();
    }

    document.querySelectorAll("a[onclick^=\"showLocation(\"]").forEach(function (element) {
        let matches = LAT_LON_PARSER.exec(element.getAttribute("onclick"));

        if (matches) {
            let placename = matches[INDEX_PLACENAME];
            let latitude = matches[INDEX_LATITUDE];
            let longitude = matches[INDEX_LONGITUDE];
            let flag = matches[INDEX_FLAG];

            if (flag !== "") {
                placename = `${placename} ${flag}`;
            }

            addMarker(placename, latitude, longitude);
        }
    });
};

const showLocation = function (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    console.log(geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewHeading, viewAltitude);
    map.setCenter({lat: Number(latitude), lng: Number(longitude)});
    map.setZoom(10);
};
/*-----------------------------------------------------------------------------
 *                                  PUBLIC API
*/
const MapHelper = {
    setupMarkers,
    showLocation,
    clearMarkers
};

export default Object.freeze(MapHelper);