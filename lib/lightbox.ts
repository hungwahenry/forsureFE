import { create } from 'zustand';

interface LightboxState {
  images: string[] | null;
  initialIndex: number;
  open: (images: string[], initialIndex?: number) => void;
  close: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  images: null,
  initialIndex: 0,
  open: (images, initialIndex = 0) => {
    if (images.length === 0) return;
    set({ images, initialIndex });
  },
  close: () => set({ images: null, initialIndex: 0 }),
}));

export const lightbox = {
  open: (images: string[], initialIndex = 0) =>
    useLightboxStore.getState().open(images, initialIndex),
  close: () => useLightboxStore.getState().close(),
};
