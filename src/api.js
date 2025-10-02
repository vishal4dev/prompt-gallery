const API_BASE = process.env.REACT_APP_API_BASE || '/api';

export async function listPrompts() {
  const res = await fetch(`${API_BASE}/prompts`);
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
}

export async function createPrompt(payload) {
  const res = await fetch(`${API_BASE}/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create');
  return await res.json();
}

export async function updatePrompt(id, payload) {
  const res = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update');
  return await res.json();
}

export async function deletePrompt(id) {
  const res = await fetch(`${API_BASE}/prompts/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
  return true;
}

export async function markPromptUsed(id) {
  const res = await fetch(`${API_BASE}/prompts/${id}/use`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to mark used');
  return await res.json();
}

