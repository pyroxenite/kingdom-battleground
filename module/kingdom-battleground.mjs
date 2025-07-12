// Import document classes.
import { KingdomActor } from './documents/actor.mjs';
// Import sheet classes.
import { KingdomActorSheet } from './sheets/actor-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { KINGDOM } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

import { initSockets } from "./sockets.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.kingdombattleground = {
    KingdomActor,
  };

  // Add custom constants for configuration.
  CONFIG.KINGDOM = KINGDOM;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '@strategy - 1d20',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = KingdomActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the General/Unit as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    general: models.KingdomGeneral,
    commandant: models.KingdomCommandant,
    unit: models.KingdomUnit
  }


  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('kingdom-battleground', KingdomActorSheet, {
    makeDefault: true,
    label: 'KINGDOM.SheetLabels.Actor',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));

  console.log("Kingdom Battleground Loaded")
  // ui.notifications.info("Kingdom Battleground Loaded");

  initSockets();

  CONFIG.statusEffects = [
    {
      id: "marche",
      name: "Marche",
      img: "systems/kingdom-battleground/assets/icons/marche.svg",
      flags: { core: { statuses: new Set(["marche"]) } }
    },
    {
      id: "combat",
      name: "Combat",
      img: "systems/kingdom-battleground/assets/icons/combat.svg",
      flags: { core: { statuses: new Set(["combat"]) } }
    },
    {
      id: "charge",
      name: "Charge",
      img: "systems/kingdom-battleground/assets/icons/charge.svg",
      flags: { core: { statuses: new Set(["charge"]) } }
    },
    {
      id: "percee",
      name: "Percée",
      img: "systems/kingdom-battleground/assets/icons/percee.svg",
      flags: { core: { statuses: new Set(["percee"]) } }
    },
    {
      id: "def_charge",
      name: "Défense de charge",
      img: "systems/kingdom-battleground/assets/icons/def_charge.svg",
      flags: { core: { statuses: new Set(["def_charge"]) } }
    },
    {
      id: "def_eparse",
      name: "Défense éparse",
      img: "systems/kingdom-battleground/assets/icons/def_eparse.svg",
      flags: { core: { statuses: new Set(["def_eparse"]) } }
    },
    {
      id: "repos",
      name: "Repos",
      img: "systems/kingdom-battleground/assets/icons/repos.svg",
      flags: { core: { statuses: new Set(["repos"]) } }
    },
    {
      id: "special",
      name: "Special",
      img: "systems/kingdom-battleground/assets/icons/special.svg",
      flags: { core: { statuses: new Set(["special"]) } }
    }
  ];
});



