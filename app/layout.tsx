import '@/app/ui/global.css'
import { rubik, inter, lusitana } from "@/app/ui/fonts"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${lusitana.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
