
export interface GenreColor {
  bg: string;
  text: string;
  border: string;
}

export const getGenreColor = (genre: string): GenreColor => {
  const g = genre.toLowerCase();

  if (g.includes("action")) {
    return {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
    };
  }
  if (g.includes("martial arts")) {
    return {
      bg: "bg-[#C9A227]/10",
      text: "text-[#C9A227]",
      border: "border-[#C9A227]/20",
    };
  }
  if (g.includes("fantasy")) {
    return {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
    };
  }
  if (g.includes("cultivation")) {
    return {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    };
  }
  if (g.includes("adventure")) {
    return {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    };
  }
  if (g.includes("romance")) {
    return {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
    };
  }
  if (g.includes("historical")) {
    return {
      bg: "bg-amber-600/10",
      text: "text-amber-500",
      border: "border-amber-600/20",
    };
  }
  if (g.includes("comedy")) {
    return {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
    };
  }

  // Default Fallback
  return {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  };
};
