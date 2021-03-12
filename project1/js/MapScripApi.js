/*=============================================================================
 * FILE: MapScripApi.js
 * AUTHOR: Kyler Ashby
 * DATE: Winter 2021
 *
 * DESCRIPTION: Module for interacting with the scriptures.byu.edu server
 *              IS 542, Winter 2021, BYU
 */
/*jslint
    browser, long
*/
/*global
    console
*/

/*-----------------------------------------------------------------------------
 *                                  CONSTANTS
 */
const URL_BASE = "https://scriptures.byu.edu/";
const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;
const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;
/*-----------------------------------------------------------------------------
 *                                  PRIVATE VARIABLES
*/
let books;
let volumes;
/*-----------------------------------------------------------------------------
 *                                  PRIVATE METHODS
*/
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

// https://stackoverflow.com/questions/37663674/using-fetch-api-to-access-json
const getData = function (url, successCallback, failureCallback, skipJsonParse) {
    fetch(url).then(function (response) {
        if (response.ok && !skipJsonParse) {
            return response.json();
        }
        if (response.ok && skipJsonParse) {
            return response.text();
        }

        throw new Error("Network response was not okay.");
    }).then(function (data) {
        successCallback(data);
    }).catch(function (error) {
        failureCallback(error);
        console.log("Fetch error: ", error.message);
    });
};

const init = function (callback) {
    let booksLoaded = false;
    let volumesLoaded = false;

    getData(URL_BOOKS, function (data) {
        books = data;
        booksLoaded = true;

        if (volumesLoaded) {
            cacheBooks(callback);
        }
    });
    getData(URL_VOLUMES, function (data) {
        volumes = data;
        volumesLoaded = true;

        if (booksLoaded) {
            cacheBooks(callback);
        }
    });
};

const requestChapter = function (bookId, chapter, success, failure) {
    getData(encodedScripturesUrlParameters(bookId, chapter), success, failure, true);
};

const volumeForId = function (volumeId) {
    if (volumeId !== undefined && volumeId > 0 && volumeId < volumes.length) {
        return volumes[volumeId - 1];
    }
};
/*-----------------------------------------------------------------------------
 *                                  PUBLIC API
*/
const MapScripApi = {
    init,
    requestChapter,
    volumeForId
};

export {books, volumes};
export default Object.freeze(MapScripApi);