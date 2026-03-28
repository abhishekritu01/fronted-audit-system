// import type { Metadata } from "next";
// import { Playfair_Display, DM_Sans } from "next/font/google";
// import "./globals.css";

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   display: "swap",
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-display",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Audit FIS — Auditor Registration",
//   description: "Secure auditor onboarding for the Financial Information System",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className="dark">
//       <body className={`${dmSans.variable} ${playfair.variable} font-sans bg-slate-950 text-slate-100 antialiased`}>
//         {children}
//       </body>
//     </html>
//   );
// }





import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audit FIS — Auditor Registration",
  description: "Secure auditor onboarding for the Financial Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
