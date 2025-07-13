import KingdomActorBase from "./base-actor.mjs";

export default class KingdomGeneral extends KingdomActorBase {

    static defineSchema() {
      const fields = foundry.data.fields;
      const requiredInteger = { required: true, nullable: false, integer: true };
      const schema = super.defineSchema();
  
      schema.strength = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 20 })
      });

      schema.strategy = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 20 })
      });

      schema.charisma = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 20 })
      });
  
      schema.weaponPower = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 12, min: 1 }),
      });
      return schema
    }
  
    prepareDerivedData() {
      
    }
  }