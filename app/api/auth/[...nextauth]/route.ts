import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Create the handler using the imported authOptions
const handler = NextAuth(authOptions);

// Export the GET and POST methods to handle auth requests
export { handler as GET, handler as POST };
