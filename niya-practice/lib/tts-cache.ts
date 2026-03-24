import crypto from 'crypto';

interface CacheEntry {
  audioBase64: string;
  voice: string;
  byteSize: number;
  createdAt: number;
  accessedAt: number;
  hits: number;
}

/**
 * Server-side in-memory LRU cache for TTS audio.
 * Avoids re-generating the same text+voice+speed combination.
 *
 * Keyed by a SHA-256 hash of (text + voice + speed + pitch + volume)
 * so we never send raw text through keys.
 */
export class TTSCache {
  private cache = new Map<string, CacheEntry>();
  private maxEntries: number;
  private maxBytes: number;
  private currentBytes = 0;

  constructor(maxEntries = 200, maxMB = 100) {
    this.maxEntries = maxEntries;
    this.maxBytes = maxMB * 1024 * 1024;
  }

  static buildKey(parts: {
    text: string;
    voice: string;
    speed: number;
    pitch?: string;
    volume?: string;
  }): string {
    const raw = `${parts.text}|${parts.voice}|${parts.speed}|${parts.pitch ?? ''}|${parts.volume ?? ''}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    entry.accessedAt = Date.now();
    entry.hits += 1;
    return entry.audioBase64;
  }

  set(key: string, audioBase64: string, voice: string): void {
    const byteSize = Buffer.byteLength(audioBase64, 'utf-8');

    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentBytes -= existing.byteSize;
      this.cache.delete(key);
    }

    this.evictIfNeeded(byteSize);

    this.cache.set(key, {
      audioBase64,
      voice,
      byteSize,
      createdAt: Date.now(),
      accessedAt: Date.now(),
      hits: 0,
    });
    this.currentBytes += byteSize;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }

  get bytesUsed(): number {
    return this.currentBytes;
  }

  clear(): void {
    this.cache.clear();
    this.currentBytes = 0;
  }

  stats(): { entries: number; bytesUsed: number; maxBytes: number; hitRate: string } {
    let totalHits = 0;
    let totalAccesses = 0;
    for (const entry of Array.from(this.cache.values())) {
      totalHits += entry.hits;
      totalAccesses += entry.hits + 1;
    }
    const hitRate = totalAccesses > 0
      ? `${((totalHits / totalAccesses) * 100).toFixed(1)}%`
      : '0%';
    return {
      entries: this.cache.size,
      bytesUsed: this.currentBytes,
      maxBytes: this.maxBytes,
      hitRate,
    };
  }

  private evictIfNeeded(incomingBytes: number): void {
    while (
      (this.cache.size >= this.maxEntries ||
        this.currentBytes + incomingBytes > this.maxBytes) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.accessedAt < oldestTime) {
        oldestTime = entry.accessedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!;
      this.currentBytes -= entry.byteSize;
      this.cache.delete(oldestKey);
    }
  }
}

const globalForCache = globalThis as unknown as { __niyaTTSCache?: TTSCache };

export function getTTSCache(): TTSCache {
  if (!globalForCache.__niyaTTSCache) {
    globalForCache.__niyaTTSCache = new TTSCache();
  }
  return globalForCache.__niyaTTSCache;
}
