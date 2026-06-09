import { getAdoptionProvider, listProviders } from "@/lib/providers/adoptionProvider";

export interface SyncLogEntry {
  ts: string;
  provider: string;
  result: "ok" | "skipped" | "error";
  message: string;
  pets?: number;
  shelters?: number;
}

const LOG: SyncLogEntry[] = [];

export async function POST_sync(): Promise<SyncLogEntry[]> {
  const provider = getAdoptionProvider();
  try {
    const [pets, shelters] = await Promise.all([provider.listPets(), provider.listShelters()]);
    LOG.unshift({
      ts: new Date().toISOString(),
      provider: provider.id,
      result: "ok",
      message: `Synced ${pets.length} pets and ${shelters.length} shelters.`,
      pets: pets.length,
      shelters: shelters.length,
    });
  } catch (e: any) {
    LOG.unshift({
      ts: new Date().toISOString(),
      provider: provider.id,
      result: "error",
      message: e?.message ?? "Unknown error",
    });
  }
  return LOG.slice(0, 20);
}

export function GET_syncLog(): SyncLogEntry[] {
  return LOG.slice(0, 20);
}

export async function GET_providerStatuses() {
  const ps = listProviders();
  return Promise.all(
    ps.map(async (p) => {
      const s = await Promise.resolve(p.status());
      return { id: p.id, label: p.label, ok: s.ok, message: s.message };
    }),
  );
}
