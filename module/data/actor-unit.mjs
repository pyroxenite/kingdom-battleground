import KingdomActorBase from "./base-actor.mjs";

export default class KingdomUnit extends KingdomActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.moral = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    schema.unit_type = new fields.SchemaField({
      value: new fields.TextField({initial: "Infanterie" }),
      
    });
    return schema
  }

  prepareDerivedData() {
    
  }
}