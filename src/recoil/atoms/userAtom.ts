import { atom } from "recoil";
import type { User } from "../../types/user";
import type { Customer } from "../../types/customer";


export const userAtom = atom<User | null>({
    key: "userAtom",
    default: null,
})

export const customerAtom = atom<Customer | null>({
    key: "customerAtom",
    default: null,
}) 