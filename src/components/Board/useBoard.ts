import { useCallback, useMemo, useState } from "react";

import { STAGE_LABELS } from "@/constants/candidate";
import { useMoveCandidateStage } from "@/queries/candidate/mutations";
import { useGetCandidateList } from "@/queries/candidate/queries";
import type { Candidate, Stage } from "@/types/candidate";

export interface MoveFeedback {
  kind: "success" | "error";
  message: string;
}

interface UseBoardReturn {
  columns: Record<Stage, Candidate[]>;
  pending: Record<string, Stage>;
  feedback: MoveFeedback | null;
  isPending: boolean;
  isError: boolean;
  handleMove: (candidate: Candidate, toStage: Stage) => void;
}

function groupByStage(
  candidates: Candidate[],
  pending: Record<string, Stage>,
): Record<Stage, Candidate[]> {
  return candidates.reduce<Record<Stage, Candidate[]>>(
    (grouped, candidate) => {
      grouped[pending[candidate.id] ?? candidate.stage].push(candidate);

      return grouped;
    },
    { screening: [], interview: [], offer: [], hired: [], rejected: [] },
  );
}

export function useBoard(): UseBoardReturn {
  const { data, isPending, isError } = useGetCandidateList();
  const { mutateAsync } = useMoveCandidateStage();

  const [pending, setPending] = useState<Record<string, Stage>>({});
  const [feedback, setFeedback] = useState<MoveFeedback | null>(null);

  const columns = useMemo(
    () => groupByStage(data ?? [], pending),
    [data, pending],
  );

  const handleMove = useCallback(
    (candidate: Candidate, toStage: Stage) => {
      setPending((current) => ({ ...current, [candidate.id]: toStage }));

      void mutateAsync({ id: candidate.id, toStage })
        .then(() =>
          setFeedback({
            kind: "success",
            message: `${candidate.name}님을 ${STAGE_LABELS[toStage]}(으)로 옮겼습니다`,
          }),
        )
        .catch(() =>
          setFeedback({
            kind: "error",
            message: `${candidate.name}님 이동에 실패해 원래대로 되돌렸습니다`,
          }),
        )
        .finally(() =>
          setPending((current) =>
            Object.fromEntries(
              Object.entries(current).filter(([id]) => id !== candidate.id),
            ),
          ),
        );
    },
    [mutateAsync],
  );

  return { columns, pending, feedback, isPending, isError, handleMove };
}
