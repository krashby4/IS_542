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


/*property
    anchor, books, changeHash, classKey, clearMarkers, content, crossfade, div,
    element, forEach, freeze, fullName, getElementById, gridName, hash, href,
    id, init, innerHTML, length, link, navigateChapter, numChapters,
    onHashChanged, parentBookId, showLocation, slice, split, transition,
    volumeForId
*/

/*--------------------------------------------------------------
 *                      IMPORTS
 */
import MapScripApi from "./MapScripApi.js";
import {books} from "./MapScripApi.js";
import Html from "./HtmlHelper.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
import {volumes} from "./MapScripApi.js";
import Animation from "./Animation.js";
import Chapter from "./Chapter.js";

/*--------------------------------------------------------------
 *                      CONSTANTS
 */

const BOTTOM_PADDING = "<br /><br />";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const DIV_SCRIP2 = "scrip2";
const TAG_HEADER5 = "h5";

/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let scripDivOffScreen = DIV_SCRIP2;

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



// This was also a product of Riley Hales and I working together
// This new htmlHashLink is also a result of Riley Hales and I collaborating


const navigateBook = function (bookId) {
    MapHelper.clearMarkers();
    let book = books[bookId];

    if (book.numChapters <= 1) {
        Chapter.navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(scripDivOffScreen).innerHTML = Html.div({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chaptersGrid(book)
        });
        injectBreadcrumbs(MapScripApi.volumeForId(book.parentBookId), book);
        Animation.crossfade();
    }
};



const navigateHome = function (volumeId) {
    document.getElementById(scripDivOffScreen).innerHTML = Html.div({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });
    injectBreadcrumbs(MapScripApi.volumeForId(volumeId));
    Animation.crossfade();
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
                    Chapter.navigateChapter(bookId, chapter);
                } else {
                    navigateHome();
                }
            }
        }
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
    init: MapScripApi.init,
    onHashChanged,
    showLocation: MapHelper.showLocation,
    changeHash: Animation.changeHash,
    transition: Animation.transition
};

export default Object.freeze(Scriptures);
