import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, length: number = 4) {
  if (!address) return "";
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}
