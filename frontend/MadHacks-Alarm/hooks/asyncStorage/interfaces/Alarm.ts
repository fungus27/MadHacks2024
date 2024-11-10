export default interface Alarm {
    id: string;
    time: Date;
    enabled: boolean;
    name: string;
    note: string;
    shouldQuery: boolean;
    // repeat: boolean;
    // repeatDays: boolean[];
}