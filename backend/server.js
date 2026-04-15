import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import { sendEmail } from "./utils/sendEmail.js"
import reminderJob from "./utils/reminderJob.js"    

// app config
const app = express()
const port = process.env.PORT || 4000

// connect DB
connectDB()


// middlewares
app.use(express.json())
app.use(cors())


// Start the reminder job
reminderJob()

// test route (Email test)
app.get("/", async (req, res) => {

  try {

    await sendEmail(
      "vitamedclinic085@gmail.com",
      "Test Email from VitaMed Clinic",
      "Your email notification system is working successfully."
    )

    res.send("Email sent successfully 🚀")

  } catch (error) {

    console.log(error)
    res.send("Email failed ❌")

  }

})



// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

// ❗ Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" })
})

// ❗ Error handler
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ message: "Server Error" })
})

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`)
})

