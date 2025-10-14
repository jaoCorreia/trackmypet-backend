export type UpdateScheduleDto= {
    weekDay?: number;
    time?: Date;
    isRecurring?: boolean;
    activityId?: number;
    petId?: number;
}