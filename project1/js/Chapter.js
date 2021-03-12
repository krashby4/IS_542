/*=============================================================================
 * FILE: Chapter.js
 * AUTHOR: Kyler Ashby
 * DATE: Winter 2021
 *
 * DESCRIPTION: Module for chapter updates
 *              IS 542, Winter 2021, BYU
 */
/*jslint
    browser, long
*/

/*-----------------------------------------------------------------------------
 *                                  IMPORTS
 */
import {books} from "./MapScripApi.js";
import Api from "./MapScripApi.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
/*-----------------------------------------------------------------------------
 *                                  CONSTANTS
 */
const DIV_SCRIPTURES = "scriptures";

/*-----------------------------------------------------------------------------
 *                                  PRIVATE VARIABLES
*/
let requestedBookId;
let requestedChapter;

/*-----------------------------------------------------------------------------
 *                                  PRIVATE METHODS
*/
// This was also a product of Riley Hales and I working together
const getScripturesCallback = function (chapterHtml) {
    let book = books[requestedBookId];

    document.getElementById(DIV_SCRIPTURES).innerHTML = chapterHtml;
    document.getElementById(DIV_SCRIPTURES).innerHTML += `<div id="wassup"></div>`;

    if (book !== undefined) {
        injectBreadcrumbs(Api.volumeForId(book.parentBookId), book, requestedChapter);
    } else {
        injectBreadcrumbs();
    }

    let currentHash = location.hash.slice(1).split(":");
    let prevHash = previousChapter(Number(currentHash[1]), Number(currentHash[2]));
    let previousButton = (
        prevHash === undefined
        ? ""
        : htmlHashLink(prevHash[0], prevHash[1], prevHash[2], prevHash[3], "Previous")
    );
    let nextHash = nextChapter(Number(currentHash[1]), Number(currentHash[2]));
    let nextButton = (
        nextHash === undefined
        ? ""
        : htmlHashLink(nextHash[0], nextHash[1], nextHash[2], nextHash[3], "Next")
    );
    document.getElementsByClassName("divtitle")[0].innerHTML += `<br>${previousButton}  ${nextButton}`;

    MapHelper.setupMarkers();
};

const getScripturesFailure = function () {
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to retrieve chapter contents.";
    injectBreadcrumbs();
};

// This new htmlHashLink is also a result of Riley Hales and I collaborating
const htmlHashLink = function (volumeIdHash, bookIdHash, chapterIdHash, title, content) {
    return `<a href="javascript:void(0)" onclick="Scriptures.changeHash(${volumeIdHash}, ${bookIdHash}, ${chapterIdHash})" title="${title}">${content}</a>`;
};

const navigateChapter = function (bookId, chapter) {
    requestedBookId = bookId;
    requestedChapter = chapter;
    Api.requestChapter(bookId, chapter, getScripturesCallback, getScripturesFailure);
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

/*-----------------------------------------------------------------------------
 *                                  PUBLIC API
*/

export default Object.freeze(navigateChapter);