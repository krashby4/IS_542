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
 *                      IMPORTS
 */
import Api from "./MapScripApi.js";
import {books} from "./MapScripApi.js";
import Html from "./HtmlHelper.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
import {volumes} from "./MapScripApi.js";

/*--------------------------------------------------------------
 *                      CONSTANTS
 */
const ANIMATE_TIME = 500;
const BOTTOM_PADDING = "<br /><br />";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const DIV_SCRIPTURES = "scriptures";
const DIV_SCRIP1 = "scrip1";
const DIV_SCRIP2 = "scrip2";
const TAG_HEADER5 = "h5";

/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let requestedBookId;
let requestedChapter;
let scripDivOnScreen = DIV_SCRIP1;
let scripDivOffScreen = DIV_SCRIP2;
let animateType = "crossfade";

/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */

// Riley Hales helped with this

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
    return Html.div({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    });
};

const booksGridContent = function (volume) {
    let gridContent = "";

    volume.books.forEach(function (book) {
        gridContent += Html.link({
            classKey: CLASS_BUTTON,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        });
    });

    return gridContent;
};

const chaptersGrid = function (book) {
    return Html.div({
        classKey: CLASS_VOLUME,
        content: Html.element(TAG_HEADER5, book.fullName)
    }) + Html.div({
        classKey: CLASS_BOOKS,
        content: chaptersGridContent(book)
    });
};

const chaptersGridContent = function (book) {
    let gridContent = "";
    let chapter = 1;

    while (chapter <= book.numChapters) {
        gridContent += Html.link({
            classKey: `${CLASS_BUTTON} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#${book.parentBookId}:${book.id}:${chapter}`,
            content: chapter
        });
        chapter += 1;
    }

    return gridContent;
};

const getCurrentHash = function () {
    let currentHash = window.location.hash.slice(1).split(":");
    if (currentHash.length === 1 && currentHash[0] === "") {
        return undefined;
    }
    return currentHash;
};





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

    MapHelper.setupMarkers();
};

const getScripturesFailure = function (error) {
    console.log(error)
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to retrieve chapter contents.";
    injectBreadcrumbs();
};

const changeHash = function (volumeId, bookId, chapterId) {
    window.location.hash = `#${(volumeId === undefined ? "" : volumeId)}${(bookId === undefined ? "" : ":" + bookId)}${(chapterId === undefined ? "" : ":" + chapterId)}`;
};

// This new htmlHashLink is also a result of Riley Hales and I collaborating
const htmlNextButton = function (hashVol, hashBook, hashChap, nextprevious) {
    return `<a href="javascript:void(0)" onclick="Scriptures.transition(${hashVol}, ${hashBook}, ${hashChap}, '${nextprevious}')" title="${nextprevious}">${nextprevious}</a>`;
};

const navigateBook = function (bookId) {
    MapHelper.clearMarkers();
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(scripDivOffScreen).innerHTML = Html.div({
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
    Api.requestChapter(bookId, chapter, getScripturesCallback, getScripturesFailure);
};

const navigateHome = function (volumeId) {
    document.getElementById(scripDivOffScreen).innerHTML = Html.div({
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
            gridContent += Html.div({
                classKey: CLASS_VOLUME,
                content: Html.anchor(volume) + Html.element(TAG_HEADER5, volume.fullName)
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
    init: Api.init,
    onHashChanged,
    showLocation: MapHelper.showLocation,
    changeHash,
    transition
};

export default Object.freeze(Scriptures);
