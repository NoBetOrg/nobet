import { ChevronRight } from "lucide-react";
import type { Match } from "../../data/mock-matches";
import { LiveIndicator } from "./live-indicator";
import { OddsButton } from "./odds-button";

interface MatchCardProps {
  match: Match;
  showLeague?: boolean;
}

export function MatchCard({ match, showLeague = true }: MatchCardProps) {
  const matchName = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const hasThreeWay = match.odds.draw !== undefined;

  return (
    <div className="group border-b border-[#2a2a2a] bg-[#1e1e1e] px-3 py-2.5 transition-colors hover:bg-[#252525]">
      {showLeague && (
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-[#7090b0]">
          <span>
            {match.sport === "football"
              ? "⚽"
              : match.sport === "basketball"
                ? "🏀"
                : match.sport === "tennis"
                  ? "🎾"
                  : "🏆"}
          </span>
          <span className="font-medium text-[#5a8ab0]">{match.league}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {match.isLive ? (
            <LiveIndicator minute={match.minute} score={match.score} />
          ) : (
            <span className="text-[11px] text-[#7090b0]">{match.startTime}</span>
          )}
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center justify-between">
              <span className="truncate text-[13px] font-medium text-white">
                {match.homeTeam.name}
              </span>
              {match.isLive && match.score && (
                <span className="ml-2 text-sm font-bold text-white">{match.score.home}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="truncate text-[13px] font-medium text-white">
                {match.awayTeam.name}
              </span>
              {match.isLive && match.score && (
                <span className="ml-2 text-sm font-bold text-white">{match.score.away}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {hasThreeWay ? (
            <>
              <OddsButton
                label="1"
                odds={match.odds.home}
                matchId={match.id}
                matchName={matchName}
                market="1X2"
                selection="Home"
              />
              <OddsButton
                label="X"
                odds={match.odds.draw!}
                matchId={match.id}
                matchName={matchName}
                market="1X2"
                selection="Draw"
              />
              <OddsButton
                label="2"
                odds={match.odds.away}
                matchId={match.id}
                matchName={matchName}
                market="1X2"
                selection="Away"
              />
            </>
          ) : (
            <>
              <OddsButton
                label="1"
                odds={match.odds.home}
                matchId={match.id}
                matchName={matchName}
                market="ML"
                selection="Home"
              />
              <OddsButton
                label="2"
                odds={match.odds.away}
                matchId={match.id}
                matchName={matchName}
                market="ML"
                selection="Away"
              />
            </>
          )}
          <button
            type="button"
            className="ml-1 flex h-full items-center text-[#555] transition-colors hover:text-[#7090b0]"
            aria-label="More markets"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
