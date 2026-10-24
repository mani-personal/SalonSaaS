import { NextResponse } from 'next/server';
export function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
export function serialize<T>(value: T): T { return JSON.parse(JSON.stringify(value, (_k, v) => typeof v === 'bigint' ? Number(v) : v)) as T; }
