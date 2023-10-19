export class JsonMapperModel {
    // Represents the value for keys, strings, numbers, booleans, etc.
    Value?: JsonValue;

    // Data types to help in rendering. 'Array' and 'Object' types will have implicit 'start' and 'end'
    // based on the context, and 'Value' will be used for primitive data types.
    DataType?: 'ArrayStart' | 'ArrayEnd' | 'ObjectStart' | 'ObjectEnd' | 'Value';

    // Indicates if this represents a key in an object
    IsKey?: boolean;

    // Color, Symbols, or any other visual representation attributes can be added here if needed.

    // Nested data, used when you have objects or arrays within objects or arrays
    NestedData?: JsonMapperModel[];
}

export type JsonValue = string | number | boolean | null;
