import { jwtVerify, SignJWT } from "jose";
import { createHash, randomUUID, timingSafeEqual } from "crypto";

let codes = new Map<
  string,
  {
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    resource: string;
    expiresAt: number;
  }
>();

let refreshTokens = new Map<
  string,
  {
    clientId: string;
    expiresAt: number;
  }
>();

export async function requireBearer(
  handler: (req: Request) => Promise<Response>,
) {
  return async (req: Request) => {
    const header = req.headers.get("authorization") ?? "";

    if (!header || !header.startsWith("Bearer ")) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": `Bearer realm="mcp" resource_metadata="${process.env.BASE_URL}/.well-known/oauth-protected-resource"`,
          },
        },
      );
    }

    try {
      const token = header.split(" ")[1];
      await verifyToken(token!);
      return await handler(req);
    } catch (err) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": `Bearer realm="mcp" resource_metadata="${process.env.BASE_URL}/.well-known/oauth-protected-resource"`,
          },
        },
      );
    }
  };
}

async function verifyToken(token: string) {
  await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!), {
    issuer: "proxmox-mcp",
    audience: "mcp",
  });
}

async function createJWT(clientId: string) {
  return new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(clientId)
    .setIssuedAt()
    .setIssuer("proxmox-mcp")
    .setAudience("mcp")
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function loginPage(params: Record<string, string>): string {
  const hidden = Object.entries(params)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${escape(k)}" value="${escape(v)}">`,
    )
    .join("\n");

  return `
<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, sans-serif;
    background: #f5f6f8;
    color: #1f2937;
  }

  form {
    width: 100%;
    max-width: 360px;
    background: #fff;
    padding: 32px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  h1 {
    margin: 0 0 24px;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
  }

  input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    background: #fff;
  }

  input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  button {
    width: 100%;
    padding: 12px;
    border: 0;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  button:hover {
    background: #1d4ed8;
  }

  button:active {
    background: #1e40af;
  }
</style>

<body>
  <form method="post" action="/authorize">${hidden}
    <h1>Authorize Proxmox MCP</h1>
    <input type="text" name="username" placeholder="Username" autocomplete="username" autofocus>
    <input type="password" name="password" placeholder="Password" autocomplete="current-password">
    <button type="submit">Authorize</button>
  </form>
</body>
  `;
}

const PRM = {
  resource: `${process.env.BASE_URL}/mcp`,
  authorization_servers: [process.env.BASE_URL],
  bearer_methods_supported: ["header"],
};

const authMetadata = {
  issuer: process.env.BASE_URL,
  authorization_endpoint: `${process.env.BASE_URL}/authorize`,
  token_endpoint: `${process.env.BASE_URL}/token`,
  response_types_supported: ["code"],
};

export const oauthRoutes = {
  "/.well-known/oauth-protected-resource": async () => {
    return Response.json(PRM);
  },

  "/.well-known/oauth-protected-resource/mcp": async () => {
    return Response.json(PRM);
  },

  "/.well-known/oauth-authorization-server": async () => {
    return Response.json(authMetadata);
  },

  "/.well-known/openid-configuration": async () => {
    return Response.json(authMetadata);
  },

  "/authorize": async (req) => {
    if (req.method === "GET") {
      const url = new URL(req.url);

      const params = Object.fromEntries(url.searchParams.entries());

      return new Response(loginPage(params), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    if (req.method === "POST") {
      const form = await req.formData();

      if (form.get("client_id") !== process.env.OAUTH_ID) {
        return Response.json(
          {
            error: "Unauthorized",
          },
          {
            status: 401,
          },
        );
      }

      if (
        form.get("username") !== process.env.MCP_USERNAME ||
        form.get("password") !== process.env.MCP_PASSWORD
      ) {
        return Response.json(
          {
            error: "Unauthorized",
          },
          {
            status: 401,
          },
        );
      }

      const code = Buffer.from(randomUUID() + randomUUID()).toString(
        "base64url",
      );

      codes.set(code, {
        clientId: form.get("client_id"),
        redirectUri: form.get("redirect_uri"),
        codeChallenge: form.get("code_challenge"),
        resource: form.get("resource"),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1h
      });

      const url = new URL(form.get("redirect_uri"));
      url.searchParams.set("code", code);
      url.searchParams.set("state", form.get("state"));

      return Response.redirect(url.toString(), 302);
    }

    return Response.json(
      {
        error: "Method Not Allowed",
      },
      {
        status: 405,
      },
    );
  },

  "/token": async (req) => {
    const form = await req.formData();

    if (form.get("grant_type") === "authorization_code") {
      const code = form.get("code");
      const entry = codes.get(code);

      if (!entry || entry.expiresAt < Date.now()) {
        return Response.json(
          {
            error: "Invalid or expired code",
          },
          {
            status: 400,
          },
        );
      }

      if (entry.redirectUri !== form.get("redirect_uri")) {
        return Response.json(
          {
            error: "Invalid grant",
          },
          {
            status: 400,
          },
        );
      }

      if (!form.get("code_verifier")) {
        return Response.json(
          {
            error: "Missing code verifier",
          },
          {
            status: 400,
          },
        );
      }

      const a = Buffer.from(
        createHash("sha256")
          .update(form.get("code_verifier") as string)
          .digest(),
      );

      const b = Buffer.from(entry.codeChallenge, "base64url");

      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return Response.json(
          {
            error: "Invalid code verifier",
          },
          {
            status: 400,
          },
        );
      }

      const token = await createJWT(entry.clientId);

      const refresh = Buffer.from(randomUUID() + randomUUID()).toString(
        "base64url",
      );

      refreshTokens.set(refresh, {
        clientId: entry.clientId,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30d
      });

      console.log(`Issued token for client ${entry.clientId}`);

      return Response.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: refresh,
      });
    }

    if (form.get("grant_type") === "refresh_token") {
      const entry = refreshTokens.get(form.get("refresh_token") as string);

      if (!entry || entry.expiresAt < Date.now()) {
        return Response.json(
          {
            error: "Invalid or expired refresh token",
          },
          {
            status: 400,
          },
        );
      }

      const token = await createJWT(entry.clientId);
      const refresh = Buffer.from(randomUUID() + randomUUID()).toString(
        "base64url",
      );

      refreshTokens.set(refresh, {
        clientId: entry.clientId,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30d
      });

      console.log(`Refreshed token for client ${entry.clientId}`);

      return Response.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: refresh,
      });
    }

    return Response.json(
      {
        error: "Unsupported grant type",
      },
      {
        status: 400,
      },
    );
  },
};
