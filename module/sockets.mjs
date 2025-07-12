// module/sockets.mjs
export const KB_CHANNEL = "system.kingdom-battleground";

/**
 * Call once (e.g. in your ready hook) to wire up listeners.
 */
export function initSockets() {
  game.socket.on(KB_CHANNEL, async data => {
    switch (data.type) {
      case "attack":                               // defender receives this
        if (game.user.id !== data.defenderUserId) return;
        await showDefenseDialog(data);
        break;

      case "defense":                              // attacker receives reply
        if (game.user.id !== data.attackerUserId) return;
        ui.notifications.info(
          `${data.defenderName} chose: ${data.choice.toUpperCase()}`
        );
        // do follow-up resolution here
        break;
    }
  });

  console.log("Sockets initialized!")
}

/**
 * Send an attack message.
 * attackerToken & defenderToken are fully resolved Token documents.
 */
export function sendAttack(attackerToken, defenderToken) {
  game.socket.emit(KB_CHANNEL, {
    type: "attack",
    attackerUserId : game.user.id,
    attackerName   : attackerToken.name,
    attackerTokenId: attackerToken.id,
    defenderUserId : defenderToken.actor?.owner?.id ?? defenderToken.document?.owner?.id,
    defenderName   : defenderToken.name,
    defenderTokenId: defenderToken.id
  });
}

// ────────────────────────────────────────────────────────────
/* internal helpers */

function respond(choice, original) {
  game.socket.emit(KB_CHANNEL, {
    type: "defense",
    choice,
    attackerUserId: original.attackerUserId,
    defenderName  : game.user.name
  });
}

function showDefenseDialog(data) {
  return new Promise(resolve => {
    new Dialog({
      title  : "You’re under attack!",
      content: `<p><b>${data.attackerName}</b> is attacking <b>${data.defenderName}</b>.</p>
                <p>Choose your response:</p>`,
      buttons: {
        defend: { label: "Defend", callback: () => respond("defend", data) },
        pass  : { label: "Do Nothing", callback: () => respond("none",   data) }
      },
      default: "defend"
    }).render(true);
  });
}