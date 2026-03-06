import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Radio, Star, TrendingUp } from "lucide-react";
import { FeaturedBanner } from "../components/betting/featured-banner";
import { MatchCard } from "../components/betting/match-card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FEATURED_MATCHES, LIVE_MATCHES, UPCOMING_MATCHES } from "../data/mock-matches";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function SectionHeader({
  icon,
  title,
  count,
  accentColor = "text-white",
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  accentColor?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#252525] px-3 py-2.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-sm font-bold ${accentColor}`}>{title}</span>
        {count !== undefined && (
          <Badge className="h-4 rounded bg-[#3a3a3a] px-1.5 text-[9px] font-bold text-[#a0a0a0] border-0">
            {count}
          </Badge>
        )}
      </div>
      <button
        type="button"
        className="flex items-center gap-0.5 text-[11px] text-[#7090b0] transition-colors hover:text-white"
      >
        View all
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function IndexComponent() {
  const sortedUpcoming = [...UPCOMING_MATCHES].sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
  );

  const footballMatches = UPCOMING_MATCHES.filter((m) => m.sport === "football");
  const basketballMatches = UPCOMING_MATCHES.filter((m) => m.sport === "basketball");

  return (
    <div className="space-y-0">
      <div className="px-3 pt-3 pb-2 sm:px-4">
        <FeaturedBanner matches={FEATURED_MATCHES} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-[#2a2a2a]">
          <TabsList className="flex h-10 w-full justify-start gap-0 rounded-none bg-transparent px-3 sm:px-4">
            {[
              { value: "all", label: "All" },
              { value: "live", label: "Live", badge: LIVE_MATCHES.length },
              { value: "football", label: "Football" },
              { value: "basketball", label: "Basketball" },
              { value: "tennis", label: "Tennis" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative h-full rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs font-medium text-[#7090b0] data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none"
              >
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="ml-1.5 rounded bg-green-600 px-1 py-0.5 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 space-y-0">
          <AllContent
            sortedUpcoming={sortedUpcoming}
            footballMatches={footballMatches}
            basketballMatches={basketballMatches}
          />
        </TabsContent>

        <TabsContent value="live" className="mt-0">
          <div className="rounded-none border-0">
            <SectionHeader
              icon={<Radio className="h-4 w-4 animate-live-pulse text-green-500" />}
              title="Live Now"
              count={LIVE_MATCHES.length}
              accentColor="text-green-400"
            />
            {LIVE_MATCHES.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="football" className="mt-0">
          <div>
            <SectionHeader
              icon={<span>⚽</span>}
              title="Football"
              count={
                footballMatches.length + LIVE_MATCHES.filter((m) => m.sport === "football").length
              }
              accentColor="text-white"
            />
            {LIVE_MATCHES.filter((m) => m.sport === "football").map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {footballMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="basketball" className="mt-0">
          <div>
            <SectionHeader
              icon={<span>🏀</span>}
              title="Basketball"
              count={
                basketballMatches.length +
                LIVE_MATCHES.filter((m) => m.sport === "basketball").length
              }
              accentColor="text-white"
            />
            {LIVE_MATCHES.filter((m) => m.sport === "basketball").map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {basketballMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tennis" className="mt-0">
          <div>
            <SectionHeader
              icon={<span>🎾</span>}
              title="Tennis"
              count={
                LIVE_MATCHES.filter((m) => m.sport === "tennis").length +
                UPCOMING_MATCHES.filter((m) => m.sport === "tennis").length
              }
              accentColor="text-white"
            />
            {LIVE_MATCHES.filter((m) => m.sport === "tennis").map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {UPCOMING_MATCHES.filter((m) => m.sport === "tennis").map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AllContent({
  sortedUpcoming,
  footballMatches,
  basketballMatches,
}: {
  sortedUpcoming: typeof UPCOMING_MATCHES;
  footballMatches: typeof UPCOMING_MATCHES;
  basketballMatches: typeof UPCOMING_MATCHES;
}) {
  return (
    <div className="space-y-0">
      {/* Live Now Section */}
      <div>
        <SectionHeader
          icon={<Radio className="h-4 w-4 animate-live-pulse text-green-500" />}
          title="Live Now"
          count={LIVE_MATCHES.length}
          accentColor="text-green-400"
        />
        {LIVE_MATCHES.slice(0, 4).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
        {LIVE_MATCHES.length > 4 && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 border-b border-[#2a2a2a] bg-[#1e1e1e] py-2 text-xs text-[#7090b0] transition-colors hover:text-white"
          >
            Show {LIVE_MATCHES.length - 4} more live events
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Popular Section */}
      <div className="mt-3">
        <SectionHeader
          icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
          title="Popular"
          accentColor="text-blue-300"
        />
        {sortedUpcoming.slice(0, 5).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Featured Football Section */}
      <div className="mt-3">
        <SectionHeader
          icon={<Star className="h-4 w-4 text-yellow-400" />}
          title="Top Football"
          count={footballMatches.length}
        />
        <div className="border-b border-[#2a2a2a] bg-[#1e1e1e] px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5a8ab0]">
            <span>⚽</span>
            <span>Premier League</span>
          </div>
        </div>
        {footballMatches
          .filter((m) => m.league === "Premier League")
          .map((match) => (
            <MatchCard key={match.id} match={match} showLeague={false} />
          ))}
        <div className="border-b border-[#2a2a2a] bg-[#1e1e1e] px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5a8ab0]">
            <span>⚽</span>
            <span>La Liga</span>
          </div>
        </div>
        {footballMatches
          .filter((m) => m.league === "La Liga")
          .map((match) => (
            <MatchCard key={match.id} match={match} showLeague={false} />
          ))}
        <div className="border-b border-[#2a2a2a] bg-[#1e1e1e] px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5a8ab0]">
            <span>⚽</span>
            <span>Serie A · Brasileirão · More</span>
          </div>
        </div>
        {footballMatches
          .filter((m) => !["Premier League", "La Liga"].includes(m.league))
          .map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
      </div>

      {/* Basketball Section */}
      {basketballMatches.length > 0 && (
        <div className="mt-3">
          <SectionHeader
            icon={<span className="text-base leading-none">🏀</span>}
            title="Basketball"
            count={basketballMatches.length}
          />
          {basketballMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Bottom spacer for mobile nav */}
      <div className="h-4" />
    </div>
  );
}
