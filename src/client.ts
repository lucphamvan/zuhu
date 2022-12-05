/**
 * this file export the prisma instance to execute command on database
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;
