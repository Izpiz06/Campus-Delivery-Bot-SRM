import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/mailer'

type ResendBody = {
  regno: string
}

export async function POST(req: Request) {
  try {
    const body: ResendBody = await req.json()
    const { regno } = body

    if (!regno) {
      return Response.json(
        { success: false, message: "Registration number is required" },
        { status: 400 }
      )
    }

    // Find unverified user
    const user = await prisma.users.findUnique({ where: { regno } })

    if (!user) {
      return Response.json(
        { success: false, message: "User not found. Please register first." },
        { status: 404 }
      )
    }

    if (user.is_verified) {
      return Response.json(
        { success: false, message: "Email is already verified" },
        { status: 400 }
      )
    }

    // Delete old OTPs
    await prisma.email_verifications.deleteMany({ where: { regno } })

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.email_verifications.create({
      data: {
        regno,
        otp_code_email: otp,
        otp_code_mobile: "000000", // placeholder until mobile OTP is implemented
        expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    })

    // Send email
    await sendOTPEmail(user.email!, otp)

    return Response.json({
      success: true,
      message: "OTP resent to your email"
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
