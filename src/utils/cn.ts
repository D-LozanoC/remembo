export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined
export type ClassDictionary = { [id: string]: any }
export type ClassArray = ClassValue[]

export function cn(...inputs: ClassValue[]) {
    return inputs.filter(Boolean).join(' ')
}