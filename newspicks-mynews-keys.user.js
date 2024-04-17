// ==UserScript==
// @name           NewsPicks MyNews Keys
// @namespace      https://iwamot.com/
// @version        1.0.2
// @description    NewsPicksのマイニュースが読みやすくなるショートカットキーを提供
// @icon           https://www.google.com/s2/favicons?domain=newspicks.com
// @grant          none
// @author         Takashi Iwamoto <hello@iwamot.com>
// @homepage       https://github.com/iwamot/newspicks-mynews-keys
// @match          https://newspicks.com/timeline/
// @match          https://newspicks.com/timeline
// @updateURL      https://github.com/iwamot/newspicks-mynews-keys/raw/main/newspicks-mynews-keys.user.js
// @downloadURL    https://github.com/iwamot/newspicks-mynews-keys/raw/main/newspicks-mynews-keys.user.js
// ==/UserScript==

(function () {
  "use strict";

  const CELL_CLASS = "timeline-cell";
  const CLICKABLE_CLASS = "clickable";

  function getCells() {
    return document.querySelectorAll("." + CELL_CLASS);
  }

  function focusCell(cell) {
    cell.tabIndex = 0;
    cell.focus();
    cell.scrollIntoView({behavior: 'instant', block: 'center'});
  }

  function findFirstVisibleCell() {
    return Array.from(getCells()).find((cell) => {
      const rect = cell.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });
  }

  function focusFirstVisibleCell() {
    const firstVisible = findFirstVisibleCell();
    if (firstVisible) {
      focusCell(firstVisible);
    }
  }

  function focusFirstCell() {
    const cells = getCells();
    if (cells.length > 0) {
      focusCell(cells[0]);
    }
  }

  function getActiveCell() {
    const activeElement = document.activeElement;
    return activeElement.classList.contains(CELL_CLASS) ? activeElement : null;
  }

  function moveFocus(activeCell, direction) {
    const cells = getCells();
    const currentIndex = Array.from(cells).indexOf(activeCell);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < cells.length) {
      focusCell(cells[newIndex]);
    }
  }

  function openLinkInNewTab(activeCell) {
    const firstLink = activeCell.querySelector("a");
    if (firstLink && firstLink.href) {
      window.open(firstLink.href, "_blank", "noopener,noreferrer");
    }
  }

  function getClickableElement(cell) {
    return cell.querySelector('.' + CLICKABLE_CLASS);
  }

  function clickElement(element) {
    element.click();
  }

  window.addEventListener("keydown", function (e) {
    let activeCell;
    switch (e.key) {
      case "j":
      case "k":
        activeCell = getActiveCell();
        if (activeCell) {
          moveFocus(activeCell, e.key === "j" ? 1 : -1);
        } else {
          focusFirstVisibleCell();
        }
        e.preventDefault();
        break;
      case ".":
        focusFirstCell();
        e.preventDefault();
        break;
      case "b":
        activeCell = getActiveCell();
        if (activeCell) {
          openLinkInNewTab(activeCell);
        }
        e.preventDefault();
        break;
      case "c":
        activeCell = getActiveCell();
        if (activeCell) {
          const clickableElement = getClickableElement(activeCell);
          if (clickableElement) {
            clickElement(clickableElement);
          }
        }
        e.preventDefault();
        break;
    }
  });
})();
