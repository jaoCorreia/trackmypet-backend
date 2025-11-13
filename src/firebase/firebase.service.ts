import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor() {
    if (!admin.apps.length) {
      try {
        const serviceAccountPath =
          process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
          './keys/firebase-service-account.json';

        const serviceAccount = require(`../../${serviceAccountPath}`);

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        this.logger.log(
          `Firebase Admin initialized successfully using: ${serviceAccountPath}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to initialize Firebase Admin: ${error.message}`,
        );
        this.logger.warn(
          'Push notifications will not work. Please configure Firebase credentials.',
        );
      }
    }
  }

  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        token: deviceToken,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
      return response;
    } catch (error: any) {
      this.logger.error(`Error sending push notification: ${error.message}`);
      throw error;
    }
  }

  async sendPushNotificationToMultiple(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<admin.messaging.BatchResponse> {
    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens: deviceTokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      this.logger.log(
        `Push notifications sent: ${response.successCount} successful, ${response.failureCount} failed`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error sending push notifications to multiple devices: ${error.message}`,
      );
      throw error;
    }
  }

  async sendPushNotificationToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        topic,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent to topic ${topic}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Error sending push notification to topic: ${error.message}`,
      );
      throw error;
    }
  }
}
