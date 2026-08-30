import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SearchFilterProps } from "@/components/SearchFilter";
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
  filter: SearchFilterProps;
  selected: Candidate | null;
  isFiltered: boolean;
  handleMove: (candidate: Candidate, toStage: Stage) => void;
  openDetail: (candidate: Candidate) => void;
  closeDetail: () => void;
  resetFilter: () => void;
}

const DEBOUNCE_MS = 200;

// 카드 하나당 요청 한 개만 떠 있게 하고, 그동안 들어온 의도는 최신 것 하나만 남긴다.
type MoveSlot = { queued?: Stage };

// 디바운스는 무거운 렌더 횟수를 줄이고, useDeferredValue 는 그 한 번이 다음 입력을 막지 않게 한다.
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// 필터가 비어 있으면 원본을 그대로 돌려준다. 매 렌더 새 배열을 만들지 않기 위함이다.
function filterCandidates(
  candidates: Candidate[],
  query: string,
  role: string,
): Candidate[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword && !role) return candidates;

  return candidates.filter(
    (candidate) =>
      (!role || candidate.role === role) &&
      (!keyword || candidate.name.toLowerCase().includes(keyword)),
  );
}

function collectRoles(candidates: Candidate[]): string[] {
  return [...new Set(candidates.map(({ role }) => role))].sort((a, b) =>
    a.localeCompare(b, "ko"),
  );
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
  const { data } = useGetCandidateList();
  const { mutateAsync } = useMoveCandidateStage();

  const [pending, setPending] = useState<Record<string, Stage>>({});
  const [feedback, setFeedback] = useState<MoveFeedback | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const openDetail = useCallback((candidate: Candidate) => setSelected(candidate), []);
  const closeDetail = useCallback(() => setSelected(null), []);

  const resetFilter = useCallback(() => {
    setQuery("");
    setRole("");
  }, []);

  // 객체를 넘기면 렌더마다 새 identity 라 영원히 stale 이다. 원시값 두 개로 나눈다.
  const deferredQuery = useDeferredValue(useDebouncedValue(query, DEBOUNCE_MS));
  const deferredRole = useDeferredValue(role);
  const isFiltered = deferredQuery.trim() !== "" || deferredRole !== "";

  const roles = useMemo(() => collectRoles(data), [data]);

  const visible = useMemo(
    () => filterCandidates(data, deferredQuery, deferredRole),
    [data, deferredQuery, deferredRole],
  );

  const columns = useMemo(
    () => groupByStage(visible, pending),
    [visible, pending],
  );

  const slotsRef = useRef(new Map<string, MoveSlot>());

  const handleMove = useCallback(
    (candidate: Candidate, toStage: Stage) => {
      setPending((current) => ({ ...current, [candidate.id]: toStage }));

      const slots = slotsRef.current;
      const running = slots.get(candidate.id);

      // 이미 떠 있으면 요청을 새로 쏘지 않고 최신 의도만 덮어쓴다.
      // 동시에 두 개를 쏘면 응답이 역순으로 도착해 낡은 값이 서버에 마지막으로 쓰인다.
      if (running) {
        running.queued = toStage;
        return;
      }

      const slot: MoveSlot = {};
      slots.set(candidate.id, slot);

      void (async () => {
        let target = toStage;

        for (;;) {
          try {
            await mutateAsync({ id: candidate.id, toStage: target });
            setFeedback({
              kind: "success",
              message: `${candidate.name}님을 ${STAGE_LABELS[target]}(으)로 옮겼습니다`,
            });
          } catch {
            setFeedback({
              kind: "error",
              message: `${candidate.name}님 이동에 실패해 원래대로 되돌렸습니다`,
            });
          }

          const next = slot.queued;
          if (next === undefined) break;

          slot.queued = undefined;
          target = next;
        }

        // 큐가 빈 뒤에야 오버레이를 걷는다. 중간에 걷으면 아직 뜬 요청이 있는데 화면이 먼저 튄다.
        slots.delete(candidate.id);
        setPending((current) =>
          Object.fromEntries(
            Object.entries(current).filter(([id]) => id !== candidate.id),
          ),
        );
      })();
    },
    [mutateAsync],
  );

  return {
    columns,
    pending,
    feedback,
    selected,
    isFiltered,
    handleMove,
    openDetail,
    closeDetail,
    resetFilter,
    filter: {
      query,
      role,
      roles,
      total: data.length,
      matched: visible.length,
      onQueryChange: setQuery,
      onRoleChange: setRole,
    },
  };
}
