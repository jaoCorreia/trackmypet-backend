export type CreateScheduleDto = {
  weekDays: number[];
  time: Date;
  isRecurring: boolean;
  activityId: number;
  petId?: number;
};
