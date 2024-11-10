export default interface Alarm {
    id: string;
    time: Date;
    enabled: boolean;
    name: string;
    note: string;
    shouldQuery: boolean;
    timeoutId: NodeJS.Timeout;
    // repeat: boolean;
    // repeatDays: boolean[];
}