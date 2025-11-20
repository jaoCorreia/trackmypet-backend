export type UpdateScheduleDto = {
  weekDays?: number[];
  time?: Date;
  isRecurring?: boolean;
  activityId?: number;
  petId?: number;
};
