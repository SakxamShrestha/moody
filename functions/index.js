const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sakxustha@gmail.com",
    pass: "bajd suwj bolf moxc",
  },
});

exports.sendDailyReminders = onSchedule("every 1 hours", async () => {
  const now = new Date();
  const currentHour = now.getUTCHours();

  const usersSnapshot = await admin.firestore()
    .collection("users")
    .where("emailReminders.enabled", "==", true)
    .where("emailReminders.preferredTime", "==", currentHour)
    .get();

  const emails = usersSnapshot.docs.map(async (doc) => {
    const user = doc.data();
    const mailOptions = {
      from: "MoodMind <noreply@moodmind.com>",
      to: user.email,
      subject: "📝 Time for Your Daily Journal Entry!",
      html: `
        <h2>Hello ${user.firstName}!</h2>
        <p>It's time to reflect on your day and write in your journal.</p>
        <p>Taking a few minutes to journal can help improve your mental well-being.</p>
        <a href="https://yourdomain.com/new-journal" 
           style="background-color: #2563eb; color: white; padding: 10px 20px; 
           text-decoration: none; border-radius: 5px;">
          Write Now
        </a>
      `,
    };

    return transporter.sendMail(mailOptions);
  });

  await Promise.all(emails);
  return null;
});
