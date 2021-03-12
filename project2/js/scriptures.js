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
    changeHash, freeze, init, onHashChanged, showLocation, transition
*/

/*--------------------------------------------------------------
 *                      IMPORTS
 */
import MapScripApi from "./MapScripApi.js";
import MapHelper from "./MapHelper.js";
import Animation from "./Animation.js";
import Navigation from "./Navigation.js";

/*--------------------------------------------------------------
 *                      PUBLIC API
 */
const Scriptures = {
    init: MapScripApi.init,
    onHashChanged: Navigation.onHashChanged,
    showLocation: MapHelper.showLocation,
    changeHash: Animation.changeHash,
    transition: Animation.transition
};

export default Object.freeze(Scriptures);
