import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendOTPEmail } from "@/lib/mailer"
//body verification type
type RegisterBody = {
  regno: string
  name: string
  email: string
  password: string
}
//setup
export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json()
    const { regno, name, email, password } = body

    if (!regno || !name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }
    // Validate regno format (e.g., starts with RA followed by digits)
    if (!/^RA\d+$/.test(regno)) {
      return Response.json(
        { success: false, message: "Invalid Registration Number format" },
        { status: 400 }
      )
    }
    // Validate email domain
    if (!email.endsWith("@srmist.edu.in")) {
      return Response.json(
        { success: false, message: "Use your SRM email address" },
        { status: 400 }
      )
    }
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { regno }
    })
    // If user exists and is verified, reject registration
    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user as NOT verified
    await prisma.users.create({
      data: {
        regno,
        name,
        email,
        password_hash: hashedPassword,
        is_verified: false
      }
    })

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in DB
    await prisma.email_verifications.create({
      data: {
        regno,
        otp_code: otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    })

    // Send email
    await sendOTPEmail(email, otp)

    return Response.json(
      {
        success: true,
        message: "User registered. OTP sent to your email."
      },
      { status: 201 }
    )
    // Note: The user is created but not verified until they enter the OTP. The frontend should handle the flow to ask for OTP after registration.
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}