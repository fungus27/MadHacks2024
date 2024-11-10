export default interface Alarm {
    id: string;
    time: Date;
    enabled: boolean;
    name: string;
    // repeat: boolean;
    // repeatDays: boolean[];
}