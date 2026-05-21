import cron from "node-cron";
import medicalRecordModel from "../models/medicalRecordModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "./sendEmail.js";

let isRunning = false; // يمنع التكرار

const followUpReminder = () => {

  //
  cron.schedule("0 * * * *", async () => {

    if (isRunning) {
      console.log("⏳ Previous reminder still running... skipping");
      return;
    }

    isRunning = true;

    console.log("🔁 Checking follow-up reminders...");

    try {

      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const records = await medicalRecordModel.find({
        followUpRequired: true,
        reminderSent: false,
        followUpDate: { $gte: now, $lte: oneDayLater }
      });

      for (let record of records) {

        const user = await userModel.findById(record.patientId);
        if (!user) continue;

        const followDate = new Date(record.followUpDate);

        const formattedDate = followDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        const diffInHours = (followDate - now) / (1000 * 60 * 60);

        let messageDate = formattedDate;

        if (diffInHours <= 24) {
          messageDate = "tomorrow";
        }

        await sendEmail(
          user.email,
          "Follow-up Reminder - VitaMed Clinic",
`Hello ${user.name},

This is a reminder for your follow-up ${messageDate}.

Please make sure to book your appointment.

VitaMed Clinic`
        );

        record.reminderSent = true;
        await record.save();

        console.log("✅ Email sent to:", user.email);
      }

    } catch (err) {
      console.log("❌ Reminder Error:", err.message);
    }finally {

    isRunning = false;
    }
  });

};

export default followUpReminder;