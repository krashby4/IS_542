/*=======================================================================
 * FILE: scriptures.js
 * AUTHOR: Kyler Ashby, with tutorials from Stephen Liddle
 * DATE: Winter 2021
 *
 * DESCRIPTION: Front-end JavaScript code for The Scriptures, Mapped.
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long, for
 */

/*global
    console, map
 */

/*property
    animation, Animation, books, classKey, color, content, DROP, every, fontFamily, fontWeight, forEach, fullName, getElementById, gridName, hash,
    href, icon, id, includes, init, innerHTML, label, labelOrigin, lat, LatLngBounds, length, lng, log, map, maps, Marker, maxBookId, minBookId, numChapters,
    onHashChanged, onerror, onload, open, parse, Point, position, push, response, send, slice,
    split, status, text, title, url
*/

/*--------------------------------------------------------------
*                      CONSTANTS
*/
const ANIMATE_TIME = 500;
const BOTTOM_PADDING = "<br /><br />";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_BREADCRUMBS = "crumbs";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const DIV_SCRIPTURES = "scriptures";
const DIV_SCRIP1 = "scrip1";
const DIV_SCRIP2 = "scrip2";
const INDEX_FLAG = 11;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_PLACENAME = 2;
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;
const REQUEST_GET = "GET";
const REQUEST_STATUS_OK = 200;
const REQUEST_STATUS_ERROR = 400;
const TAG_HEADER5 = "h5";
const TAG_LIST_ITEM = "li";
const TAG_UNORDERED_LIST = "ul";
const TEXT_TOP_LEVEL = "The Scriptures";
const URL_BASE = "https://scriptures.byu.edu/";
const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;
const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;


/*--------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */
let books;
let gmMarkers = [];
let requestedBookId;
let requestedChapter;
let volumes;
/*--------------------------------------------------------------
    *                      PRIVATE METHOD DECLARATIONS
    */
