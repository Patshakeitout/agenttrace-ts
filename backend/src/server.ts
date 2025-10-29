import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // allow all origins (for dev)
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Chat-Endpoint (Stub: We wire up Tool & Trace later.)
app.post('/chat', async (req, res) => {
    const { messages } = req.body ?? {};

    // MVP: Echo + Fake-Trace, until real Agent is available
    const trace = [{ step: 'tool_call', tool: 'sumOrders', args: { customerId: 42 }, result: { total: 199.90 } }];
    res.json({ reply: `OK,  have processed ${messages?.length ?? 1} messages.`, trace, tokens: { prompt: 200, completion: 50 }, cost: 0.001 });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`API on :${port}`));
