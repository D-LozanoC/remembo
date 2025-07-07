import Link from "next/link"

export const DecoratedLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="font-medium text-indigo-600 underline">
    {children}
  </Link>
)