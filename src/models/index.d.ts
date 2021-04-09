import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Sail {
  readonly id: string;
  readonly captainID?: string;
  readonly date?: string;
  readonly startTime?: string;
  readonly endTime?: string;
  constructor(init: ModelInit<Sail>);
  static copyOf(source: Sail, mutator: (draft: MutableModel<Sail>) => MutableModel<Sail> | void): Sail;
}