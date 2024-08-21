import { escapeTags, unescapeTags } from "./util";
const yaml = require("js-yaml");

var SETTINGS;
const defaults = {
   title: "",
   description: "",
   image: "",
   icon: "",
   filename: "", //html
   footer: "<small>Powered by IMP!</small>", //html
   css: "", //html
   headHTML: "", //html
   editor: "",
   viewCSS: "",
   author: "",
   keywords: "",
   enableHelpers: false,
   disableInteractivity: false,
   pathToHelpersModule: "",
};

const props = Object.keys(defaults);

//NEW SETTINGS ROUTINES
export function getSettings() {
   return SETTINGS;
}
export function updateSettings(newSettingsObj) {
   SETTINGS = Object.assign(SETTINGS, newSettingsObj);

   //+remove
   //
   return SETTINGS;
}

export function makeSettings(obj) {
   //clean up
   Object.keys(obj).forEach((k) => {
      if (props.indexOf(k) === -1) {
         delete obj[k];
      }
   });
   //unescape
   Object.keys(obj).forEach((k) => {
      typeof obj[k] === "string" && (obj[k] = unescapeTags(obj[k]));
   });
   SETTINGS = obj;
   return obj;
}

/** stringify settings to JSON or YAML
 * @param {*} obj - optional settings
 * @param {Boolean} toYAML - use YAML
 */
export function stringifySettings(obj, toYAML) {
   let tobj = Object.assign({}, obj || SETTINGS);
   Object.keys(tobj).forEach((k) => {
      typeof tobj[k] === "string" && (tobj[k] = escapeTags(tobj[k]));
   });
   tobj = cleanupObj(tobj);
   return toYAML ? yaml.dump(tobj) : JSON.stringify(tobj, null, 2);
}

/**
 * full cleanup: all empty key/value pairs are removed
 * @param {Boolean} safe - remove unsafe settings
 */
export function cleanupObj(obj, safe) {
   return props.reduce((a, e) => {
      if (safe && ["editor", "viewCSS"].indexOf(e) != -1) {
         return a;
      }
      if (prepBool(obj[e])) {
         a[e] = obj[e];
      }
      return a;
   }, {});
}
//add empty values for undefined settngs
export function addEmpties(obj) {
   props.forEach((k) => {
      if (!obj[k]) {
         obj[k] = "";
      }
   });
   return obj;
}

function prepBool(something) {
   if (typeof something === "string") {
      return something.trim();
   }
   return something;
}

// END NEW SETTINGS ROUTINES
