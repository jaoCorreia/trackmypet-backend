export type UpdateNotificationDto = {
  title?: string;
  message?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  userId?: number;
  activityScheduleId?: number;
};
