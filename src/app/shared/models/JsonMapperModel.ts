export class JsonMapperModel {
    Key: boolean = false;
    Text?: string;
    Number?: number;
    Boolean?: boolean;
    NullValue?: boolean;
    Array?: 'start' | 'end';
    Object?: 'start' | 'end';
    Color?: string;
    Symbol?: boolean = false;
}
