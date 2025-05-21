import { Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center">
          <Image
            src="/images/SmartFootball.svg"
            alt="SmartFootball Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} SmartFootball. Made with{" "}
            <Heart className="inline-block h-4 w-4 text-blue-500 animate-pulse" /> by{" "}
            <Link href="/" className="font-medium underline underline-offset-4 hover:text-blue-600">
              Qiuyi Yang
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline underline-offset-4 hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline underline-offset-4 hover:text-blue-600">
            Terms of Service
          </Link>
          <Link href="/about" className="hover:underline underline-offset-4 hover:text-blue-600">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  )
} 