/*=======================================================================
 * FILE: Animation.js
 * AUTHOR: Kyler Ashby, with tutorials from Stephen Liddle
 * DATE: Winter 2021
 *
 * DESCRIPTION: Module animation functions.
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long
 */

/*global
    console
 */

/*property
    books, catch, forEach, freeze, init, json, log, maxBookId, message,
    minBookId, ok, push, requestChapter, text, then
*/

/*--------------------------------------------------------------
 *                      CONSTANTS
 */


/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */


/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */
/*--------------------------------------------------------------
 *                      PUBLIC API
 */
const MapScripApi = {
    init,
    requestChapter,
    volumeForId
};

export {books, volumes};
export default Object.freeze(MapScripApi);