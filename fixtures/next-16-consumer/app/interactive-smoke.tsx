"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@agentix/ui";

export function InteractiveSmoke() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Card>
      <CardContent>
        <Button
          colorStyle="filled"
          onClick={() => setClickCount((count) => count + 1)}
        >
          Client clicks: {clickCount}
        </Button>
      </CardContent>
    </Card>
  );
}
