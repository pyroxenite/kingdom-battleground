import KingdomActorBase from "./base-actor.mjs";

export default class KingdomCommandant extends KingdomActorBase {

    static defineSchema() {
      const fields = foundry.data.fields;
      const requiredInteger = { required: true, nullable: false, integer: true };
      const schema = super.defineSchema();
      return schema
    }
  
    prepareDerivedData() {
      
    }
  }
