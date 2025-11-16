export type CreateScheduleDto = {
  weekDay: number;
  time: Date;
  isRecurring: boolean;
  activityId: number;
  petId?: number;
};
