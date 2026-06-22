export async function pve(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${process.env.PVE_API_URL}/api2/json/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `PVEAPIToken=${process.env.PVE_API_TOKEN}`,
      ...init.headers,
    },
    ...(process.env.PVE_INSECURE === "true"
      ? { tls: { rejectUnauthorized: false } }
      : {}),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Proxmox ${res.status} ${res.statusText}: ${errorText}`);
  }

  const data = ((await res.json()) as any).data;

  if (data === undefined) {
    return { ok: true, finished: true, data: null };
  }

  if (typeof data === "string" && data.startsWith("UPID:")) {
    const node = data.split(":")[1];
    return waitForTask(node!, data);
  }

  return { ok: true, finished: true, data };
}

export async function waitForTask(node: string, upid: string): Promise<any> {
  let timeout = 10;

  while (true) {
    if (timeout <= 0) {
      return {
        success: true,
        finished: false,
        upid: upid,
        message: "Task still pending after 10 seconds",
      };
    }

    const task = await pve(`nodes/${node}/tasks/${upid}/status`, {
      method: "GET",
    });

    if (task.status === "stopped") {
      if (task.exitstatus === "OK") {
        return {
          success: true,
          finished: true,
          upid: upid,
        };
      } else {
        return {
          success: false,
          finished: true,
          upid: upid,
          message: `Task failed with exit status: ${task.exitstatus}`,
        };
      }
    }

    timeout -= 1;
    await Bun.sleep(1000);
  }
}
