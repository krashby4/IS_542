/*=======================================================================
 * FILE: Navigation.js
 * AUTHOR: Kyler Ashby
 * DATE: Winter 2021
 *
 * DESCRIPTION: Navigation module (for volumes, books)
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long, for
 */

/*--------------------------------------------------------------
 *                      IMPORTS
 */
import {books} from "./MapScripApi.js";
import {volumes} from "./MapScripApi.js";
import Api from "./MapScripApi.js";
import Html from "./HtmlHelper.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
import navigateChapter from "./Chapter.js";
/*--------------------------------------------------------------
 *                      CONSTANTS
 */
const BOTTOM_PADDING = "<br /><br />";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_SCRIPTURES = "scriptures";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const TAG_HEADER5 = "h5";
/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */

/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */
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

const changeHash = function (volumeId, bookId, chapterId) {
    window.location.hash = `#${(
        volumeId === undefined
        ? ""
        : volumeId
    )}${(
        bookId === undefined
        ? ""
        : ":" + bookId
    )}${(
        chapterId === undefined
        ? ""
        : ":" + chapterId
    )}`;
};

const navigateBook = function (bookId) {
    MapHelper.clearMarkers();
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(DIV_SCRIPTURES).innerHTML = Html.div({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chaptersGrid(book)
        });
        injectBreadcrumbs(Api.volumeForId(book.parentBookId), book);
    }
};


const navigateHome = function (volumeId) {
    document.getElementById(DIV_SCRIPTURES).innerHTML = Html.div({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });
    injectBreadcrumbs(Api.volumeForId(volumeId));
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
const Navigation = {
    onHashChanged,
    changeHash
};

export default Object.freeze(Navigation);