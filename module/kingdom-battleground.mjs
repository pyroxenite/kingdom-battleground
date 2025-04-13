// Import document classes.
import { KingdomActor } from './documents/actor.mjs';
// Import sheet classes.
import { KingdomActorSheet } from './sheets/actor-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { KINGDOM } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

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
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = KingdomActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.KingdomCharacter,
    npc: models.KingdomNPC
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