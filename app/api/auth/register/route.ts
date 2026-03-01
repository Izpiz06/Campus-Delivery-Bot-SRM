import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendOTPEmail } from "@/lib/mailer"
import crypto from "crypto"

type RegisterBody = {
  regno: string
  name: string
  email: string
  password: string
  phone?: string
  hostel?: string // hostel name — will be resolved to hostel_id
}
//register route handler
export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json()
    const { regno, name, email, password, phone, hostel } = body

    if (!regno || !name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }
    // Validate regno format (e.g., starts with "RA" followed by digits)
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

    // Resolve hostel name → hostel_id (optional)
    let hostel_id: number | undefined
    if (hostel) {
      const hostelRecord = await prisma.hostels.findUnique({
        where: { hostel_name: hostel }
      })
      if (hostelRecord) hostel_id = hostelRecord.hostel_id
    }
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { regno }
    })
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // If user exists and is verified, reject. If exists but unverified, update details and resend OTP. If not exists, create new user.
    if (existingUser) {
      // If already verified, reject
      if (existingUser.is_verified) {
        return Response.json(
          { success: false, message: "User already exists and is verified" },
          { status: 409 }
        )
      }
      // If unverified, update their details and resend OTP
      await prisma.users.update({
        where: { regno },
        data: {
          name,
          email,
          password_hash: hashedPassword,
          phone: phone || null,
          hostel_id: hostel_id ?? null,
        }
      })
      // Clear old OTPs
      await prisma.email_verifications.deleteMany({ where: { regno } })
    } else {
      // Create new user as NOT verified
      await prisma.users.create({
        data: {
          regno,
          name,
          email,
          password_hash: hashedPassword,
          phone: phone || null,
          hostel_id: hostel_id ?? null,
          is_verified: false,
        }
      })
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString()

    // Store OTP in DB
    await prisma.email_verifications.create({
      data: {
        regno,
        otp_code_email: otp,
        otp_code_mobile: "000000", // placeholder until mobile OTP is implemented
        expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    })

    // Send email
    await sendOTPEmail(email, otp)

    return Response.json(
      { success: true, message: "OTP sent to your email." },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}