Hooks.on("applyTokenStatusEffect", (token, statusId, active) => {
  console.log("applyTokenStatusEffect!!")
  console.log({token, statusId, active})
  if (!active) return; // Si on retire un effet, ne rien faire

  // Liste des IDs de tes statuts personnalisés
  const statusIds = ["marche", "combat", "charge", "percee", "def_charge", "def_eparse", "repos", "special"];

  // // Si l'effet qu'on applique est dans ta liste personnalisée
  // if (statusIds.includes(effect.id)) {
  //     const otherEffects = token.actor.effects.contents.filter(e => {
  //         const statuses = e.getFlag("core", "statuses");
  //         return statusId && statusId !== effect.id && statusIds.includes(statusId);
  //     });

  //     // Supprimer les autres statuts si présents
  //     for (let e of otherEffects) {
  //         await e.delete();
  //     }
  // }
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
// async function createItemMacro(data, slot) {
//   // First, determine if this is a valid owned item.
//   if (data.type !== 'Item') return;
//   if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
//     return ui.notifications.warn(
//       'You can only create macro buttons for owned Items'
//     );
//   }
//   // If it is, retrieve it based on the uuid.
//   const item = await Item.fromDropData(data);

//   // Create the macro command using the uuid.
//   const command = `game.kingdombattleground.rollItemMacro("${data.uuid}");`;
//   let macro = game.macros.find(
//     (m) => m.name === item.name && m.command === command
//   );
//   if (!macro) {
//     macro = await Macro.create({
//       name: item.name,
//       type: 'script',
//       img: item.img,
//       command: command,
//       flags: { 'kingdom-battleground.itemMacro': true },
//     });
//   }
//   game.user.assignHotbarMacro(macro, slot);
//   return false;
// }

// MARK: DISPLAY
function display_attack_in_chat(conflict_type, actor_name, base_conflict, conflict_total, stance_prop, region_mod, roll_result, success, critique, rival_stance_prop_name, rival_stance_prop, rival_name, rival_region_prop, player_color, height_mod, height_name, esquive_or_precision, range) {
  ChatMessage.create({
      content: `
    <b>${actor_name} ${conflict_type == "attack" ? "attaque" : "réplique contre"} ${rival_name} ${range == "_cac" ? "au corps à corps" : "à distance"}</b>
    <br>
    <table border="1">
      <thead style="background-color: ${player_color}">
        <tr>
          <th>Attribut</th>
          <th>Valeur</th>

        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${conflict_type == "attack" ? "Attaque" : "Défense"}</td>
          <td>${base_conflict}</td>

        </tr>
        <tr>
          <td>Modificateurs</td>
          <td>${s_num(stance_prop[conflict_type + range])} (${stance_prop.name}) ${s_num(region_mod[conflict_type + range] ?? 0)} (${region_mod.name ?? "Plaines"})</td>
        </tr>
        <tr>
          <td>Hauteur</td>

          <td>${s_num(height_mod)} (${height_name})</td>
        </tr>
        <tl>
        <tr>
          <td>${conflict_type == "attack" ? "Esquive" : "Précision"} adverse</td>
          <td>${s_num(-rival_stance_prop[esquive_or_precision + range])} (${rival_stance_prop_name})  ${s_num(-rival_region_prop[esquive_or_precision + range])} (${rival_region_prop.name})</td>
        </tr>
        <tl>
      </tbody>
      <tfoot style="color: white">
        <tr>
          <td>Total ${conflict_type == "attack" ? "Attaque" : "Défense"}</td>
          <td>${conflict_total}</td>
        </tr>
        <tr>
          <td>Résultat du Dé</td>
          <td>${roll_result} ${critique}</td>
        </tr>
        <tr>
          <td>Résultat</td>
          <td>${success ? "Attaque réussie" : "Attaque échoué"}</td>
        </tr>
    </table>
    `
  });
}

// MARK: GET HEIGHT
function get_height(token) {
  let regions = canvas.regions.children[0].children;
  for (let region of regions) {
      if (!token.testInsideRegion(region, token.position)) {
          continue;
      }
      if (region.document.name.slice(0, 7) == "Hauteur") {
          return Number(region.document.name.slice(7,))
      }
  }
  return 0
}

// MARK: GET REGION MODIFIER
function get_region_modifier(token) {
  let regions = canvas.regions.children[0].children;
  for (let region of regions) {
      if (!token.testInsideRegion(region, token.position)) {
          continue;
      }

      if (region.document.name == "Forets") {
          return {
              name: region.document.name,
              vitesse: -1,
              attack_cac: -1, attack_tir: -2,
              defense_cac: +2, defense_tir: +2,
              puissance_cac: -1, puissance_tir: -2,
              intimidation_cac: +1, intimidation_tir: +1,
              esquive_cac: +2, esquive_tir: +2,
              precision_cac: -1, precision_tir: -2,
              armure: +1, armure_tour: 0,
              moral_tour: 0, vitalite_tour: 0
          };
      }
      if (region.document.name == "Fleuves") {
          return {
              name: region.document.name,
              vitesse: -1,
              attack_cac: -3, attack_tir: -3,
              defense_cac: -3, defense_tir: -3,
              puissance_cac: -3, puissance_tir: -2,
              intimidation_cac: -2, intimidation_tir: +2,
              esquive_cac: -2, esquive_tir: -2,
              precision_cac: -2, precision_tir: -2,
              armure: -1, armure_tour: 0,
              moral_tour: 0, vitalite_tour: 0
          };
      }
      if (region.document.name == "Routes") {
          return {
              name: region.document.name,
              vitesse: +1,
              attack_cac: +2, attack_tir: +1,
              defense_cac: 0, defense_tir: -1,
              puissance_cac: +1, puissance_tir: +1,
              intimidation_cac: +1, intimidation_tir: +1,
              esquive_cac: -1, esquive_tir: -2,
              precision_cac: +2, precision_tir: +1,
              armure: 0, armure_tour: 0,
              moral_tour: 0, vitalite_tour: 0
          }
      }
      if (region.document.name == "Batiments") {
          return {
              name: region.document.name,
              vitesse: -1,
              attack_cac: -1, attack_tir: -3,
              defense_cac: +4, defense_tir: +2,
              puissance_cac: 0, puissance_tir: -1,
              intimidation_cac: 0, intimidation_tir: 0,
              esquive_cac: +2, esquive_tir: +4,
              precision_cac: +1, precision_tir: +1,
              armure: +2, armure_tour: 0,
              moral_tour: 0, vitalite_tour: 0
          };
      }
      if (region.document.name == "Ponts") {
          return {
              name: region.document.name,
              vitesse: -1,
              attack_cac: 0, attack_tir: +1,
              defense_cac: +2, defense_tir: +1,
              puissance_cac: -1, puissance_tir: 0,
              intimidation_cac: +1, intimidation_tir: 0,
              esquive_cac: +1, esquive_tir: -2,
              precision_cac: +1, precision_tir: +1,
              armure: 0, armure_tour: 0,
              moral_tour: 0, vitalite_tour: 0
          };
      }
  }
  return {
      name: "Plaine",
      vitesse: 0,
      attack_cac: 0, attack_tir: 0,
      defense_cac: 0, defense_tir: 0,
      puissance_cac: 0, puissance_tir: 0,
      intimidation_cac: 0, intimidation_tir: 0,
      esquive_cac: 0, esquive_tir: 0,
      precision_cac: 0, precision_tir: 0,
      armure: 0, armure_tour: 0,
      moral_tour: 0, vitalite_tour: 0
  };
}

// MARK: GET STANCE PROPERTIES
function get_stance_properties(stance_name) {
  const stances = {
      marche: {
          name: "Marche", vitesse: +1,
          attack_cac: -1, attack_tir: -2,
          defense_cac: -2, defense_tir: -1,
          puissance_cac: +1, puissance_tir: -1,
          intimidation_cac: 0, intimidation_tir: 0,
          esquive_cac: +1, esquive_tir: +2,
          precision_cac: 0, precision_tir: -2,
          armure: -1, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0
      },
      combat: {
          name: "Combat", vitesse: -1,
          attack_cac: +1, attack_tir: +1,
          defense_cac: +1, defense_tir: +1,
          puissance_cac: +2, puissance_tir: +2,
          intimidation_cac: +1, intimidation_tir: +1,
          esquive_cac: 0, esquive_tir: 0,
          precision_cac: +1, precision_tir: +2,
          armure: +1, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0,
      },
      charge: {
          name: "Charge", vitesse: +2,
          attack_cac: +3, attack_tir: -2,
          defense_cac: -1, defense_tir: -2,
          puissance_cac: +3, puissance_tir: -2,
          intimidation_cac: +2, intimidation_tir: -1,
          esquive_cac: +2, esquive_tir: +3,
          precision_cac: +3, precision_tir: -2,
          armure: 0, armure_tour: 0,
          moral_tour: -1, vitalite_tour: 0,
      },
      percee: {
          name: "Percée", vitesse: +1,
          attack_cac: +2, attack_tir: -2,
          defense_cac: -1, defense_tir: -2,
          puissance_cac: +2, puissance_tir: -2,
          intimidation_cac: 0, intimidation_tir: 0,
          esquive_cac: 0, esquive_tir: +2,
          precision_cac: +2, precision_tir: -2,
          armure: 0, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0,
      },
      def_charge: {
          name: "Défense de combat", vitesse: -1,
          attack_cac: -2, attack_tir: -1,
          defense_cac: +4, defense_tir: -2,
          puissance_cac: -1, puissance_tir: -2,
          intimidation_cac: -2, intimidation_tir: +1,
          esquive_cac: +1, esquive_tir: -1,
          precision_cac: 0, precision_tir: -2,
          armure: +2, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0
      },
      def_eparse: {
          name: "Défense à distance", vitesse: 0,
          attack_cac: -3, attack_tir: 0,
          defense_cac: -3, defense_tir: 0,
          puissance_cac: -2, puissance_tir: -1,
          intimidation_cac: -2, intimidation_tir: -1,
          esquive_cac: +2, esquive_tir: +4,
          precision_cac: -2, precision_tir: -1,
          armure: +1, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0
      },
      repos: {
          name: "Repos", vitesse: -2,
          attack_cac: -4, attack_tir: -4,
          defense_cac: -3, defense_tir: -3,
          puissance_cac: -3, puissance_tir: -2,
          intimidation_cac: -2, intimidation_tir: -2,
          esquive_cac: 0, esquive_tir: 0,
          precision_cac: 0, precision_tir: -2,
          armure: -2, armure_tour: +1,
          moral_tour: +1, vitalite_tour: 0,
      },
      tortue: {
          name: "Tortue", vitesse: -2,
          attack_cac: -2, attack_tir: null,
          defense_cac: +3, defense_tir: +3,
          puissance_cac: 0, puissance_tir: 0,
          intimidation_cac: +2, intimidation_tir: null,
          esquive_cac: +2, esquive_tir: +2,
          precision_cac: -2, precision_tir: null,
          armure: +2, armure_tour: 0,
          moral_tour: 0, vitalite_tour: 0,
      },
  }

  let result = stances[stance_name];

  if (result == null) {
      throw new Error(`Could not find stance "${stance_name}".`);
  }

  return result;
}

// MARK: SPECIAL STANCE
function special_stance(actor) {
  if (actor == "Phalange") {
      return "tortue"
  }
  else {
      if (actor == artor_name) {
          ui.notifications.warn(`Attention : Votre ${actor.toLowerCase()} ne possède pas de posture spéciale !
      <br> La posture de combat est priviligié. C'est la sauce du chef`);
      }
      if (actor == rival_name) {
          ui.notifications.warn(`Attention : ${actor.toLowerCase()}  adverse ne possède pas de posture spéciale !
      <br> La posture de combat est priviligié. C'est la sauce du chef`);
      }
      return "combat"
  }
}

// MARK: CRITIQUE TYPE
function critique_type(result) {
  if (result == 1) {
      return "Reussite Critique"
  }
  if (result == 20) {
      return "Echec Critique"
  }
  else {
      return " "
  }
}

// MARK: SIGNE NUM
function s_num(x) {
  if (x == 0) {
      return "0"
  }
  if (x > 0) {
      return `+${x}`
  }
  if (x < 0) {
      return `${x}`
  }
}
// MARK: RANGE TYPE
function range_type(distance) {
  if (distance <= 100) {
      return "_cac"
  }
  if (distance > 100) {
      return "_tir"
  }
}