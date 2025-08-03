import { atom } from 'jotai';

export const mapReadyAtom = atom(false);
export const mapErrorAtom = atom<string | null>(null);
export const is3DModeAtom = atom(false);
