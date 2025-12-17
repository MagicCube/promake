"use client";

import { appMetadata } from "@/app-metadata";
import { createDefaultGeneration, type GenerationInput } from "@/core/types";

export interface Settings {
  lastGeneration: GenerationInput & { batchSize: number };
}

let __settings: Settings = {
  lastGeneration: {
    ...createDefaultGeneration(),
    batchSize: 1,
  },
};

export function getLocalSettings() {
  return __settings;
}

export function loadLocalSettings() {
  if (localStorage.getItem(appMetadata.id + ".settings")) {
    __settings = JSON.parse(
      localStorage.getItem(appMetadata.id + ".settings")!,
    ) as Settings;
  }
  return __settings;
}

export function saveLocalSettings(changes: Partial<Settings>) {
  __settings = {
    ...__settings,
    ...changes,
  };
  localStorage.setItem(
    appMetadata.id + ".settings",
    JSON.stringify(__settings),
  );
}
