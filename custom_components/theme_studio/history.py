"""Undo history for the studio editor.

A snapshot (entity id -> state) is recorded every time the live theme is
built. ``undo`` drops the newest snapshot and returns the one before it, which
the service then writes back to the editor entities.
"""

from __future__ import annotations

from collections import deque

MAX_STEPS = 25


class EditorHistory:
    """Bounded list of editor snapshots, newest last."""

    def __init__(self, max_steps: int = MAX_STEPS) -> None:
        self._steps: deque[dict[str, str]] = deque(maxlen=max_steps + 1)
        self.restoring = False

    def __len__(self) -> int:
        return len(self._steps)

    @property
    def can_undo(self) -> bool:
        return len(self._steps) > 1

    def record(self, snapshot: dict[str, str]) -> bool:
        """Store a snapshot unless it equals the newest one or a restore is running."""
        if self.restoring:
            return False
        if self._steps and self._steps[-1] == snapshot:
            return False
        self._steps.append(dict(snapshot))
        return True

    def undo(self) -> dict[str, str] | None:
        """Drop the current snapshot and return the previous one."""
        if not self.can_undo:
            return None
        self._steps.pop()
        return dict(self._steps[-1])
