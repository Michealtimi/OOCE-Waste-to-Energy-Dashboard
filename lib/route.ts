import { NextResponse } from 'next/server';
import { CollectionLog } from '@/lib/types';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]/route';
import { db } from '@vercel/postgres';

// Zod schema for robust validation
const collectionItemSchema = z.object({
  type: z.enum(['bottle', 'crate', 'pet']),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  condition: z.enum(['good', 'damaged', 'crushed']),
});

const collectionLogSchema = z.object({
  items: z.array(collectionItemSchema).min(1, 'At least one item is required.'),
  incentivePaid: z.number().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = await db.connect();
  try {
    const body = await request.json();
    const validation = collectionLogSchema.safeParse(body);

    if (!validation.success) {
      await client.end();
      return NextResponse.json({ message: 'Invalid input.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { items, notes, incentivePaid } = validation.data;
    const partnerId = session.user.partnerId || 'nb_admin_submission';

    await client.sql`BEGIN`; // Start transaction

    const result = await client.sql`
      INSERT INTO collection_logs (partner_id, incentive_paid, notes)
      VALUES (${partnerId}, ${incentivePaid}, ${notes})
      RETURNING id;
    `;
    const logId = result.rows[0].id;

    for (const item of items) {
      await client.sql`
        INSERT INTO collection_items (log_id, type, quantity, condition)
        VALUES (${logId}, ${item.type}, ${item.quantity}, ${item.condition});
      `;
    }

    await client.sql`COMMIT`; // Commit transaction

    return NextResponse.json({ message: 'Collection logged successfully', data: { id: logId } }, { status: 201 });
  } catch (error) {
    await client.sql`ROLLBACK`; // Rollback on error
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let query = `
      SELECT l.id, l.timestamp, l.partner_id as "partnerId", l.incentive_paid as "incentivePaid", l.notes, json_agg(json_build_object('type', i.type, 'quantity', i.quantity, 'condition', i.condition)) as items
      FROM collection_logs l
      JOIN collection_items i ON l.id = i.log_id
    `;

    const queryParams = [];
    if (session.user.role !== 'nb_admin') {
      query += ` WHERE l.partner_id = $1`;
      queryParams.push(session.user.partnerId);
    }

    query += `
      GROUP BY l.id
      ORDER BY l.timestamp DESC;
    `;

    const { rows } = await db.query(query, queryParams);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Failed to fetch collection logs.' }, { status: 500 });
  }
}