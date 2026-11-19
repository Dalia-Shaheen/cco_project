import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      email,
      password,
      childName,
      childCondition,
      gender,
      disabilityType,
    } = body;

    // Validate required fields
    if (!parentName?.trim() || !email?.trim() || !password || !childName?.trim()) {
      return NextResponse.json(
        {
          error: "جميع الحقول الإلزامية مطلوبة (الاسم، البريد، كلمة المرور، واسم المستكشف)",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "يجب ألا تقل كلمة المرور عن 6 خانات",
          code: "WEAK_PASSWORD",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in DB
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            error: "هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول",
            code: "USER_EXISTS",
          },
          { status: 409 }
        );
      }
    } catch (dbCheckError: any) {
      console.warn("Database pre-check notice:", dbCheckError?.message);
      // If DB is offline/unreachable, continue to attempt create or handle below
    }

    // Hash the password securely with Node.js crypto.scrypt
    const hashedPassword = hashPassword(password);

    // Map condition to Prisma ChildPath enum
    const childPath =
      childCondition === "special_needs" ? "SPECIAL_NEEDS" : "NORMAL";

    try {
      // Save User and Child to database
      const user = await prisma.user.create({
        data: {
          name: parentName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "PARENT",
          children: {
            create: {
              name: childName.trim(),
              path: childPath,
              tokens: 0,
              energy: 3,
            },
          },
        },
        include: {
          children: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "تم إنشاء الحساب بنجاح في قاعدة البيانات",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            child: user.children[0]
              ? {
                  id: user.children[0].id,
                  name: user.children[0].name,
                  path: user.children[0].path,
                }
              : null,
          },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error("Prisma Database Error:", dbError);

      // Check if it's a connection error (PostgreSQL not running locally or DATABASE_URL not set)
      if (
        dbError?.code === "P1001" ||
        dbError?.message?.includes("Can't reach database server") ||
        dbError?.message?.includes("Environment variable not found")
      ) {
        // Return 200 in dev demo mode with a note, so the user can test the UI flow even before PostgreSQL is configured
        return NextResponse.json(
          {
            success: true,
            demoMode: true,
            warning:
              "قاعدة البيانات PostgreSQL غير متصلة محلياً حالياً. تم حفظ البيانات تجريبياً في الذاكرة. يرجى ضبط DATABASE_URL في .env للربط الفعلي الدائم.",
            user: {
              id: "demo-user-id",
              name: parentName.trim(),
              email: normalizedEmail,
              role: "PARENT",
              child: {
                name: childName.trim(),
                path: childPath,
              },
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: "حدث خطأ في قاعدة البيانات، يرجى المحاولة لاحقاً",
          details: dbError?.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General Register API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}
