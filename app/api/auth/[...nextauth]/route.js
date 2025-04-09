import connectToDatabase from "@/app/lib/db";
import NextAuth from "next-auth";
import Otp from "@/models/Otp";
import User from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

async function verifyRecaptchaToken(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("خطا: RECAPTCHA_SECRET_KEY تعریف نشده است");
    throw new Error("خطا در تنظیمات سرور");
  }

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, { method: "POST" });
    const data = await response.json();
    console.log("پاسخ reCAPTCHA:", data);
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("خطا در تأیید reCAPTCHA:", error);
    return false;
  }
}

export const authOptions = {
  providers: [
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
        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }
        const otp = await Otp.findOne({ phone, code });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نامعتبر یا منقضی شده است");
        }
        const user = await User.findOne({ phone });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }
        await Otp.deleteOne({ _id: otp._id });

        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),

    // 🔹 ورود با ایمیل و پسورد
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

        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("ایمیل یا رمز عبور نادرست است");
        }

        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),

    // ورود با ایمیل و کد یک بار مصرف
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

        if (!recaptchaToken) {
          throw new Error("توکن امنیتی یافت نشد");
        }
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
          throw new Error("تأیید امنیتی ناموفق بود");
        }

        const otp = await Otp.findOne({ email, code, method: "email" });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نامعتبر یا منقضی شده است");
        }
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        await Otp.deleteOne({ _id: otp._id });

        return { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email, image: user.image, isAdmin: user.isAdmin };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
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
  pages: {
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
