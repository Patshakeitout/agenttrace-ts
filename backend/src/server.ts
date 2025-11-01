import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sumOrders } from './tools/sumOrders';

const app = express();
app.use(cors()); // allow all origins (for dev)
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Chat-Endpoint (Stub: We wire up Tool & Trace later.)
app.post('/chat', async (req, res) => {
    const { prompt } = req.body ?? {};
    let trace: any[] = [];
    let reply = 'I received your message.';

    const { messages } = req.body ?? {};

    if (typeof prompt === 'string' && /summe|bestell|total/i.test(prompt)) { // Regex-literal, case-insensitive
        const args = { customerId: 42 }; // hardcoded for now
        const result = sumOrders(args.customerId);
        trace.push({ step: 'tool_call', tool: 'sumOrders', args, result });
        reply = `The sum of orders for customer ${args.customerId} is ${result.totalSum.toFixed(2)} € (${result.count} orders).`;
    }

    res.json({
        reply,
        trace,
        tokens: { prompt: 120, completion: 45 },
        cost: 0.0009
    });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`API on :${port}`));
