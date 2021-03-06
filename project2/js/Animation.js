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
    animate, changeHash, crossfade, css, duration, freeze, hash, left, location,
    opacity, switchVisibleDivTracker, transition
*/


/*--------------------------------------------------------------
 *                      CONSTANTS
 */
const ANIMATE_TIME = 500;
const DIV_SCRIP1 = "scrip1";
const DIV_SCRIP2 = "scrip2";

/*--------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let animateType;
let scripDivOnScreen = DIV_SCRIP1;
let scripDivOffScreen = DIV_SCRIP2;
let animateTime = ANIMATE_TIME;

/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */

//Practically all animation code is thanks to Riley Hales. He definitely saved my bacon on this one
const changeHash = function (volumeId, bookId, chapterId) {
    window.location.hash = `#${(volumeId === undefined ? "" : volumeId)}${(bookId === undefined ? "" : ":" + bookId)}${(chapterId === undefined ? "" : ":" + chapterId)}`;
};

const transition = function (volume, book, chapter, nextprevious) {
    animateType = nextprevious;
    changeHash(volume, book, chapter);
};

const crossfade = function () {
    $(`#${scripDivOffScreen}`).css({"left": "0px", "opacity": 0});
    $(`#${scripDivOffScreen}`).animate({"opacity": 1, "z-index": 2}, {"duration": animateTime});
    $(`#${scripDivOnScreen}`).animate({"opacity": 0, "z-index": 1}, {"duration": animateTime});
};

const switchVisibleDivTracker = function () {
    if (scripDivOnScreen === DIV_SCRIP1) {
        scripDivOnScreen = DIV_SCRIP2;
        scripDivOffScreen = DIV_SCRIP1;
    } else if (scripDivOnScreen === DIV_SCRIP2) {
        scripDivOnScreen = DIV_SCRIP1;
        scripDivOffScreen = DIV_SCRIP2;
    }
};

/*--------------------------------------------------------------
 *                      PUBLIC API
 */
const Animation = {
    transition,
    crossfade,
    changeHash,
    switchVisibleDivTracker
};

export {animateType, scripDivOffScreen, scripDivOnScreen, animateTime};
export default Object.freeze(Animation);