// let addMarker;
// let ajax;
// let bookChapterValid;
// let booksGrid;
// let booksGridContent;
// let cacheBooks;
// let chaptersGrid;
// let chaptersGridContent;
// let clearMarkers;
// let encodedScripturesUrlParameters;
// let getScripturesCallback;
// let getScripturesFailure;
// let changeHash;
// let htmlAnchor;
// let htmlDiv;
// let htmlElement;
// let htmlLink;
// let htmlHashLink;
// let htmlNextButton;
// let getCurrentHash;
// let htmlListItem;
// let htmlListItemLink;
// let init;
// let injectBreadcrumbs;
// let navigateBook;
// let navigateChapter;
// let navigateHome;
// let nextChapter;
// let onHashChanged;
// let previousChapter;
// let setupMarkers;
// let showLocation;
// let titleForBookChapter;
// let volumeForId;
// let volumesGridContent;
/*--------------------------------------------------------------
    *                      PRIVATE METHODS
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
            for (let i = 0; i < gmMarkers.length; i++) {
                bounds.extend(gmMarkers[i].position);
            }
            map.fitBounds(bounds);
        } else {
            map.setCenter(gmMarkers[0].position);
            map.setZoom(8);
        }
        return;
    };
};

// https://stackoverflow.com/questions/37663674/using-fetch-api-to-access-json
const ajax = function (url, successCallback, failureCallback, skipJsonParse) {
    fetch(url)
    .then(function(response) {
        if (response.ok && !skipJsonParse) {
            return response.json();
        } else if (response.ok && skipJsonParse) {
            return response.text();
        }

        throw new Error("Network response was not okay.");
    })
    .then(function(data) {
        successCallback(data);
    })
    .catch(function(error) {
        failureCallback(error);
        console.log("Fetch error: ", error.message);
    });
};

const bookChapterValid = function (bookId, chapter) {
    let book = books[bookId];

    if (book === undefined || chapter < 0 || chapter > book.numChapters) {
        return false;
    }

    if (chapter === 0 && book.numChapters > 0) {
        return false;
    }

    return true;
};

const booksGrid = function (volume) {
    return htmlDiv({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    });
};

const booksGridContent = function (volume) {
    let gridContent = "";

    volume.books.forEach(function (book) {
        gridContent += htmlLink({
            classKey: CLASS_BUTTON,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        });
    });

    return gridContent;
};

const cacheBooks = function (callback) {
    volumes.forEach(function (volume) {
        let volumeBooks = [];
        let bookId = volume.minBookId;

        while (bookId <= volume.maxBookId) {
            volumeBooks.push(books[bookId]);
            bookId += 1;
        }

        volume.books = volumeBooks;
    });

    if (typeof callback === "function") {
        callback();
    }
};

const chaptersGrid = function (book) {
    return htmlDiv({
        classKey: CLASS_VOLUME,
        content: htmlElement(TAG_HEADER5, book.fullName)
    }) + htmlDiv({
        classKey: CLASS_BOOKS,
        content: chaptersGridContent(book)
    });
};

const chaptersGridContent = function (book) {
    let gridContent = "";
    let chapter = 1;

    while (chapter <= book.numChapters) {
        gridContent += htmlLink({
            classKey: `${CLASS_BUTTON} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#${book.parentBookId}:${book.id}:${chapter}`,
            content: chapter
        });
        chapter += 1;
    }

    return gridContent;
};

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null);
    });

    gmMarkers = [];
};

const encodedScripturesUrlParameters = function (bookId, chapter, verses, isJst) {
    if (bookId !== undefined && chapter !== undefined) {
        let options = "";

        if (verses !== undefined) {
            options += verses;
        }

        if (isJst !== undefined) {
            options += "&jst=JST";
        }

        return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses=${options}`;
    }
};

const getCurrentHash = function () {
    let currentHash = window.location.hash.slice(1).split(":");
    if (currentHash.length === 1 && currentHash[0] === "") {
        return undefined;
    }
    return currentHash;
};

let scripDivOnScreen = DIV_SCRIP1;
let scripDivOffScreen = DIV_SCRIP2;

let animateType = "crossfade";

const transition = function (volume, book, chapter, nextprevious) {
    animateType = nextprevious;
    changeHash(volume, book, chapter);
};

const crossfade = function () {
    $(`#${scripDivOffScreen}`).css({"left": "0px", "opacity": 0})
    $(`#${scripDivOffScreen}`).animate({"opacity": 1, "z-index": 2}, {"duration": ANIMATE_TIME})
    $(`#${scripDivOnScreen}`).animate({"opacity": 0, "z-index": 1}, {"duration": ANIMATE_TIME})
    switchVisibleDivTracker();
};


const switchVisibleDivTracker = function () {
    if (scripDivOnScreen === DIV_SCRIP1) {
        scripDivOnScreen = DIV_SCRIP2;
        scripDivOffScreen = DIV_SCRIP1;
    } else {
        scripDivOnScreen = DIV_SCRIP1;
        scripDivOffScreen = DIV_SCRIP2;
    }
};

// This was also a product of Riley Hales and I working together
const getScripturesCallback = function (chapterHtml) {

    let currentHash = getCurrentHash();
    let prevHash = previousChapter(Number(currentHash[1]), Number(currentHash[2]));
    let previousButton = (prevHash === undefined ? "" : htmlNextButton(prevHash[0], prevHash[1], prevHash[2], "Previous"));
    let nextHash = nextChapter(Number(currentHash[1]), Number(currentHash[2]));
    let nextButton = (nextHash === undefined ? "" : htmlNextButton(nextHash[0], nextHash[1], nextHash[2], "Next"));

    let offscreendiv = document.getElementById(scripDivOffScreen);
    offscreendiv.innerHTML = chapterHtml;
    offscreendiv.getElementsByClassName("divtitle")[0].innerHTML += `<br>${previousButton} ${nextButton}`;

    let width = $("#scriptures").width();
    if (animateType === "Next") {
        $(`#${scripDivOffScreen}`).css({"left": `${width}px`, "opacity": 1});
        $(`#${scripDivOnScreen}`).animate({"left": `-${width}px`}, {"duration": ANIMATE_TIME});
        $(`#${scripDivOffScreen}`).animate({"left": "0px"}, {"duration": ANIMATE_TIME});
        switchVisibleDivTracker();
    } else if (animateType === "Previous") {
        $(`#${scripDivOffScreen}`).css({"left": `-${width}px`, "opacity": 1});
        $(`#${scripDivOnScreen}`).animate({"left": `${width}px`}, {"duration": ANIMATE_TIME});
        $(`#${scripDivOffScreen}`).animate({"left": "0px"}, {"duration": ANIMATE_TIME});
        switchVisibleDivTracker();
    } else if (animateType === "crossfade") {
        crossfade();
    }

    animateType = "crossfade";

    let book = books[requestedBookId];
    if (book !== undefined) {
        injectBreadcrumbs(volumeForId(book.parentBookId), book, requestedChapter);
    } else {
        injectBreadcrumbs();
    }

    setupMarkers();
};

const getScripturesFailure = function (error) {
    console.log(error)
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to retrieve chapter contents.";
    injectBreadcrumbs();
};

const changeHash = function (volumeId, bookId, chapterId) {
    window.location.hash = `#${(volumeId === undefined ? "" : volumeId)}${(bookId === undefined ? "" : ":" + bookId)}${(chapterId === undefined ? "" : ":" + chapterId)}`;
};

const htmlAnchor = function (volume) {
    return `<a name="v${volume.id}" />`;
};

const htmlDiv = function (parameters) {
    let classString = "";
    let contentString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.id !== undefined) {
        idString = ` id="${parameters.id}"`;
    }

    return `<div${idString}${classString}>${contentString}</div>`;
};

const htmlElement = function (tagName, content) {
    return `<${tagName}>${content}</${tagName}>`;
};

const htmlLink = function (parameters) {
    let classString = "";
    let contentString = "";
    let hrefString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.href !== undefined) {
        hrefString = ` href="${parameters.href}"`;
    }

    if (parameters.id !== undefined) {
        idString = ` id="${parameters.id}"`;
    }

    return `<a${idString}${classString}${hrefString}>${contentString}</a>`;
};

// This new htmlHashLink is also a result of Riley Hales and I collaborating
const htmlHashLink = function (volumeIdHash, bookIdHash, chapterIdHash, title, content) {
    return `<a href="javascript:void(0)" onclick="Scriptures.hash(${volumeIdHash}, ${bookIdHash}, ${chapterIdHash})" title="${title}">${content}</a>`;
};

const htmlNextButton = function (hashVol, hashBook, hashChap, nextprevious) {
    return `<a href="javascript:void(0)" onclick="Scriptures.transition(${hashVol}, ${hashBook}, ${hashChap}, '${nextprevious}')" title="${nextprevious}">${nextprevious}</a>`;
};

const htmlListItem = function (content) {
    return htmlElement(TAG_LIST_ITEM, content);
};

const htmlListItemLink = function (content, href = "") {
    return htmlListItem(htmlLink({content, href:`#${href}`}));
};

const init = function (callback) {
    let booksLoaded = false;
    let volumesLoaded = false;

    ajax(URL_BOOKS, function (data) {
        books = data;
        booksLoaded = true;

        if (volumesLoaded) {
            cacheBooks(callback);
        }
    });
    ajax(URL_VOLUMES, function (data) {
        volumes = data;
        volumesLoaded = true;

        if (booksLoaded) {
            cacheBooks(callback);
        }
    });
};

const injectBreadcrumbs = function (volume, book, chapter) {
    let crumbs = "";
    if (volume === undefined) {
        crumbs = htmlListItem(TEXT_TOP_LEVEL);
    } else {
        crumbs = htmlListItemLink(TEXT_TOP_LEVEL);
        if (book === undefined) {
            crumbs += htmlListItem(volume.fullName);
        } else {
            crumbs += htmlListItemLink(volume.fullName, volume.id);
            if (chapter === undefined || chapter <= 0) {
                crumbs += htmlListItem(book.tocName);
            } else {
                crumbs += htmlListItemLink(book.tocName, `${volume.id}:${book.id}`);
                crumbs += htmlListItem(chapter);
            }
        }
    }
    document.getElementById(DIV_BREADCRUMBS).innerHTML = htmlElement(TAG_UNORDERED_LIST, crumbs);
};

const navigateBook = function (bookId) {
    clearMarkers();
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(scripDivOffScreen).innerHTML = htmlDiv({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chaptersGrid(book)
        });
        injectBreadcrumbs(volumeForId(book.parentBookId), book);
        crossfade();
    }
};

const navigateChapter = function (bookId, chapter) {
    requestedBookId = bookId;
    requestedChapter = chapter;
    ajax(encodedScripturesUrlParameters(bookId, chapter), getScripturesCallback, getScripturesFailure, true);
};

const navigateHome = function (volumeId) {
    document.getElementById(scripDivOffScreen).innerHTML = htmlDiv({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });
    injectBreadcrumbs(volumeForId(volumeId));
    crossfade();
};

const nextChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            return [
                book.parentBookId,
                bookId,
                chapter + 1,
                titleForBookChapter(book, chapter + 1)
            ];
        }

        let nextBook = books[bookId + 1];

        if (nextBook !== undefined) {
            let nextChapterValue = 0;

            if (nextBook.numChapters > 0) {
                nextChapterValue = 1;
            }

            return [
                nextBook.parentBookId,
                nextBook.id,
                nextChapterValue,
                titleForBookChapter(nextBook, nextChapterValue)
            ];
        }
    }
};

const onHashChanged = function () {
    // homeVolumeChapterButtons();
    let ids = [];

    if (location.hash !== "" && location.hash.length > 1) {
        ids = location.hash.slice(1).split(":");
    }

    if (ids.length <= 0) {
        navigateHome();
    } else if (ids.length === 1) {
        let volumeId = Number(ids[0]);

        if (volumeId < volumes[0].id || volumeId > volumes.slice(-1)[0].id) {
            navigateHome();
        } else {
            navigateHome(volumeId);
        }
    } else {
        let bookId = Number(ids[1]);

        if (books[bookId] === undefined) {
            navigateHome();
        } else {
            if (ids.length === 2) {
                navigateBook(bookId);
            } else {
                let chapter = Number(ids[2]);

                if (bookChapterValid(bookId, chapter)) {
                    navigateChapter(bookId, chapter);
                } else {
                    navigateHome();
                }
            }
        }
    }
};

const previousChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter > 1) {
            return [
                book.parentBookId,
                bookId,
                chapter - 1,
                titleForBookChapter(book, chapter - 1)
            ];
        }

        let previousBook = books[bookId - 1];

        if (previousBook !== undefined) {
            return [
                book.parentBookId,
                previousBook.id,
                previousBook.numChapters,
                titleForBookChapter(previousBook, previousBook.numChapters)
            ];
        }
    }
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
    })
};

const showLocation = function (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    map.setCenter({lat: Number(latitude), lng: Number(longitude)});
    map.setZoom(10);
};

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

const volumeForId = function (volumeId) {
    if (volumeId !== undefined && volumeId > 0 && volumeId < volumes.length) {
        return volumes[volumeId - 1];
    }
};

const volumesGridContent = function (volumeId) {
    let gridContent = "";

    volumes.forEach(function (volume) {
        if (volumeId === undefined || volumeId === volume.id) {
            gridContent += htmlDiv({
                classKey: CLASS_VOLUME,
                content: htmlAnchor(volume) + htmlElement(TAG_HEADER5, volume.fullName)
            });

            gridContent += booksGrid(volume);
        }
    });

    return gridContent + BOTTOM_PADDING;
};
/*--------------------------------------------------------------
 *                      PUBLIC API
 */
const Scriptures = {
    init,
    onHashChanged,
    showLocation,
    changeHash,
    transition
};

export default Object.freeze(Scriptures);
