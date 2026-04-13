import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//defintion of request body
type LoginBody={
    regno: string
    password: string
}
//login route handler
export async function POST(req: Request){
    try{
        const {regno, password}=await req.json()
        if(!regno || !password){
            return Response.json(
                {success:false, message: 'Regno and password are required'},
                {status: 400})
        }
        //find user by regno
        const user=await prisma.users.findUnique({
            where: {regno}
        })
        //if user not found or password hash is null, return error
        if(!user){
            return Response.json(
                {success:false, message: 'Invalid regno or password'},
                {status: 401})
        }
        //if email not verified, reject login
        if(!user.is_verified){
            return Response.json(
                {success:false, message: 'Please verify your email before signing in'},
                {status: 403})
        }
        //if password hash is null, return error
        if (!user.password_hash){
            return Response.json(
            { success: false, message: "Invalid regno or password" },
            { status: 401 }
          );
        }
        //compare password with hash(encrypted password)
        const isValid = await bcrypt.compare(password, user.password_hash)
            if(!isValid){
                return Response.json(
                    {success:false, message: 'Invalid regno or password'},
                    {status: 401})
            }
        //generate jwt token with regno and role as payload and secret key from env variable, set expiration to 1 day
        const token=jwt.sign({regno: user.regno, role: user.role},process.env.JWT_SECRET as string,
        {expiresIn: '1d'})
        return Response.json({success:true, token,user:{regno: user.regno, name: user.name, email:user.email, role: user.role}})
    //catch any error and return 500 status code with error message
    } catch(error){
        console.error(error)
        return Response.json(
            {success:false, message: "server error"},{status: 500}
        )
    }
}
