import connectToDatabase from "@/app/lib/db";
import NextAuth from "next-auth";
import Otp from "@/models/Otp";
import User from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Function to verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  // Validate secret key existence
  if (!secretKey) {
    throw new Error("خطا در تنظیمات سرور");
  }

  try {
    // Send POST request to Google's reCAPTCHA verification API
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, { method: "POST" });
    const data = await response.json();

    // Return true if verification is successful and score is sufficient
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("خطا در تأیید reCAPTCHA:", error);
    return false;
  }
}

// NextAuth configuration options
export const authOptions = {
  // Define authentication providers
  providers: [
    // Provider for phone number and OTP authentication
    CredentialsProvider({
      name: "Phone OTP",
      id: "phone-otp",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Otp", type: "text" },
        recaptchaToken: { label: "Recaptcha Token", type: "hidden" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const { phone, code, recaptchaToken } = credentials;

        // Validate reCAPTCHA token
        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }

        // Verify OTP
        const otp = await Otp.findOne({ phone, code });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نامعتبر یا منقضی شده است");
        }

        // Find user by phone number
        const user = await User.findOne({ phone });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        // Delete used OTP
        await Otp.deleteOne({ _id: otp._id });

        // Return user object for session
        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),

    // 🔹 ورود با ایمیل و پسورد
    // Provider for email and password authentication
    CredentialsProvider({
      name: "Email & Password",
      id: "email-password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "Recaptcha Token", type: "hidden" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const { email, password, recaptchaToken } = credentials;

        // Validate reCAPTCHA token
        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("ایمیل یا رمز عبور نادرست است");
        }

        // Return user object for session
        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),

    // ورود با ایمیل و کد یک بار مصرف
    // Provider for email and OTP authentication
    CredentialsProvider({
      name: "Email OTP",
      id: "email-otp",
      credentials: {
        email: { label: "Email", type: "text" },
        code: { label: "Otp", type: "text" },
        recaptchaToken: { label: "Recaptcha Token", type: "hidden" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const { email, code, recaptchaToken } = credentials;

        // Validate reCAPTCHA token
        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }

        // Verify OTP
        const otp = await Otp.findOne({ email, code, method: "email" });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نامعتبر یا منقضی شده است");
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        // Delete used OTP
        await Otp.deleteOne({ _id: otp._id });

        // Return user object for session
        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt",
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  // NextAuth secret
  secret: process.env.NEXTAUTH_SECRET,

  // Callbacks for customizing JWT and session
  callbacks: {
    // Add user data to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.email = user.email;
        token.image = user.image;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    // Add user data to session
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        phone: token.phone,
        email: token.email,
        image: token.image,
        isAdmin: token.isAdmin,
      };
      return session;
    },
  },
  // Custom error page
  pages: {
    error: "/auth/login", // Redirect to login page on error
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
