// SSE transport abstraction for MCP
// Swapping this module changes SSE ↔ Streamable HTTP

class SSETransport {
  constructor() {
    this.sessions = new Map();
    this.encoder = new TextEncoder();
  }

  createStream(sessionId, onClose) {
    const session = { controller: null, closed: false };

    const stream = new ReadableStream({
      start: (controller) => {
        session.controller = controller;
      },
      cancel: () => {
        session.closed = true;
        this.sessions.delete(sessionId);
        if (onClose) onClose();
      },
    });

    session.send = (event, data) => {
      if (!session.closed && session.controller) {
        const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        session.controller.enqueue(this.encoder.encode(msg));
      }
    };

    session.close = () => {
      session.closed = true;
      this.sessions.delete(sessionId);
      if (session.controller) {
        try {
          session.controller.close();
        } catch {
          // already closed
        }
      }
    };

    this.sessions.set(sessionId, session);
    return { stream, session };
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }
}

export const sseTransport = new SSETransport();
