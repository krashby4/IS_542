/*=======================================================================
 * FILE: Scriptures.js
 * AUTHOR: Kyler Ashby, with tutorials from Stephen Liddle
 * DATE: Winter 2021
 *
 * DESCRIPTION: Front-end JavaScript code for The Scriptures, Mapped.
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long, for
 */

/*--------------------------------------------------------------
 *                      IMPORTS
 */
import Api from "./MapScripApi.js";
import MapHelper from "./MapHelper.js";
import Navigation from "./Navigation.js";

/*--------------------------------------------------------------
    *                      PUBLIC API
    */
const Scriptures = {
    init: Api.init,
    onHashChanged: Navigation.onHashChanged,
    showLocation: MapHelper.showLocation,
    changeHash: Navigation.changeHash
};

export default Object.freeze(Scriptures);