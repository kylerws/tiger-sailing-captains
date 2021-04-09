// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Sail } = initSchema(schema);

export {
  Sail
};