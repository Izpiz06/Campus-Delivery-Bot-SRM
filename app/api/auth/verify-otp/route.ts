import { prisma } from '@/lib/prisma'
//body verification type
type VerifyBody = {
  regno: string
  otp: string
}

//setup
export async function POST(req: Request) {
  try {
    const body: VerifyBody = await req.json()
    const { regno, otp } = body
    // Validate input
    if (!regno || !otp) {
      return Response.json(
        { success: false, message: "Regno and OTP required" },
        { status: 400 }
      )
    }
    // Find OTP record
    const record = await prisma.email_verifications.findFirst({
      where: { regno, otp_code_email: otp }
    })
    // Check if record exists and is not expired
    if (!record) {
      return Response.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      )
    }
    // Check if OTP is expired (assuming expires_at is a Date field)
    if (record.expires_at < new Date()) {
      return Response.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      )
    }
    // Mark user verified
    await prisma.users.update({
      where: { regno },
      data: { is_verified: true }
    })
    // Delete OTP records
    await prisma.email_verifications.deleteMany({
      where: { regno }
    })
    return Response.json({
      success: true,
      message: "Email verified successfully"
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
