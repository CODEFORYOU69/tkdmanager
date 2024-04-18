// app/layout.tsx
import "./globals.css";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >{children}</div>
  );
}
