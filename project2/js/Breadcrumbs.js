/*=======================================================================
 * FILE: Breadcrumbs.js
 * AUTHOR: Kyler Ashby, with tutorials from Stephen Liddle
 * DATE: Winter 2021
 *
 * DESCRIPTION: Breadcrumbs constructor functions.
 *              IS 542, Winter 2021, BYU.
 */

/*jslint
    browser, long
 */

/*property
    element, freeze, fullName, getElementById, id, innerHTML, listItem,
    listItemLink, tocName
*/

/*--------------------------------------------------------------
 *                      IMPORTS
 */
import Html from "./HtmlHelper.js";

/*--------------------------------------------------------------
 *                      CONSTANTS
 */
const TAG_UNORDERED_LIST = "ul";
const TEXT_TOP_LEVEL = "The Scriptures";
const DIV_BREADCRUMBS = "crumbs";

/*--------------------------------------------------------------
 *                      PRIVATE METHODS
 */
const breadcrumbsHtml = function (volume, book, chapter) {
    let crumbs = "";
    if (volume === undefined) {
        crumbs = Html.listItem(TEXT_TOP_LEVEL);
    } else {
        crumbs = Html.listItemLink(TEXT_TOP_LEVEL);
        if (book === undefined) {
            crumbs += Html.listItem(volume.fullName);
        } else {
            crumbs += Html.listItemLink(volume.fullName, volume.id);
            if (chapter === undefined || chapter <= 0) {
                crumbs += Html.listItem(book.tocName);
            } else {
                crumbs += Html.listItemLink(book.tocName, `${volume.id}:${book.id}`);
                crumbs += Html.listItem(chapter);
            }
        }
    }
    return Html.element(TAG_UNORDERED_LIST, crumbs);
};

const injectBreadcrumbs = function (volume, book, chapter) {
    document.getElementById(DIV_BREADCRUMBS).innerHTML = breadcrumbsHtml(volume, book, chapter);
};
/*--------------------------------------------------------------
 *                      PUBLIC API
 */
export default Object.freeze(injectBreadcrumbs);