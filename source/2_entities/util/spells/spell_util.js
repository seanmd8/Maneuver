// ----------------Spells.js----------------
// File for spell ai functions.

/**
 * @typedef {Object} Spell A set a behavior, description and pic used by the lich.
 * @property {AIFunction} behavior Function performing the spell.
 * @property {TelegraphFunction=} telegraph Function telegraphing the damaging effects of the spell.
 * @property {TelegraphFunction=} telegraph_other Function telegraphing the non damaging effects of the spell.
 * @property {string} description A description of what the spell does.
 * @property {string} pic A picture to help telegraph the spell.
 */

/**
 * @callback SpellGenerator
 * @returns {Spell}
 */
