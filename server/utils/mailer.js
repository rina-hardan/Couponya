import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rinali616235@gmail.com",
    pass: "isnh yzhg wwyl vckl", 
  },
});

const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: "rinali616235@gmail.com",
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
