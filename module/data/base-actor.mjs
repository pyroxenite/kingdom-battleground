import KingdomDataModel from "./base-model.mjs";

export default class KingdomActorBase extends KingdomDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });
    
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

    schema.armor = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    schema.attack = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
    });

    schema.defense = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 1 })
    });

    schema.power = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 1 })
    });

    schema.intimidation = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 1 })
    });

    schema.speed = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 1 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });
  
    // schema.abilities = new fields.SchemaField(Object.keys().reduce((obj, ability) => {
    //   obj[ability] = new fields.SchemaField({
    //     value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
    //   });
    //   return obj;
    // }, {}));

    return schema;
  }

}