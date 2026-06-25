import { Brief, Script, Segment } from '../types';

const BASE: string = import.meta.env.VITE_API_URL ?? 'https://valene-downier-melodie.ngrok-free.dev';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function generateScript(brief: Brief): Promise<Script> {
  return post('/generate', brief);
}

export async function regenerateSegment(scriptId: string, segmentId: string, feedback: string): Promise<Segment> {
  return post('/regenerate', { script_id: scriptId, segment_id: segmentId, feedback });
}

export async function approveScript(scriptId: string): Promise<void> {
  await post('/approve', { script_id: scriptId });
}
