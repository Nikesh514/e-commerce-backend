import bcrypt from "bcryptjs";

export const hash = async (password: string) => {
    
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)

}

export const compare = (password:string,hashedPassword:string) => {
    return bcrypt.compare(password, hashedPassword)
}