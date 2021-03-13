/*=======================================================================
 * FILE: Chapter.js
 * AUTHOR: Kyler Ashby, with tutorials from Stephen Liddle
 * DATE: Winter 2021
 *
 * DESCRIPTION: Module for chapter updates.
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long
 */

/*global
    console
 */

/*property
    animate, crossfade, css, duration, freeze, getElementById,
    getElementsByClassName, hash, id, innerHTML, left, length, location, log,
    navigateChapter, numChapters, opacity, parentBookId, requestChapter,
    setupMarkers, slice, split, switchVisibleDivTracker, tocName, volumeForId,
    width
*/


/*--------------------------------------------------------------
 *                      IMPORTS
 */
import {books} from "./MapScripApi.js";
import {animateType, scripDivOffScreen, scripDivOnScreen, animateTime} from "./Animation.js";
import Animation from "./Animation.js";
import MapScripApi from "./MapScripApi.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
/*--------------------------------------------------------------
 *                      CONSTANTS
 */
const DIV_SCRIPTURES = "scriptures";


/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let requestedBookId;
let requestedChapter;

/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */
const htmlNextButton = function (hashVol, hashBook, hashChap, nextprevious) {
    return `<a href="javascript:void(0)" onclick="Scriptures.transition(${hashVol}, ${hashBook}, ${hashChap}, '${nextprevious}')" title="${nextprevious}">${nextprevious}</a>`;
};

const getCurrentHash = function () {
    let currentHash = window.location.hash.slice(1).split(":");
    if (currentHash.length === 1 && currentHash[0] === "") {
        return undefined;
    }
    return currentHash;
};

const getScripturesCallback = function (chapterHtml) {
//Practically all animation code is thanks to Riley Hales. He definitely saved my bacon on this one
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
        $(`#${scripDivOnScreen}`).animate({"left": `-${width}px`}, {"duration": animateTime});
        $(`#${scripDivOffScreen}`).animate({"left": "0px"}, {"duration": animateTime});
        Animation.switchVisibleDivTracker();
    } else if (animateType === "Previous") {
        $(`#${scripDivOffScreen}`).css({"left": `-${width}px`, "opacity": 1});
        $(`#${scripDivOnScreen}`).animate({"left": `${width}px`}, {"duration": animateTime});
        $(`#${scripDivOffScreen}`).animate({"left": "0px"}, {"duration": animateTime});
        Animation.switchVisibleDivTracker();
    } else if (animateType === "crossfade") {
        Animation.crossfade();
    }

    let book = books[requestedBookId];
    if (book !== undefined) {
        injectBreadcrumbs(MapScripApi.volumeForId(book.parentBookId), book, requestedChapter);
    } else {
        injectBreadcrumbs();
    }

    MapHelper.setupMarkers();
};

const getScripturesFailure = function (error) {
    console.log(error);
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to retrieve chapter contents.";
    injectBreadcrumbs();
};

const navigateChapter = function (bookId, chapter) {
    requestedBookId = bookId;
    requestedChapter = chapter;
    MapScripApi.requestChapter(bookId, chapter, getScripturesCallback, getScripturesFailure);
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

/*--------------------------------------------------------------
 *                      PUBLIC API
 */
const Chapter = {
    navigateChapter
};

export default Object.freeze(Chapter);