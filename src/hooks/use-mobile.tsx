
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  )

  React.useEffect(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window !== "undefined") {
      // Set initial values based on actual window width
      const checkIfMobile = () => window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(checkIfMobile())
      setWindowWidth(window.innerWidth)
      
      // Create handler for window resize
      const handleResize = () => {
        setIsMobile(checkIfMobile())
        setWindowWidth(window.innerWidth)
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize)
      
      // Clean up
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { isMobile, windowWidth, MOBILE_BREAKPOINT }
}
