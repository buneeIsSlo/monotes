import * as React from "react"

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)")
    const onChange = () => setIsTouchDevice(mql.matches)
    mql.addEventListener("change", onChange)
    setIsTouchDevice(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isTouchDevice
}
